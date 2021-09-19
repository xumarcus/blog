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
import React from 'react'
import CellGrid from '../CellGrid'
import SquareWrapper from '../SquareWrapper'
import { Typography } from '@mui/material'

interface SudokuMenuProps {
  onMenuClick?: (newValue: number | null) => void
}

/**
 * SudokuMenu is inside Popover which is MaterialUI themed
 */
const SudokuMenu = ({ onMenuClick }: SudokuMenuProps) => (
  <div className="w-48">
    <CellGrid<number>
      values={R.range(1, 10)}
      showCoordinates={false}
      rowCount={3}
      colCount={3}
      cellConstructor={(value) => {
        return (
          <SquareWrapper>
            <button className="h-full w-full" onClick={() => onMenuClick?.(value)}>
              <Typography>{value}</Typography>
            </button>
          </SquareWrapper>
        )
      }}
    />
    <button className="w-full pb-4" onClick={() => onMenuClick?.(null)}>
      <Typography>ERASE</Typography>
    </button>
  </div>
)

export default SudokuMenu
