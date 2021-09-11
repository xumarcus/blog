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
  if (!cellConstraints) throw new Error('Cell must have at least one option')
  return LOG2P1.get(cellConstraints) ?? null
}

/**
 * Core algorithm
 * Ref: https://github.com/xumarcus/sudoku/blob/master/src/lib.rs
 * This is a Typescript port that supports single solution only. The lack of optimization is deliberate,
 * since it takes around ~20ms to solve a single instance (significant slower than state-of-the-art that
 * focus on pattern matching strategies), and that version is also much harder to understand. Note that
 * this does not use Hopcroft-Karp which is theoretically faster (there's a paper describing how to shave
 * off another O(N = 3) off the solver): it is not known whether the added complexity is worth it.
 */
const solve = (data: CellValue[]): CellValue[] | null => {
  console.assert(data.length === N4)
  const /* mut */ sudoku = data.map(fromCellValue)
  if (!enforceOn(sudoku)) return null
  return sudoku.map(toCellValue)
}

const enforceOn = (/* mut */ sudoku: CellConstraints[], index?: number): boolean => {
  const /* mut */ queue = index !== undefined ? [index] : SPAN // Suboptimal

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const front = queue.shift()
    if (front === undefined) return true
    for (const indicesGetter of INDICES_GETTERS) {
      const indices = indicesGetter(front)
      if (!enforce(indices, sudoku, queue)) return false
    }
  }
}

const enforce = (
  indices: number[],
  /* mut */ sudoku: CellConstraints[],
  /* mut */ queue: number[]
): boolean => {
  const buf = indices.map((index) => sudoku[index])
  const prunedBuf = pruneBuf(buf)
  if (prunedBuf === null) return false
  for (const [index, [cell, prunedCell]] of R.zip(indices, R.zip(buf, prunedBuf))) {
    if (cell !== prunedCell) {
      sudoku[index] = prunedCell
      queue.push(index)
    }
  }
  return true
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
        if (matching === null) prunedBuf[index] = cellConstraints & ~bitmask
        hasMatch ||= Boolean(matching)
      }
    }
    if (!hasMatch) return null
  }
  return prunedBuf
}

// Required for Web Worker
onmessage = ({ data }) => postMessage(solve(data))
