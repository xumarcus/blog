// Copyright (C) 2021 Marcus Xu
//
// This file is part of blog.
//
// blog is free software: you can redisTableRowibute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// blog is disTableRowibuted in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with blog.  If not, see <http://www.gnu.org/licenses/>.

import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
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

const CellGrid = ({ showCoordinates, rowCount, colCount, cellConstructor }: Props) => {
  return (
    <Table style={{ tableLayout: 'fixed' }}>
      {showCoordinates && (
        <TableHead>
          <TableRow>
            <TableCell />
            {R.range(0, colCount).map((col) => (
              <TableCell align="center" key={col}>
                {String.fromCharCode(col + 'a'.charCodeAt(0))}
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {R.range(0, rowCount).map((row) => (
          <TableRow key={row}>
            {showCoordinates && <TableCell align="right">{1 + row}</TableCell>}
            {R.range(0, colCount).map((col) => (
              <TableCell align="center" key={`${row}${col}`}>
                {cellConstructor(row, col)}
              </TableCell>
            ))}
            {showCoordinates && <TableCell align="left">{1 + row}</TableCell>}
            {/* Tailwind set different width for first/last columns */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default CellGrid
