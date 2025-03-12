import { JSX, PropsWithChildren } from 'react'
import { Author, Tier } from '@prisma/client'

enum AuthType {
  GOOGLE = 'GOOGLE',
  REOWN = 'REOWN',
  PRIVY = 'PRIVY',
}

export enum PostType {
  ARTICLE = 'ARTICLE',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  NFT = 'NFT',
  FIGMA = 'FIGMA',
  NOTE = 'NOTE',
}

export enum GateType {
  FREE = 'FREE',
  PAID = 'PAID',
}

export enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

export interface Socials {
  farcaster: string
  x: string
  mastodon: string
  github: string
  facebook: string
  youtube: string
  linkedin: string
  threads: string
  instagram: string
  medium: string
  [key: string]: string
}
export interface Analytics {
  gaMeasurementId: string
  umamiHost: string
  umamiWebsiteId: string
}

export enum NavLinkType {
  PAGE = 'PAGE',
  BUILTIN = 'BUILTIN',
  TAG = 'TAG',
  CUSTOM = 'CUSTOM',
}

export enum NavLinkLocation {
  HEADER = 'HEADER',
  FOOTER = 'FOOTER',
}

export type NavLink = {
  title: string
  pathname: string
  type: NavLinkType
  location: NavLinkLocation
  visible: boolean
}

export type Project = {
  name: string
  introduction: string
  avatar: string
  url: string
  icon: string
  cover: string
  [key: string]: string
}

export type Friend = {
  name: string
  introduction: string
  avatar: string
  url: string
  [key: string]: string
}

export type Site = {
  id: string
  name: string
  description: string
  about: any
  logo: string | null
  spaceId: string | null
  font: string
  image: string | null
  privyAppId: string
  privyAppSecret: string
  authType: AuthType
  authConfig?: {
    [key: string]: string
  }
  socials: Socials
  analytics: Analytics
  catalogue: any
  config: {
    seo?: {
      title?: string
      description?: string
    }
    locales: string[]
    appearance: AppearanceConfig
    features: Record<string, any>
  }
  themeName: string
  themeConfig: Record<string, any>
  theme: {
    common: {
      postListStyle: any
    }
    home: {
      showAbout: boolean
      showLatestPosts: boolean
      showProjects: boolean
      showFeatured: boolean
      showTags: boolean
    }
  }
  navLinks: NavLink[]
  subdomain: string | null
  customDomain: string | null
  memberCount: number
  postCount: number
  message404: string | null
  seoTitle: string
  seoDescription: string
  tiers: Tier[]
  createdAt: Date
  updatedAt: Date
}

export type Post = {
  id: string
  title: string
  description: string
  content: any
  slug: string
  cid: string
  nodeId: string
  creationId: number
  type: PostType
  gateType: GateType
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  status: PostStatus
  featured: boolean
  collectible: boolean
  isPopular: boolean
  image: string | null
  commentCount: number
  publishedAt: Date
  archivedAt: Date
  createdAt: Date
  updatedAt: Date
  userId: string
  postTags: PostTag[]
  authors: Array<
    Author & {
      user: User
    }
  >
  user: User
}

export type User = {
  id: string
  name: string
  displayName: string
  ensName: string
  email: string
  image: string | null
  cover: string
  bio: string
  about: string
  accounts: Array<{
    id: string
    providerType: string
    providerAccountId: string
    providerInfo: any
    refreshToken: string
    accessToken: string
  }>
}

export type PostTag = {
  id: string
  tagId: string
  tag: Tag
}

export type Tag = {
  id: string
  name: string
  color: string
  postCount: string
}

export interface HomeLayoutProps {
  path: string
}

interface PostLayoutProps {}

interface HomeProps {
  posts: Post[]
}

interface AboutProps {}

interface PostProps {
  isGated: boolean
  post: Post
}

export type Theme = {
  HomeLayout?: ({ children }: PropsWithChildren<HomeLayoutProps>) => JSX.Element
  PostLayout?: ({ children }: PropsWithChildren<PostLayoutProps>) => JSX.Element
  Home?: ({ posts }: HomeProps) => JSX.Element
  Post?: ({ post, isGated }: PostProps) => JSX.Element
  About?: ({}: AboutProps) => JSX.Element
}

export interface AppearanceConfig {
  color: string
  baseFont: string
  locale: string
}

export enum PostListStyle {
  SIMPLE = 'SIMPLE',
  CARD = 'CARD',
}
