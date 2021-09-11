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

import { Alert } from '@material-ui/lab'
import * as R from 'ramda'
import React, { useState } from 'react'
import CellGrid, { toIndex } from './CellGrid'
import SudokuCell from './sudoku/SudokuCell'
import styles from './Sudoku.module.scss'

export type CellValue = {
  value: number
  isInput: boolean
} | null

const fromCellValue = (cellValue: CellValue) => (cellValue?.isInput ? cellValue.value : null)

const toCellValue = (value: number | null, prev?: number | null) =>
  value ? { value, isInput: prev !== null } : null

const Sudoku = () => {
  const [values, setValues] = useState<CellValue[]>(
    [1, 9, 8, 4, ...Array(77).fill(null)].map(toCellValue) // @test
  )
  const [hasError, setHasError] = useState(false)
  return (
    <>
      {hasError && (
        <Alert severity="error">
          No solution found: numbers across each row, column and block should be unique.
        </Alert>
      )}
      <CellGrid<CellValue>
        className={styles.sudoku}
        values={values}
        showCoordinates={true}
        rowCount={9}
        colCount={9}
        cellConstructor={(cellValue, row, col) => (
          <SudokuCell
            onClick={(props) => {
              const newValues = R.adjust(
                toIndex(props, 9),
                () => toCellValue(props.newValue),
                values
              )

              // First render updated Sudoku
              setValues(newValues)

              // Then spawn background worker
              if (window.Worker) {
                const worker = new Worker(new URL('./sudoku/worker.ts', import.meta.url))
                const cellValues = newValues.map(fromCellValue)
                worker.postMessage(cellValues)
                worker.onmessage = (event) => {
                  console.log(event.data)
                  if (event.data) {
                    setValues(R.zipWith(toCellValue)(event.data, cellValues))
                    setHasError(false)
                  } else {
                    setValues(newValues)
                    setHasError(true)
                  }
                }
              } else {
                // Error handling
              }
            }}
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
