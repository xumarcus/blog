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

import { Popover } from '@material-ui/core'
import React, { useState } from 'react'
import CellGrid from '../CellGrid'
import SquareWrapper from '../SquareWrapper'

/**
 * BUG: Popover moves upon re-rendering on non-Mobile platforms.
 * Issue seems to be with anchorOrigin/transformOrigin
 */

const SudokuCell = (row: number, col: number) => {
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null)
  const [cellNum, setCellNum] = useState(row * col)
  const handleClick = (newCellNum: number) => setCellNum(newCellNum)
  return (
    <>
      <SquareWrapper>
        <button className="h-full w-full" onClick={(event) => setAnchorEl(event.currentTarget)}>
          {cellNum}
        </button>
      </SquareWrapper>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <SudokuMenu handleClick={handleClick} />
      </Popover>
    </>
  )
}

const SudokuMenu = ({ handleClick }: { handleClick: (newCellNum: number) => void }) => (
  <div className="w-48">
    <CellGrid
      showCoordinates={false}
      rowCount={3}
      colCount={3}
      cellConstructor={(row: number, col: number) => {
        const cellNum = row * 3 + col + 1
        return (
          <SquareWrapper>
            <button className="h-full w-full" onClick={() => handleClick(cellNum)}>
              {cellNum}
            </button>
          </SquareWrapper>
        )
      }}
    />
  </div>
)

const Sudoku = () => (
  <CellGrid showCoordinates={true} rowCount={9} colCount={9} cellConstructor={SudokuCell} />
)

export default Sudoku
