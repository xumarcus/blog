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

/**
 * Here we need to augment module to add breakpoints
 * For values see node_modules/tailwindcss/stubs/defaultConfig.stub.js
 */

type TailwindColorName =
  | 'rose'
  | 'pink'
  | 'fuchsia'
  | 'purple'
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'lightBlue'
  | 'sky'
  | 'cyan'
  | 'teal'
  | 'emerald'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'red'
  | 'warmGray'
  | 'trueGray'
  | 'gray'
  | 'coolGray'
  | 'blueGray'

import { TailwindColorGroup } from 'tailwindcss/tailwind-config'
type TailwindColors = {
  [color in TailwindColorName]: TailwindColorGroup
} & {
  black: string
  white: string
}
const colors: TailwindColors = require('tailwindcss/colors')

import { Breakpoints, ThemeOptions } from '@mui/material/styles'
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false
    '2xl': true
  }
}

const breakpoints: Partial<
  {
    unit: string
    step: number
  } & Breakpoints
> = {
  keys: ['sm', 'md', 'lg', 'xl', '2xl'],
  values: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
}

export const themeOptionsLight: ThemeOptions = {
  breakpoints,
  palette: {
    mode: 'light',
    primary: colors.trueGray,
    error: colors.red,
    info: colors.blue,
  },
  typography: (palette) => ({
    fontFamily: '"Inter", sans-serif',
    allVariants: {
      color: palette.primary.dark,
    },
  }),
}

export const themeOptionsDark: ThemeOptions = {
  breakpoints,
  palette: {
    mode: 'dark',
    primary: colors.trueGray,
    error: colors.red,
    info: colors.blue,
  },
  typography: (palette) => ({
    fontFamily: '"Inter", sans-serif',
    allVariants: {
      color: palette.primary.light,
    },
  }),
}
