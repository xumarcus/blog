import { MDXLayoutRenderer } from '@/components/MDXComponents'
import siteMetadata from '@/data/siteMetadata'
import { getAuthorFrontMatterBySlug } from '@/lib/mdx'
import { GetStaticProps, InferGetStaticPropsType } from 'next'

export const getStaticProps: GetStaticProps<{
  mdxSource: string
}> = async () => {
  const { mdxSource } = await getAuthorFrontMatterBySlug('default')
  return { props: { mdxSource } }
}

export default function About({ mdxSource }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <MDXLayoutRenderer layout="AuthorLayout" mdxSource={mdxSource} frontMatter={siteMetadata} />
  )
}
