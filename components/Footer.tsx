import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import { SOCIAL_ICON_KINDS } from 'types/constants'

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col items-center mt-16">
        <div className="flex mb-3 space-x-4">
          {SOCIAL_ICON_KINDS.map((kind) => {
            const href = siteMetadata[kind]
            return href ? <SocialIcon key={kind} kind={kind} href={href} size={6} /> : null
          })}
        </div>
        <div className="flex mb-2 space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.name}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link href="https://github.com/timlrx/tailwind-nextjs-starter-blog">
            Tailwind Nextjs Theme
          </Link>
        </div>
      </div>
    </footer>
  )
}
