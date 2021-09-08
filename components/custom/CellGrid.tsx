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

import { Table } from '@material-ui/core'
import * as R from 'ramda'
import React from 'react'

type CellConstructor = (
  row: number,
  col: number
) => React.ReactNode & {
  onClick?: () => void
}

interface Props {
  showCoordinates: boolean
  rowCount: number
  colCount: number
  cellConstructor: CellConstructor
}

/**
 * BUG: Dark mode is not applied on Popover
 * Issue seems to be with Tailwind/MaterialUI integration
 */

const CellGrid = ({ showCoordinates, rowCount, colCount, cellConstructor }: Props) => {
  return (
    <Table style={{ tableLayout: 'fixed' }}>
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
            {showCoordinates && (
              <td align="right" style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                {1 + row}
              </td>
            )}
            {R.range(0, colCount).map((col) => (
              <td align="center" key={`${row}${col}`}>
                {cellConstructor(row, col)}
              </td>
            ))}
            {showCoordinates && <td />}
            {/* Tailwind set different width for first/last columns */}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default CellGrid
