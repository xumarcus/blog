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

const isProduction = process.env.NODE_ENV === 'production'

const Analytics = () => {
  return (
    <>
      {isProduction &&
        siteMetadata.analytics &&
        'plausibleDataDomain' in siteMetadata.analytics && <Plausible />}
      {isProduction && siteMetadata.analytics && 'simpleAnalytics' in siteMetadata.analytics && (
        <SimpleAnalytics />
      )}
      {isProduction && siteMetadata.analytics && 'googleAnalyticsId' in siteMetadata.analytics && (
        <GA />
      )}
    </>
  )
}

export default Analytics
