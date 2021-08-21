// Copyright (C) 2021 Marcus Xu
//
// This file is part of blog.
//
// blog is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// blog is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with blog.  If not, see <http://www.gnu.org/licenses/>.

import { AuthorFrontMatter } from './AuthorFrontMatter'

type Analytics =
  | {
      provider: 'plausible'
      plausibleDataDomain: string // e.g. tailwind-nextjs-starter-blog.vercel.app
    }
  | {
      provider: 'simpleAnalytics'
    }
  | {
      provider: 'googleAnalytics'
      googleAnalyticsId: string // e.g. UA-000000-2 or G-XXXXXXX
    }

export interface GiscusConfig {
  // Visit the link below, and follow the steps in the string section
  // https://giscus.app/
  repo: string // process.env.NEXT_PUBLIC_GISCUS_REPO
  repositoryId: string // process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID
  category: string // process.env.NEXT_PUBLIC_GISCUS_CATEGORY
  categoryId: string // process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID
  mapping: string // supported options: pathname, url, title
  reactions: string // Emoji reactions: 1 = enable / 0 = disable
  // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
  metadata: string
  // theme example: light, dark, dark_dimmed, dark_high_contrast
  // transparent_dark, preferred_color_scheme, custom
  theme: string
  // theme when dark mode
  darkTheme: string
  // If the theme option above is set to 'custom`
  // please provide a link below to your custom theme css file.
  // example: https://giscus.app/themes/custom_example.css
  themeURL: string
}

export interface UtterancesConfig {
  // Visit the link below, and follow the steps in the string section
  // https://utteranc.es/
  repo: string // process.env.NEXT_PUBLIC_UTTERANCES_REPO
  issueTerm: string // supported options: pathname, url, title
  label: string // label (optional): Comment 💬
  // theme example: github-light, github-dark, preferred-color-scheme
  // github-dark-orange, icy-dark, dark-blue, photon-dark, boxy-light
  theme: string
  // theme when dark mode
  darkTheme: string
}

export interface DisqusConfig {
  // https://help.disqus.com/en/articles/1717111-what-s-a-shortname
  shortname: string // process.env.NEXT_PUBLIC_DISQUS_SHORTNAME
}

// Select a provider and use the environment variables associated to it
// https://vercel.com/docs/environment-variables
type Comment =
  | {
      provider: 'giscus'
      giscusConfig: GiscusConfig
    }
  | {
      provider: 'utterances'
      utterancesConfig: UtterancesConfig
    }
  | {
      provider: 'disqus'
      disqusConfig: DisqusConfig
    }

export type SiteMetadata = AuthorFrontMatter &
  Partial<{
    analytics: Analytics
    comment: Comment
    description: string
    headerTitle: string
    language: string
    locale: string
    siteLogo: string
    siteRepo: string
    siteUrl: string
    socialBanner: string
    title: string
  }>
