// Copyright (C) 2021 Marcus Xu
//
// This file is part of blog.
//
// blog is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// blog is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with blog.  If not, see <http://www.gnu.org/licenses/>.

import * as R from 'ramda'
import { SudokuPostMessage, SudokuRecvMessage } from '.'

// Constants

const N1 = 3
const N2 = 9
const N3 = 27
const N4 = 81

const INDICES_GETTERS = [
  (index: number) => {
    const rowIndex = (index / N2) | 0
    return R.range(0, 9).map((i) => rowIndex * N2 + i)
  }, // Row
  (index: number) => R.range(0, 9).map((i) => i * N2 + (index % N2)), // Column
  (index: number) => {
    const blockIndex = (((index / N3) | 0) * N2 + (((index % N2) / N1) | 0)) * N1
    return R.range(0, 3).flatMap((i) => R.range(0, 3).map((j) => blockIndex + i * N2 + j))
  }, // Block
]
const SPAN = R.range(0, 3).flatMap((i) => R.range(0, 3).map((j) => i * (N3 + 1) + j * (N2 + N1)))

// From main thread, with inferred values removed
type CellValue = number | null

// Bitmask
type CellConstraints = number

// Alias
type Index = number
type DomainValue = number
type Sudoku = CellConstraints[]
type Matching = Map<Index, DomainValue>
type ReversedMatching = Map<DomainValue, Index>

const swap = <U, V>([u, v]: [U, V]): [V, U] => [v, u]

const LOG2P1 = new Map<CellConstraints, DomainValue>([
  [0x001, 1],
  [0x002, 2],
  [0x004, 3],
  [0x008, 4],
  [0x010, 5],
  [0x020, 6],
  [0x040, 7],
  [0x080, 8],
  [0x100, 9],
])

const fromCellValue = (cellValue: CellValue) => (cellValue !== null ? (1 << cellValue) >> 1 : 0x1ff)
const toCellValue = (cellConstraints: CellConstraints) => {
  console.assert(cellConstraints)
  return LOG2P1.get(cellConstraints) ?? null
}

const countSetBits = (x: number) => {
  x = (x | 0) - ((x >> 1) & 0x55555555)
  x = (x & 0x33333333) + ((x >> 2) & 0x33333333)
  x = (x + (x >> 4)) & 0x0f0f0f0f
  return (x * 0x01010101) >> 24
}

// Bipartite matching from buf to the domain (1-9)
const dfs = (
  /* ref */ buf: CellConstraints[],
  /* mut */ visitedIndices: Set<number>,
  index: number,
  /* mut */ reversedMatching: ReversedMatching
): boolean => {
  for (const domainValue of R.range(1, N2 + 1)) {
    const bitmask = (1 << domainValue) >> 1
    if (bitmask & buf[index]) {
      const otherIndex = reversedMatching.get(domainValue)
      if (otherIndex !== undefined) {
        if (visitedIndices.has(otherIndex)) continue
        visitedIndices.add(otherIndex)
        if (!dfs(buf, visitedIndices, otherIndex, reversedMatching)) continue
      }
      reversedMatching.set(domainValue, index)
      return true
    }
  }
  return false
}

const bipartiteMatching = (buf: CellConstraints[]): Matching | null => {
  const /* mut */ reversedMatching: ReversedMatching = new Map()
  for (const index of R.range(0, N2)) {
    const /* mut */ visitedIndices = new Set<number>()
    dfs(buf, visitedIndices, index, reversedMatching)
  }
  if (reversedMatching.size !== N2) return null
  return new Map([...reversedMatching.entries()].map(swap))
}

const pruneBuf = (buf: CellConstraints[]): CellConstraints[] | null => {
  const prunedBuf = [...buf]
  for (const [index, cellConstraints] of buf.entries()) {
    let hasMatch = false
    for (const domainValue of R.range(1, N2 + 1)) {
      const bitmask = (1 << domainValue) >> 1
      if (bitmask & cellConstraints) {
        const pruned = R.adjust(index, () => bitmask, buf)
        const matching = bipartiteMatching(pruned)
        if (matching === null) prunedBuf[index] &= ~bitmask
        hasMatch ||= Boolean(matching)
      }
    }
    if (!hasMatch) return null
  }
  return prunedBuf
}

const enforceOn = (/* mut */ sudoku: Sudoku, index?: number): boolean => {
  const /* mut */ queue = index !== undefined ? [index] : SPAN // Should be FIFO queue
  while (queue.length) {
    const front = queue.shift() as number
    for (const getter of INDICES_GETTERS) {
      const indices = getter(front)
      const buf = indices.map((index) => sudoku[index])
      const prunedBuf = pruneBuf(buf)
      if (prunedBuf === null) return false
      for (const [index, [cell, prunedCell]] of R.zip(indices, R.zip(buf, prunedBuf))) {
        if (cell !== prunedCell) {
          sudoku[index] = prunedCell
          queue.push(index)
        }
      }
    }
  }
  return true
}

const runBacktrack = (/* ref */ sudoku: Sudoku): Sudoku | null => {
  const t = sudoku.map((e, i) => [countSetBits(e), i, e]).filter(([setBits]) => setBits > 1)
  if (R.isEmpty(t)) {
    return sudoku
  }
  const [_, index, cellConstraints] = t.reduce(R.min)
  for (const domainValue of R.range(1, N2 + 1)) {
    const bitmask = (1 << domainValue) >> 1
    if (bitmask & cellConstraints) {
      const /* mut */ guess = R.adjust(index, () => bitmask, sudoku)
      const solution = enforceOn(guess, index) && runBacktrack(guess)
      if (solution) {
        return solution
      }
    }
  }
  return null
}

/**
 * Core algorithm
 * Ref: https://github.com/xumarcus/sudoku/blob/master/src/lib.rs
 * This is a Typescript port that supports single solution only. This means we
 * can skip some ugly optimizations in the original version. Anyway, this is
 * significant slower than state-of-the-art that focus on pattern matching
 * strategies. Note that this does not use Hopcroft-Karp which is theoretically
 * faster (there's a paper describing how to shave off another O(N = 3) off the
 * solver). Is the extra complexity worth it?
 */
const work = ({ postValues, canBacktrack }: SudokuPostMessage): SudokuRecvMessage => {
  console.assert(postValues.length === N4)
  const /* mut */ sudoku = postValues.map(fromCellValue)
  if (!enforceOn(sudoku)) return null
  const recvValues = sudoku.map(toCellValue)
  if (canBacktrack && recvValues.includes(null)) {
    const solution = runBacktrack(sudoku)
    return solution && { recvValues: solution.map(toCellValue), didBacktrack: true }
  } else {
    return { recvValues, didBacktrack: false }
  }
}

// Required for Web Worker
onmessage = ({ data }) => postMessage(work(data))
