import siteMetadata from '@/data/siteMetadata'
import dynamic from 'next/dynamic'
import { PostFrontMatter } from 'types/PostFrontMatter'

interface Props {
  frontMatter: PostFrontMatter
}

const UtterancesComponent = dynamic(
  () => {
    return import('@/components/comments/Utterances')
  },
  { ssr: false }
)
const GiscusComponent = dynamic(
  () => {
    return import('@/components/comments/Giscus')
  },
  { ssr: false }
)
const DisqusComponent = dynamic(
  () => {
    return import('@/components/comments/Disqus')
  },
  { ssr: false }
)

const Comments = ({ frontMatter }: Props) => {
  const getTerm = (key: string): string => {
    switch (key) {
      case 'pathname':
        return frontMatter.slug
      case 'url':
        return window.location.href
      case 'title':
        return frontMatter.title
    }
  }
  switch (siteMetadata.comment?.provider) {
    case 'giscus':
      return <GiscusComponent mapping={getTerm(siteMetadata.comment.giscusConfig.mapping)} />
    case 'utterances':
      return (
        <UtterancesComponent issueTerm={getTerm(siteMetadata.comment.utterancesConfig.issueTerm)} />
      )
    case 'disqus':
      return <DisqusComponent frontMatter={frontMatter} />
    default:
      return null
  }
}

export default Comments
