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

import { Alert, Color } from '@material-ui/lab'
import * as R from 'ramda'
import React, { useEffect, useState } from 'react'
import CellGrid, { toIndex } from './CellGrid'
import SudokuCell from './sudoku/SudokuCell'
import styles from './Sudoku.module.scss'
import { FormControlLabel, Switch } from '@material-ui/core'

export type CellValue = {
  value: number
  isInput: boolean
} | null

export type SudokuRawValue = number | null

const toCellValue = (value: SudokuRawValue, prev?: SudokuRawValue) =>
  value ? { value, isInput: prev !== null } : null

export interface SudokuPostMessage {
  postValues: SudokuRawValue[]
  canBacktrack: boolean
}

export type SudokuRecvMessage = {
  recvValues: SudokuRawValue[]
  didBacktrack: boolean
} | null

type SudokuAlertMessage = {
  type: Color
  body: string
} | null

interface SudokuInnerProps {
  postValues: SudokuRawValue[]
  canBacktrack: boolean
  showHints: boolean
  handleCanBacktrackChange?: (checked: boolean) => void
  handleShowHintsChange?: (checked: boolean) => void
  handleMenuClick?: (index: number, newValue: SudokuRawValue) => void
}

const SudokuInner = ({
  postValues,
  canBacktrack,
  showHints,
  handleCanBacktrackChange,
  handleShowHintsChange,
  handleMenuClick,
}: SudokuInnerProps) => {
  const [values, setValues] = useState<CellValue[]>(postValues.map(toCellValue))
  const [message, setMessage] = useState<SudokuAlertMessage>(null)

  useEffect(() => {
    const handleRecvMessage = (data: SudokuRecvMessage, t0: number): SudokuAlertMessage => {
      if (data) {
        const { recvValues, didBacktrack } = data
        setValues(R.zipWith(toCellValue)(recvValues, postValues))
        if (recvValues.includes(null)) {
          console.assert(!canBacktrack)
          return {
            type: 'info',
            body: 'There may be a full solution. Turn on backtracking?',
          }
        }
        if (!didBacktrack) return null
        return {
          type: 'success',
          body: `Solution found with backtracking in ${(performance.now() - t0) | 0}ms.`,
        }
      }
      return {
        type: 'error',
        body: 'No solution found. Are digits across each row, column and block unique?',
      }
    }

    setValues(postValues.map(toCellValue))
    if (window.Worker) {
      const worker = new Worker(new URL('./sudoku/worker.ts', import.meta.url))
      const t0 = performance.now()
      worker.postMessage({ postValues, canBacktrack })
      worker.onmessage = ({ data }) => setMessage(handleRecvMessage(data, t0))
    } else {
      setMessage({
        type: 'error',
        body: 'Your browser does not support WebWorker.',
      })
    }
  }, [postValues, canBacktrack])

  return (
    <>
      <div className="flex flex-row">
        <FormControlLabel
          control={
            <Switch
              checked={canBacktrack}
              onChange={(event) => handleCanBacktrackChange?.(event.target.checked)}
            />
          }
          label="Backtracking"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showHints}
              onChange={(event) => handleShowHintsChange?.(event.target.checked)}
            />
          }
          label="Show Hints"
        />
        {message && (
          <Alert className="ml-auto" severity={message.type}>
            {message.body}
          </Alert>
        )}
      </div>
      <CellGrid<CellValue>
        className={styles.sudoku}
        values={values}
        showCoordinates={true}
        rowCount={9}
        colCount={9}
        cellConstructor={(cellValue, row, col) => (
          <SudokuCell
            onMenuClick={(props) => handleMenuClick?.(toIndex(props, 9), props.newValue)}
            showHints={showHints}
            cellValue={cellValue}
            row={row}
            col={col}
          />
        )}
      />
    </>
  )
}

interface SudokuProps {
  digits?: number[]
  initCanBacktrack?: boolean
  initShowHints?: boolean
}

const Sudoku: React.FunctionComponent<SudokuProps> = ({
  digits,
  initCanBacktrack,
  initShowHints,
}: SudokuProps) => {
  const [postValues, setPostValues] = useState<SudokuRawValue[]>(
    digits?.map((x) => (1 <= x && x <= 9 ? x : null)) ?? Array(81).fill(null)
  )
  const [canBacktrack, setCanBacktrack] = useState(initCanBacktrack)
  const [showHints, setShowHints] = useState(initShowHints)
  return (
    <SudokuInner
      postValues={postValues}
      canBacktrack={Boolean(canBacktrack)}
      showHints={Boolean(showHints)}
      handleCanBacktrackChange={setCanBacktrack}
      handleShowHintsChange={setShowHints}
      handleMenuClick={(index, newValue) =>
        setPostValues(R.adjust(index, () => newValue, postValues))
      }
    />
  )
}

export default Sudoku
