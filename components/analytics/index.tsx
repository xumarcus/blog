/* eslint-disable @typescript-eslint/no-explicit-any */
import GA from './GoogleAnalytics'
import Plausible from './Plausible'
import SimpleAnalytics from './SimpleAnalytics'
import siteMetadata from '@/data/siteMetadata'

declare global {
  interface Window {
    gtag?: (..._args: any[]) => void
    plausible?: (..._args: any[]) => void
    sa_event?: (..._args: any[]) => void
  }
}

const Analytics = () => {
  if (process.env.NODE_ENV !== 'production') {
    return null
  }
  switch (siteMetadata.analytics?.provider) {
    case 'googleAnalytics':
      return <GA googleAnalyticsId={siteMetadata.analytics.googleAnalyticsId} />
    case 'plausible':
      return <Plausible plausibleDataDomain={siteMetadata.analytics.plausibleDataDomain} />
    case 'simpleAnalytics':
      return <SimpleAnalytics />
    default:
      return null
  }
}

export default Analytics
