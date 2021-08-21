import Script from 'next/script'

const PlausibleScript = ({ plausibleDataDomain }) => (
  <>
    <Script
      strategy="lazyOnload"
      data-domain={plausibleDataDomain}
      src="https://plausible.io/js/plausible.js"
    />
    <Script strategy="lazyOnload">
      {`
              window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }
          `}
    </Script>
  </>
)

export default PlausibleScript

// https://plausible.io/docs/custom-event-goals
export const logEvent = (eventName, ...rest) => {
  return window.plausible?.(eventName, ...rest)
}
