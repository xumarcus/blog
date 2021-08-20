import { SocialIconKind } from './constants'

export interface AuthorFrontMatter extends Partial<Record<SocialIconKind, string>> {
  avatar: string
  company: string
  layout?: string
  name: string
  occupation: string
}
