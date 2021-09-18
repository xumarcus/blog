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

type TailwindColors = {
  [color in TailwindColorName]: TailwindColorGroup
} & {
  black: string
  white: string
}
const colors: TailwindColors = require('tailwindcss/colors')

/*
const inverseColor = (color: TailwindColorGroup): TailwindColorGroup => ({
  50: colors.black,
  100: color[900],
  200: color[800],
  300: color[700],
  400: color[600],
  500: color[500],
  600: color[400],
  700: color[300],
  800: color[200],
  900: color[100],
})
*/

import { BreakpointOverrides, Breakpoints } from '@material-ui/core/styles/createBreakpoints'
declare module '@material-ui/core/styles/createBreakpoints' {
  interface BreakpointOverrides {
    xs: false
    '2xl': true
  }
}

import { ThemeOptions } from '@material-ui/core/styles/createTheme'
import { TailwindColorGroup } from 'tailwindcss/tailwind-config'
declare module '@material-ui/core/styles/createTheme' {
  interface Theme {
    appDrawer: {
      width: React.CSSProperties['width']
      breakpoint: BreakpointOverrides
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    appDrawer?: {
      width?: React.CSSProperties['width']
      breakpoint?: BreakpointOverrides
    }
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
    type: 'light',
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
    type: 'dark',
    primary: colors.trueGray,
    error: colors.red,
    info: colors.blue,
    background: {
      default: colors.trueGray[800],
      paper: colors.trueGray[800],
    },
  },
  typography: (palette) => ({
    fontFamily: '"Inter", sans-serif',
    allVariants: {
      color: palette.primary.light,
    },
  }),
}
