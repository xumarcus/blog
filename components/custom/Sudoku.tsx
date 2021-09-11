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
import React, { useEffect, useState } from 'react'
import CellGrid, { toIndex } from './CellGrid'
import SudokuCell from './sudoku/SudokuCell'
import styles from './Sudoku.module.scss'

export type CellValue = {
  value: number
  isInput: boolean
} | null

const toCellValue = (value: number | null, prev?: number | null) =>
  value ? { value, isInput: prev !== null } : null

interface SudokuProps {
  initialValues?: (number | null)[]
}

// Update rawValues => Re-render => (branch) postMessage to worker => worker returns inference => Update values => Rerender
const Sudoku = ({ initialValues }: SudokuProps) => {
  const definedInitialValues = initialValues ?? Array(81).fill(null)
  const [rawValues, setRawValues] = useState<(number | null)[]>(definedInitialValues)
  const [values, setValues] = useState<CellValue[]>(definedInitialValues.map(toCellValue))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setValues(rawValues.map(toCellValue))
    if (window.Worker) {
      const worker = new Worker(new URL('./sudoku/worker.ts', import.meta.url))
      worker.postMessage(rawValues)
      worker.onmessage = (event) => {
        console.log(event.data)
        if (event.data) {
          setValues(R.zipWith(toCellValue)(event.data, rawValues))
          setErrorMessage(null)
        } else {
          setErrorMessage(
            'No solution found: numbers across each row, column and block should be unique.'
          )
        }
      }
    } else {
      // Error handling
    }
  }, [rawValues])

  return (
    <>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <CellGrid<CellValue>
        className={styles.sudoku}
        values={values}
        showCoordinates={true}
        rowCount={9}
        colCount={9}
        cellConstructor={(cellValue, row, col) => (
          <SudokuCell
            onMenuClick={(props) =>
              setRawValues(R.adjust(toIndex(props, 9), () => props.newValue, rawValues))
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
