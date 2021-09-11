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

import { Coordinates } from '../CellGrid'
import { Popover } from '@material-ui/core'
import SquareWrapper from '../SquareWrapper'
import React, { useState } from 'react'
import { CellValue } from '../Sudoku'
import SudokuMenu from './SudokuMenu'
import styles from './SudokuCell.module.scss'

const classNames = require('classnames')

export interface SudokuCellOnMenuClickProps extends Coordinates {
  newValue: number | null
}

interface SudokuCellProps extends Coordinates {
  onMenuClick?: (props: SudokuCellOnMenuClickProps) => void
  cellValue: CellValue
}

const SudokuCell = ({ onMenuClick, cellValue, row, col }: SudokuCellProps) => {
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null)
  const handleMenuClick = (newValue: number | null) => {
    onMenuClick?.({ newValue, row, col })
    setAnchorEl(null)
  }
  return (
    <>
      <SquareWrapper>
        <button
          className={classNames('h-full', 'w-full', 'md:text-lg', 'lg:text-xl', {
            [styles.notInput]: !cellValue?.isInput,
          })}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          {cellValue?.value}
        </button>
      </SquareWrapper>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <SudokuMenu onMenuClick={handleMenuClick} />
      </Popover>
    </>
  )
}

export default SudokuCell
