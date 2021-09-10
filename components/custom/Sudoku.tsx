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
import React, { useState } from 'react'
import CellGrid, { toIndex } from './CellGrid'
import SudokuCell from './sudoku/SudokuCell'
import styles from './Sudoku.module.scss'

export type CellValue = {
  value: number
  isInferred: boolean
} | null

const makeNotInferred = (value: number | null) => (value ? { value, isInferred: false } : null)

const Sudoku = () => {
  const [values, setValues] = useState<CellValue[]>([1, 9, 8, 9].map(makeNotInferred))
  return (
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
              () => makeNotInferred(props.newValue),
              values
            )

            // First render updated Sudoku
            setValues(newValues)

            // Then spawn background worker
            if (window.Worker) {
              const worker = new Worker(new URL('./sudoku/worker.ts', import.meta.url))
              worker.postMessage(newValues)
              worker.onmessage = (event) => setValues(event.data.map(makeNotInferred))
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
  )
}

export default Sudoku
