/**
 * scripts/generate-sitemap.js cannot read TS module siteMetadata.ts
 *
 * Have to keep this for compatibility
 */

const _siteMetadata = {
  avatar: '/static/images/avatar.png',
  company: 'National University of Singapore',
  description: 'A blog created with Next.js and Tailwind.css',
  email: 'xumarcus.sg+blog@gmail.com',
  github: 'https://github.com/xumarcus',
  headerTitle: 'TailwindBlog',
  language: 'en-us',
  linkedin: 'https://www.linkedin.com/in/xumarcus',
  locale: 'en-US',
  occupation: 'Student',
  name: 'Marcus Xu',
  siteLogo: '/static/images/logo.png',
  siteRepo: 'https://github.com/xumarcus/blog',
  siteUrl: 'https://blog-xumarcus.vercel.app/',
  socialBanner: '/static/images/twitter-card.png',
  telegram: 'https://t.me/deces0',
  title: 'Next.js Starter Blog',
}

module.exports = _siteMetadata
