import Script from 'next/script'

import siteMetadata from '@/data/siteMetadata'

const PlausibleScript = () =>
  'plausibleDataDomain' in siteMetadata.analytics ? (
    <>
      <Script
        strategy="lazyOnload"
        data-domain={siteMetadata.analytics.plausibleDataDomain}
        src="https://plausible.io/js/plausible.js"
      />
      <Script strategy="lazyOnload">
        {`
              window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }
          `}
      </Script>
    </>
  ) : null

export default PlausibleScript

// https://plausible.io/docs/custom-event-goals
export const logEvent = (eventName, ...rest) => {
  return window.plausible?.(eventName, ...rest)
}
