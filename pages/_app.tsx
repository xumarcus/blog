import '@/css/tailwind.css'

import { ThemeProvider as CSSThemeProvider } from 'next-themes'
import { themeOptionsLight, themeOptionsDark, useCurrentTheme } from '@/lib/utils/muiTheme'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/LayoutWrapper'
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'

const Inner = ({ Component, pageProps }: AppProps) => {
  const [mounted, setMounted] = useState(false)
  const currentTheme = useCurrentTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  // Creates new theme per switch to force re-render
  const themeOptions = currentTheme === 'dark' ? themeOptionsDark : themeOptionsLight

  return mounted ? (
    <MUIThemeProvider theme={createTheme(themeOptions)}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Analytics />
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </MUIThemeProvider>
  ) : null
}

export default function App(props: AppProps) {
  return (
    <CSSThemeProvider attribute="class">
      <Inner {...props} />
    </CSSThemeProvider>
  )
}
