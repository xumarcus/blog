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

import React, { PropsWithChildren, useRef, useState } from 'react'
import useResizeObserver from '@react-hook/resize-observer'

/**
 * `cellConstructor` should have `w-full h-full` tailwind classes
 */
const SquareWrapper = ({
  className,
  children,
}: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
  const [height, setHeight] = useState(0)
  const ref = useRef(null)
  useResizeObserver(ref, ({ contentRect }) => {
    const { left, right } = contentRect
    setHeight(left + right)
  })
  return (
    <div className={className} ref={ref} style={{ height }}>
      {children}
    </div>
  )
}

export default SquareWrapper
