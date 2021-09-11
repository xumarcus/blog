import Script from 'next/script'

interface Props {
  plausibleDataDomain: string
}

const PlausibleScript = ({ plausibleDataDomain }: Props) => (
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logEvent = (eventName: any, ...rest: any[]) => {
  return window.plausible?.(eventName, ...rest)
}
