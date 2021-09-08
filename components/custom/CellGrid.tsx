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

import React from 'react'
import * as R from 'ramda'

interface Props {
  rowCount: number
  colCount: number
  cellConstructor: (
    row: number,
    col: number
  ) => React.ReactNode & {
    onClick?: () => void
  }
}

/**
 * `cellConstructor` should have `w-full h-full` tailwind classes
 */
const CellGrid = ({ rowCount, colCount, cellConstructor }: Props) => {
  const cellContainerStyle = {
    height: `${(50 / rowCount).toFixed(2)}vw`,
    width: `${(50 / colCount).toFixed(2)}vw`,
  }
  return (
    <table>
      <thead>
        <tr>
          <td />
          {R.range(0, colCount).map((col) => (
            <td className="text-center" key={col}>
              {String.fromCharCode(col + 'a'.charCodeAt(0))}
            </td>
          ))}
          <td />
        </tr>
      </thead>
      <tbody>
        {R.range(0, rowCount).map((row) => (
          <tr key={row}>
            <td className="text-right">{1 + row}</td>
            {R.range(0, colCount).map((col) => {
              return (
                <td key={col}>
                  <div style={cellContainerStyle}>{cellConstructor(row, col)}</div>
                </td>
              )
            })}
            <td className="text-left">{1 + row}</td>
            {/* Tailwind set different width for first/last columns */}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CellGrid
