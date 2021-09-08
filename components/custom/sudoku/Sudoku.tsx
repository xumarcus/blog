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
import CellGrid from '../CellGrid'

const Sudoku = () => (
  <CellGrid
    rowCount={9}
    colCount={9}
    cellConstructor={() => {
      return <button className="h-full w-full">1</button>
    }}
  />
)

export default Sudoku
