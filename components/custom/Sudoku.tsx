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

interface SudokuProps {
  initialValues?: SudokuRawValue[]
}

export interface SudokuPostMessage {
  postValues: SudokuRawValue[]
  canBacktrack: boolean
}

export type SudokuRecvMessage = {
  recvValues: SudokuRawValue[]
  didBacktrack: boolean
} | null

// Update rawValues => Re-render => (branch) postMessage to worker => worker returns inference => Update values => Rerender
const Sudoku: React.FunctionComponent<SudokuProps> = ({ initialValues }: SudokuProps) => {
  const definedInitialValues = initialValues ?? Array(81).fill(null)
  const [postValues, setPostValues] = useState<SudokuRawValue[]>(definedInitialValues)
  const [values, setValues] = useState<CellValue[]>(definedInitialValues.map(toCellValue))
  const [message, setMessage] = useState<{ type: Color; body: string } | null>(null)
  const [canBacktrack, setCanBacktrack] = useState(false)

  useEffect(() => {
    setValues(postValues.map(toCellValue))
    if (window.Worker) {
      const worker = new Worker(new URL('./sudoku/worker.ts', import.meta.url))
      worker.postMessage({ postValues, canBacktrack })
      worker.onmessage = ({ data }) => {
        if (data) {
          const { recvValues, didBacktrack } = data
          setValues(R.zipWith(toCellValue)(recvValues, postValues))
          if (didBacktrack) {
            setMessage({
              type: 'success',
              body: 'Solution found after backtracking.',
            })
          } else {
            setMessage(null)
          }
        } else {
          if (canBacktrack) {
            setMessage({
              type: 'error',
              body: 'No solution found. Are digits across each row, column and block unique?',
            })
          } else {
            setMessage({
              type: 'info',
              body: 'No solution found. Did you turn on backtracking?',
            })
          }
        }
      }
    } else {
      setMessage({
        type: 'error',
        body: 'Your browser does not support WebWorker.',
      })
    }
  }, [canBacktrack, postValues])

  return (
    <>
      <div className="flex flex-row justify-between">
        <FormControlLabel
          control={
            <Switch checked={canBacktrack} onChange={(e) => setCanBacktrack(e.target.checked)} />
          }
          label="Backtracking"
        />
        {message && <Alert severity={message.type}>{message.body}</Alert>}
      </div>
      <CellGrid<CellValue>
        className={styles.sudoku}
        values={values}
        showCoordinates={true}
        rowCount={9}
        colCount={9}
        cellConstructor={(cellValue, row, col) => (
          <SudokuCell
            onMenuClick={(props) =>
              setPostValues(R.adjust(toIndex(props, 9), () => props.newValue, postValues))
            }
            cellValue={cellValue}
            row={row}
            col={col}
          />
        )}
      />
    </>
  )
}

export default Sudoku
