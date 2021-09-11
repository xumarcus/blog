// @ts-nocheck
import React, { useState } from 'react'
import { PostFrontMatter } from 'types/PostFrontMatter'
import { DisqusConfig } from 'types/SiteMetadata'

interface Props {
  disqusConfig: DisqusConfig
  frontMatter: PostFrontMatter
}

const Disqus = ({ disqusConfig, frontMatter }: Props) => {
  const [enableLoadComments, setEnabledLoadComments] = useState(true)

  const COMMENTS_ID = 'disqus_thread'

  function LoadComments() {
    setEnabledLoadComments(false)

    globalThis.disqus_config = function () {
      this.page.url = window.location.href
      this.page.identifier = frontMatter.slug
    }
    if (globalThis.DISQUS) {
      globalThis.DISQUS.reset({ reload: true })
    } else {
      const script = document.createElement('script')
      script.src = `https://${disqusConfig.shortname}.disqus.com/embed.js`
      script.async = true
      script.setAttribute('data-timestamp', String(new Date().getTime()))
      script.setAttribute('crossorigin', 'anonymous')
      document.body.appendChild(script)
    }
  }

  return (
    <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300">
      {enableLoadComments && <button onClick={LoadComments}>Load Comments</button>}
      <div className="disqus-frame" id={COMMENTS_ID} />
    </div>
  )
}

export default Disqus
