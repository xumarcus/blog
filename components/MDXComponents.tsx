import React, { useMemo } from 'react'
import { ComponentMap, getMDXComponent } from 'mdx-bundler/client'
import CustomLink from './Link'
import Image from './Image'
import Pre from './Pre'
import TOCInline from './TOCInline'
import SimpleLineChart from './custom/SimpleLineChart'
import Sudoku from './custom/Sudoku'

const Wrapper: React.FunctionComponent<{ layout: string }> = ({ layout, ...rest }) => {
  const Layout = require(`../layouts/${layout}`).default
  return <Layout {...rest} />
}

export const MDXComponents: ComponentMap = {
  // Builtins
  a: CustomLink,
  img: Image,
  pre: Pre,
  toc: TOCInline,
  wrapper: Wrapper,

  // Custom
  SimpleLineChart,
  Sudoku,

  // Library imports
}

interface Props {
  layout: string
  mdxSource: string
  [key: string]: unknown
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }: Props) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])

  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
