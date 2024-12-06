import prisma from '@/lib/prisma'
import { post } from '@farcaster/auth-client'
import { Site } from '@penxio/types'
import { PostType } from '@prisma/client'
import { gql, request } from 'graphql-request'
import ky from 'ky'
import { unstable_cache } from 'next/cache'
import {
  editorDefaultValue,
  isProd,
  PostStatus,
  RESPACE_BASE_URI,
  ROOT_DOMAIN,
  SUBGRAPH_URL,
} from './constants'
import { SpaceType } from './types'
import { getUrl } from './utils'

const REVALIDATE_TIME = process.env.REVALIDATE_TIME
  ? Number(process.env.REVALIDATE_TIME)
  : 3600

export async function getSite(params: any) {
  let domain = decodeURIComponent(params.domain)

  const isSubdomain = domain.endsWith(`.${ROOT_DOMAIN}`)

  if (isSubdomain) {
    domain = domain.replace(`.${ROOT_DOMAIN}`, '')
  }

  return await unstable_cache(
    async () => {
      const { siteId } = await prisma.domain.findUniqueOrThrow({
        where: { domain: domain, isSubdomain },
        select: { siteId: true, isSubdomain: true },
      })

      const site = await prisma.site.findUniqueOrThrow({
        where: { id: siteId },
        include: { user: true },
      })

      function getAbout() {
        if (!site?.about) return editorDefaultValue
        try {
          return JSON.parse(site.about)
        } catch (error) {
          return editorDefaultValue
        }
      }

      return {
        ...site,
        // spaceId: site.spaceId || process.env.NEXT_PUBLIC_SPACE_ID,
        spaceId: process.env.NEXT_PUBLIC_SPACE_ID || site.spaceId,
        logo: getUrl(site.logo || ''),
        image: getUrl(site.image || ''),
        about: getAbout(),
      } as any as Site
    },
    [`site-${domain}`],
    {
      // revalidate: isProd ? 3600 * 24 : 10,
      revalidate: REVALIDATE_TIME,
      tags: [`site-${domain}`],
    },
  )()
}

export async function getPosts(siteId: string) {
  const posts = await unstable_cache(
    async () => {
      let posts = await findManyPosts(siteId)
      if (!posts.length) {
        const { userId } = await prisma.site.findUniqueOrThrow({
          where: { id: siteId },
          select: { userId: true },
        })

        const post = await prisma.post.findUnique({
          where: { id: process.env.WELCOME_POST_ID },
        })

        if (post) {
          await prisma.post.create({
            data: {
              userId,
              siteId,
              type: PostType.ARTICLE,
              title: post.title,
              content: post.content,
              postStatus: PostStatus.PUBLISHED,
            },
          })

          posts = await findManyPosts(siteId)
        }
      }

      return posts.map((post) => ({
        ...post,
        image: getUrl(post.image || ''),
      }))
    },
    [`${siteId}-posts`],
    {
      revalidate: isProd ? REVALIDATE_TIME : 10,
      tags: [`${siteId}-posts`],
    },
  )()

  return posts
}

export async function getPost(slug: string) {
  return await unstable_cache(
    async () => {
      const post = await prisma.post.findFirst({
        where: { slug },
      })

      if (!post) return null

      return {
        ...post,
        image: getUrl(post.image || ''),
      }
    },
    [`post-${slug}`],
    {
      revalidate: REVALIDATE_TIME,
      tags: [`posts-${slug}`],
    },
  )()
}

export async function getTags() {
  return await unstable_cache(
    async () => {
      return prisma.tag.findMany()
    },
    [`tags`],
    {
      revalidate: REVALIDATE_TIME,
      tags: [`tags`],
    },
  )()
}

export async function getTagWithPost(name: string) {
  return await unstable_cache(
    async () => {
      return prisma.tag.findFirst({
        include: { postTags: { include: { post: true } } },
        where: { name },
      })
    },
    [`tags-${name}`],
    {
      revalidate: REVALIDATE_TIME,
      tags: [`tags-${name}`],
    },
  )()
}

// export async function getTagPosts() {
//   return await unstable_cache(
//     async () => {
//       return prisma.tag.findMany()
//     },
//     [`tags-posts`],
//     {
//       revalidate: 3600,
//       tags: [`tags-post`],
//     },
//   )()
// }

export async function getSpace(spaceId: string) {
  return await unstable_cache(
    async () => {
      const response = await ky
        .get(RESPACE_BASE_URI + `/api/get-space?address=${spaceId}`)
        .json<SpaceType>()

      return response
    },
    [`space-${spaceId}`],
    {
      // revalidate: isProd ? 3600 : 10,
      revalidate: 60,
      tags: [`space-${spaceId}`],
    },
  )()
}

const spaceIdsQuery = gql`
  {
    spaces(first: 1000) {
      id
    }
  }
`

export async function getSpaceIds() {
  return await unstable_cache(
    async () => {
      try {
        const { spaces = [] } = await request<{ spaces: SpaceType[] }>({
          url: SUBGRAPH_URL,
          document: spaceIdsQuery,
        })
        return spaces
      } catch (error) {
        return []
      }
    },
    ['space-ids'],
    {
      revalidate: 60 * 60 * 24 * 365,
      tags: ['space-ids'],
    },
  )()
}

function findManyPosts(siteId: string) {
  return prisma.post.findMany({
    include: {
      postTags: { include: { tag: true } },
      user: {
        select: {
          accounts: {
            select: {
              providerAccountId: true,
              providerType: true,
            },
          },
          email: true,
          name: true,
          image: true,
        },
      },
    },
    where: {
      siteId,
      postStatus: PostStatus.PUBLISHED,
    },
    orderBy: [{ publishedAt: 'desc' }],
  })
}
