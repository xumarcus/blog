import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import { GiscusConfig } from 'types/SiteMetadata'

interface Props {
  giscusConfig: GiscusConfig
  mapping: string
}

const Giscus = ({ giscusConfig, mapping }: Props) => {
  const [enableLoadComments, setEnabledLoadComments] = useState(true)
  const { theme, resolvedTheme } = useTheme()

  const COMMENTS_ID = 'comments-container'

  function LoadComments() {
    setEnabledLoadComments(false)
    const script = document.createElement('script')
    const commentsTheme =
      giscusConfig.themeURL === ''
        ? theme === 'dark' || resolvedTheme === 'dark'
          ? giscusConfig.darkTheme
          : giscusConfig.theme
        : giscusConfig.themeURL
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', giscusConfig.repo)
    script.setAttribute('data-repo-id', giscusConfig.repositoryId)
    script.setAttribute('data-category', giscusConfig.category)
    script.setAttribute('data-category-id', giscusConfig.categoryId)
    script.setAttribute('data-mapping', mapping)
    script.setAttribute('data-reactions-enabled', giscusConfig.reactions)
    script.setAttribute('data-emit-metadata', giscusConfig.metadata)
    script.setAttribute('data-theme', commentsTheme)
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true
    const comments = document.getElementById(COMMENTS_ID)
    if (comments) comments.appendChild(script)

    return () => {
      const comments = document.getElementById(COMMENTS_ID)
      if (comments) comments.innerHTML = ''
    }
  }

  return (
    <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300">
      {enableLoadComments && <button onClick={LoadComments}>Load Comments</button>}
      <div className="giscus" id={COMMENTS_ID} />
    </div>
  )
}

export default Giscus
