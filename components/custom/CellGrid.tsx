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
import React, { HTMLAttributes } from 'react'
import { Table } from '@mui/material'
import styles from './CellGrid.module.scss'

export interface Coordinates {
  row: number
  col: number
}

export const toIndex = ({ row, col }: Coordinates, colCount: number) => row * colCount + col

interface Props<T> extends HTMLAttributes<HTMLDivElement> {
  values: T[]
  showCoordinates: boolean
  rowCount: number
  colCount: number
  cellConstructor: (
    value: T,
    row: number,
    col: number
  ) => React.ReactNode & {
    onClick?: () => void
  }
}

const CellGrid = <T extends unknown>({
  className,
  values,
  showCoordinates,
  rowCount,
  colCount,
  cellConstructor,
}: Props<T>) => {
  return (
    <Table className={`${styles.cellGrid} ${className}`}>
      {showCoordinates && (
        <thead>
          <tr>
            <td />
            {R.range(0, colCount).map((col) => (
              <td align="center" key={col}>
                {String.fromCharCode(col + 'a'.charCodeAt(0))}
              </td>
            ))}
            <td />
          </tr>
        </thead>
      )}
      <tbody>
        {R.range(0, rowCount).map((row) => (
          <tr key={row}>
            {showCoordinates && <td align="right">{1 + row}</td>}
            {R.range(0, colCount).map((col) => (
              <td align="center" key={`${row}${col}`}>
                {cellConstructor(values[row * rowCount + col], row, col)}
              </td>
            ))}
            {showCoordinates && <td />}
            {/* Symmetry */}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default CellGrid
