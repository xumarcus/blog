import Script from 'next/script'

interface Props {
  googleAnalyticsId: string
}

const GAScript = ({ googleAnalyticsId }: Props) => (
  <>
    <Script
      strategy="lazyOnload"
      src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
    />

    <Script strategy="lazyOnload">
      {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}', {
              page_path: window.location.pathname,
            });
        `}
    </Script>
  </>
)

export default GAScript

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logEvent = (action: any, category: any, label: any, value: any) => {
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
