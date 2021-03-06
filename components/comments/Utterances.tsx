import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import { UtterancesConfig } from 'types/SiteMetadata'

interface Props {
  utterancesConfig: UtterancesConfig
  issueTerm: string
}

const Utterances = ({ utterancesConfig, issueTerm }: Props) => {
  const [enableLoadComments, setEnabledLoadComments] = useState(true)
  const { theme, resolvedTheme } = useTheme()

  const COMMENTS_ID = 'comments-container'

  function LoadComments() {
    setEnabledLoadComments(false)
    const script = document.createElement('script')
    const commentsTheme =
      theme === 'dark' || resolvedTheme === 'dark'
        ? utterancesConfig.darkTheme
        : utterancesConfig.theme
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', utterancesConfig.repo)
    script.setAttribute('issue-term', issueTerm)
    script.setAttribute('label', utterancesConfig.label)
    script.setAttribute('theme', commentsTheme)
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true
    const comments = document.getElementById(COMMENTS_ID)
    if (comments) comments.appendChild(script)

    return () => {
      const comments = document.getElementById(COMMENTS_ID)
      if (comments) comments.innerHTML = ''
    }
  }

  // Added `relative` to fix a weird bug with `utterances-frame` position
  return (
    <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300">
      {enableLoadComments && <button onClick={LoadComments}>Load Comments</button>}
      <div className="relative utterances-frame" id={COMMENTS_ID} />
    </div>
  )
}

export default Utterances
