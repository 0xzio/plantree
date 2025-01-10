import { IPFS_ADD_URL, PostStatus } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { getUrl } from '@/lib/utils'
import { GateType, PostType, Prisma } from '@prisma/client'
import { revalidatePath, revalidateTag } from 'next/cache'
import { Node as SlateNode } from 'slate'
import { z } from 'zod'
import { syncPostToHub } from '../lib/syncPostToHub'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const postRouter = router({
  listSitePosts: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { siteId } = input
      let posts = await findSitePosts(siteId)

      return posts.map((post) => ({
        ...post,
        image: getUrl(post.image || ''),
      }))
    }),

  publishedPosts: publicProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { siteId } = input
      let posts = await publishedSitePosts(siteId)

      return posts.map((post) => ({
        ...post,
        image: getUrl(post.image || ''),
      }))
    }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const post = await prisma.post.findUniqueOrThrow({
      include: {
        postTags: { include: { tag: true } },
      },
      where: { id: input },
    })

    // syncToGoogleDrive(ctx.token.uid, post as any)
    // console.log('post-------xxxxxxxxxx:', post?.postTags)
    return post
  }),

  bySlug: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const post = await prisma.post.findUnique({
      where: { slug: input },
    })
    return post
  }),

  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        type: z.nativeEnum(PostType),
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.post.create({
        data: {
          userId: ctx.token.uid,
          ...input,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, content, ...data } = input

      const post = await prisma.post.update({
        where: { id },
        data: {
          ...data,
          content: content || '',
        },
      })

      return post
    }),

  updateCover: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, image } = input
      const post = await prisma.post.update({
        where: { id },
        data: { image },
      })

      return post
    }),

  publish: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        postId: z.string().optional(),
        pageId: z.string().optional(),
        creationId: z.number().optional(),
        type: z.nativeEnum(PostType),
        gateType: z.nativeEnum(GateType),
        collectible: z.boolean(),
        image: z.string().optional(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      const { pageId, gateType, collectible, creationId } = input

      let post = await prisma.post.findFirst({
        where: { OR: [{ pageId }, { id: input.postId }] },
      })

      function getPostInfo() {
        if (input.postId) {
          return { title: post?.title, content: input.content }
        }

        const [title, ...nodes] = JSON.parse(input.content)

        return {
          title: SlateNode.string(title),
          content: JSON.stringify(nodes),
        }
      }
      const info = getPostInfo()

      if (!post) {
        post = await prisma.post.create({
          data: {
            siteId: input.siteId,
            userId,
            slug: input.pageId,
            title: info.title,
            type: input.type,
            pageId: input.pageId,
            postStatus: PostStatus.PUBLISHED,
            image: input.image,
            gateType: input.gateType,
            collectible: input.collectible,
            content: info.content,
          },
        })
      } else {
        post = await prisma.post.update({
          where: { id: post.id },
          data: {
            title: info.title,
            type: input.type,
            image: input.image,
            postStatus: PostStatus.PUBLISHED,
            gateType: input.gateType,
            collectible: input.collectible,
            content: info.content,
          },
        })
      }

      const newPost = await prisma.post.findUnique({
        include: {
          postTags: { include: { tag: true } },
          comments: true,
        },
        where: { id: post.id },
      })

      const [res] = await Promise.all([
        fetch(IPFS_ADD_URL, {
          method: 'POST',
          body: JSON.stringify({
            ...newPost,
            postStatus: PostStatus.PUBLISHED,
            collectible,
            creationId,
          }),
          headers: { 'Content-Type': 'application/json' },
        }).then((d) => d.json()),
        syncPostToHub(newPost as any),
      ])

      await prisma.post.update({
        where: { id: post.id },
        data: {
          postStatus: PostStatus.PUBLISHED,
          collectible,
          creationId,
          cid: res.cid,
          publishedAt: new Date(),
          gateType,
        },
      })

      revalidateTag(`${post.siteId}-posts`)
      revalidateTag(`posts-${post.slug}`)
      revalidatePath(`/posts/${post.slug}`)

      // sync google
      // syncToGoogleDrive(ctx.token.uid, {
      //   ...newPost,
      //   postStatus: PostStatus.PUBLISHED,
      //   collectible,
      //   creationId,
      //   cid: res.cid,
      //   gateType,
      // } as any)

      return newPost
    }),

  archive: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.update({
        where: { id: input },
        data: { postStatus: PostStatus.ARCHIVED },
      })

      revalidateTag(`posts-${post.slug}`)
      revalidatePath(`/posts/${post.slug}`)

      return post
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.delete({
        where: { id: input },
      })

      return post
    }),
})

function findSitePosts(siteId: string) {
  return prisma.post.findMany({
    where: { siteId },
    include: {
      postTags: { include: { tag: true } },
      user: {
        select: {
          displayName: true,
          image: true,
          accounts: {
            select: {
              providerAccountId: true,
              providerType: true,
            },
          },
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  })
}

function publishedSitePosts(siteId: string) {
  return prisma.post.findMany({
    where: { siteId, postStatus: PostStatus.PUBLISHED },
    include: {
      postTags: { include: { tag: true } },
      user: {
        select: {
          displayName: true,
          image: true,
          accounts: {
            select: {
              providerAccountId: true,
              providerType: true,
            },
          },
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  })
}
