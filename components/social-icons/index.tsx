import { SocialIconKind } from 'types/constants'
import Email from './email.svg'
import Facebook from './facebook.svg'
import Github from './github.svg'
import Linkedin from './linkedin.svg'
import Telegram from './telegram.svg'
import Twitter from './twitter.svg'
import Youtube from './youtube.svg'

// Icons taken from: https://simpleicons.org/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: Record<SocialIconKind, any> = {
  email: Email,
  facebook: Facebook,
  github: Github,
  linkedin: Linkedin,
  telegram: Telegram,
  twitter: Twitter,
  youtube: Youtube,
}

interface Props {
  kind: SocialIconKind
  href: string
  size?: number
}

const SocialIcon = ({ kind, href, size = 8 }: Props) => {
  if (!href) return null

  const SocialSvg = components[kind]

  return (
    <a
      className="text-sm text-gray-500 transition hover:text-gray-600"
      target="_blank"
      rel="noopener noreferrer"
      href={kind === 'email' ? `mailto:${href}` : href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`fill-current text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 h-${size} w-${size}`}
      />
    </a>
  )
}

export default SocialIcon
