import { NavLink, NavLinkLocation, NavLinkType } from '../theme.types'

export const isServer = typeof window === 'undefined'
export const isBrowser = typeof window !== 'undefined'
export const isProd = process.env.NODE_ENV === 'production'
export const isNavigator = typeof navigator !== 'undefined'

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN!

export const GOOGLE_CLIENT_ID =
  '864679274232-niev1df1dak216q5natclfvg5fhtp7fg.apps.googleusercontent.com'

export const PROJECT_ID =
  process.env.NEXT_PUBLIC_PROJECT_ID || '3d31c4aa12acd88d0b8cad38b0a5686a'

export const GOOGLE_DRIVE_FOLDER_PREFIX = `penx-`
export const GOOGLE_DRIVE_FOLDER = 'penx'

export const SECONDS_PER_MONTH = BigInt(24 * 60 * 60 * 30) // 30 days
export const SECONDS_PER_DAY = BigInt(24 * 60 * 60) // 1 days

export const SITE_MODE = 'SITE_MODE'

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum SubscriptionType {
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export enum TradeSource {
  MEMBER = 'MEMBER',
  SPONSOR = 'SPONSOR',
  HOLDER = 'HOLDER',
}

export const SELECTED_SPACE = 'SELECTED_SPACE'

export enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
  CONTRIBUTED = 'CONTRIBUTED',
}

export enum WorkerEvents {
  START_POLLING,

  START_PULL,
  PULL_SUCCEEDED,
  PULL_FAILED,
}

export const TODO_DATABASE_NAME = '__TODO__'

export const FILE_DATABASE_NAME = '__FILE__'

export const PROJECT_DATABASE_NAME = '__PENX_PROJECT__'
export const FRIEND_DATABASE_NAME = '__PENX_FRIEND__'

export enum EditorMode {
  OUTLINER = 'OUTLINER',
  BLOCK = 'BLOCK',
}

export const WORKBENCH_NAV_HEIGHT = 54

export const DATABASE_TOOLBAR_HEIGHT = 42

export const SIDEBAR_WIDTH = 240

export const editorDefaultValue = [
  {
    type: 'p',
    children: [{ text: '' }],
  },
]

export enum CliLoginStatus {
  CANCELED = 'CANCELED',
  CONFIRMED = 'CONFIRMED',
  INIT = 'INIT',
}

export const placeholderBlurhash =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg=='

export const defaultNavLinks: NavLink[] = [
  {
    title: 'Home',
    pathname: '/',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: true,
  },
  {
    title: 'Posts',
    pathname: '/posts',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: true,
  },
  {
    title: 'Projects',
    pathname: '/projects',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: true,
  },
  {
    title: 'Tags',
    pathname: '/tags',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: true,
  },
  {
    title: 'Friends',
    pathname: '/friends',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: true,
  },
  {
    title: 'Guestbook',
    pathname: '/guestbook',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: true,
  },
  {
    title: 'AMA',
    pathname: '/ama',
    type: NavLinkType.BUILTIN,
    location: NavLinkLocation.HEADER,
    visible: true,
  },
  {
    title: 'About',
    pathname: '/about',
    location: NavLinkLocation.HEADER,
    type: NavLinkType.BUILTIN,
    visible: true,
  },
]

export const STRIPE_PRO_MONTHLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID!
export const STRIPE_PRO_YEARLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID!
export const STRIPE_TEAM_MONTHLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID
export const STRIPE_TEAM_YEARLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID

export const STRIPE_BELIEVER_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_BELIEVER_PRICE_ID

export const FREE_PLAN_POST_LIMIT = Number(
  process.env.FREE_PLAN_POST_LIMIT || 10,
)

export const FREE_PLAN_PAGE_LIMIT = Number(
  process.env.FREE_PLAN_PAGE_LIMIT || 5,
)

export const PRO_PLAN_COLLABORATOR_LIMIT = Number(
  process.env.PRO_PLAN_COLLABORATOR_LIMIT || 3,
)

export const TEAM_PLAN_COLLABORATOR_LIMIT = Number(
  process.env.TEAM_PLAN_COLLABORATOR_LIMIT || 6,
)

export const BUILTIN_PAGE_SLUGS = [
  'about',
  'projects',
  'friends',
  'guestbook',
  'ama',
]

export const LATEST_POSTS_LIMIT = 2
export const HOME_PROJECT_LIMIT = 4
