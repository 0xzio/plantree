import { Page } from '@prisma/client'
import { produce } from 'immer'
import Redis from 'ioredis'
import { redisKeys } from './redisKeys'
import { MySite, PostById, SitePost } from './types'

const redis = new Redis(process.env.REDIS_URL!)

export const cacheHelper = {
  async getCachedMySites(userId: string): Promise<MySite[] | undefined> {
    const key = redisKeys.mySites(userId)
    try {
      const str = await redis.get(key)
      if (str) {
        const sites = JSON.parse(str)
        if (Array.isArray(sites)) {
          const mySites = sites as MySite[]
          return produce(mySites, (draft) => {
            for (const site of draft) {
              site.createdAt = new Date(site.createdAt)
              site.updatedAt = new Date(site.updatedAt)
            }
          })
        }
      }
    } catch (error) {}
  },

  async updateCachedMySites(userId: string, sites: MySite[] | null) {
    const key = redisKeys.mySites(userId)
    if (!sites) {
      redis.del(key)
    } else {
      redis.set(key, JSON.stringify(sites), 'EX', 60 * 60 * 24)
    }
  },

  async getCachedSitePosts(siteId: string): Promise<SitePost[] | undefined> {
    const key = redisKeys.sitePosts(siteId)
    try {
      const str = await redis.get(key)
      if (str) {
        const posts = JSON.parse(str)
        if (Array.isArray(posts)) {
          const sitePosts = posts as SitePost[]
          return produce(sitePosts, (draft) => {
            for (const post of draft) {
              post.createdAt = new Date(post.createdAt)
              post.updatedAt = new Date(post.updatedAt)
              if (post.publishedAt) {
                post.publishedAt = new Date(post.publishedAt)
              }
            }
          })
        }
      }
    } catch (error) {}
  },

  async updateCachedSitePosts(siteId: string, posts: SitePost[] | null) {
    const key = redisKeys.sitePosts(siteId)
    if (!posts) {
      redis.del(key)
    } else {
      redis.set(key, JSON.stringify(posts), 'EX', 60 * 60 * 24)
    }
  },

  async getCachedSitePages(siteId: string): Promise<Page[] | undefined> {
    const key = redisKeys.sitePages(siteId)
    try {
      const str = await redis.get(key)
      if (str) {
        const pages = JSON.parse(str)
        if (Array.isArray(pages)) {
          const sitePosts = pages as Page[]
          return produce(sitePosts, (draft) => {
            for (const page of draft) {
              page.createdAt = new Date(page.createdAt)
              page.updatedAt = new Date(page.updatedAt)
            }
          })
        }
      }
    } catch (error) {}
  },

  async updateCachedSitePages(siteId: string, pages: Page[] | null) {
    const key = redisKeys.sitePosts(siteId)
    if (!pages) {
      redis.del(key)
    } else {
      redis.set(key, JSON.stringify(pages), 'EX', 60 * 60 * 24)
    }
  },

  async getCachedPost(postId: string): Promise<PostById | undefined> {
    const key = redisKeys.post(postId)
    try {
      const str = await redis.get(key)
      if (str) {
        const post = JSON.parse(str)
        const postById = post as PostById
        return produce(postById, (draft) => {
          draft.createdAt = new Date(draft.createdAt)
          draft.updatedAt = new Date(draft.updatedAt)
        })
      }
    } catch (error) {}
  },

  async updateCachedPost(postId: string, post: PostById | null) {
    const key = redisKeys.post(postId)
    if (!post) {
      redis.del(key)
    } else {
      redis.set(key, JSON.stringify(post), 'EX', 60 * 60 * 24)
    }
  },
}
