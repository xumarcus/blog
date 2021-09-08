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

import React, { useRef, useState } from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import * as R from 'ramda'

interface CellSquareProps {
  row: number
  col: number
  cellConstructor: CellConstructor
}

type CellConstructor = (
  row: number,
  col: number
) => React.ReactNode & {
  onClick?: () => void
}

/**
 * `cellConstructor` should have `w-full h-full` tailwind classes
 */
const CellSquare = ({ row, col, cellConstructor }: CellSquareProps) => {
  const [height, setHeight] = useState(0)
  const ref = useRef(null)
  useResizeObserver(ref, (e) => {
    const { left, right } = e.contentRect
    setHeight(left + right)
  })
  return (
    <td key={col} ref={ref} style={{ height }}>
      {cellConstructor(row, col)}
    </td>
  )
}

interface Props {
  rowCount: number
  colCount: number
  cellConstructor: CellConstructor
}

const CellGrid = ({ rowCount, colCount, cellConstructor }: Props) => {
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
            {R.range(0, colCount).map((col) => (
              <CellSquare
                key={`${row} ${col}`}
                row={row}
                col={col}
                cellConstructor={cellConstructor}
              />
            ))}
            <td className="text-left">{1 + row}</td>
            {/* Tailwind set different width for first/last columns */}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CellGrid
