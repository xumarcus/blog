import '@/css/tailwind.css'

import { ThemeProvider as CSSThemeProvider, useTheme } from 'next-themes'
import { themeOptionsLight, themeOptionsDark } from 'MUITheme'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/LayoutWrapper'
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material'

const Inner = ({ Component, pageProps }: AppProps) => {
  const { theme } = useTheme()

  // Creates new theme per switch to force re-render
  const themeOptions = theme === 'dark' ? themeOptionsDark : themeOptionsLight

  return (
    <MUIThemeProvider theme={createTheme(themeOptions)}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Analytics />
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </MUIThemeProvider>
  )
}

export default function App(props: AppProps) {
  return (
    <CSSThemeProvider attribute="class">
      <Inner {...props} />
    </CSSThemeProvider>
  )
}
