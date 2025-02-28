import { getRandomColorName } from '@/lib/color-helper'
import {
  FRIEND_DATABASE_NAME,
  PENX_LOGO_URL,
  PENX_URL,
  PROJECT_DATABASE_NAME,
} from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { FieldType, Option, ViewField, ViewType } from '@/lib/types'
import { uniqueId } from '@/lib/unique-id'
import { arrayMoveImmutable } from 'array-move'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { getDatabaseData } from '../lib/getDatabaseData'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const databaseRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.database.findMany({
        where: {
          siteId: input.siteId,
        },
        orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      })
    }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return prisma.database.findFirstOrThrow({
      include: {
        views: true,
        fields: true,
        records: true,
      },
      where: { id: input },
    })
  }),

  getProjects: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return getDatabaseData({
        siteId: input.siteId,
        slug: PROJECT_DATABASE_NAME,
      })
    }),

  getFriends: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return getDatabaseData({
        siteId: input.siteId,
        slug: FRIEND_DATABASE_NAME,
      })
    }),

  bySlug: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return prisma.database.findFirstOrThrow({
      include: {
        views: true,
        fields: true,
        records: true,
      },
      where: {
        id: input,
        siteId: ctx.activeSiteId,
      },
    })
  }),

  create: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const newDatabase = await tx.database.create({
            data: {
              ...input,
              userId: ctx.token.uid,
              color: getRandomColorName(),
            },
          })

          const firstField = await tx.field.create({
            data: {
              databaseId: newDatabase.id,
              fieldType: FieldType.TEXT,
              name: uniqueId(),
              displayName: 'Title',
              isPrimary: true,
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const secondField = await tx.field.create({
            data: {
              databaseId: newDatabase.id,
              fieldType: FieldType.SINGLE_SELECT,
              name: uniqueId(),
              displayName: 'Tag',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const newFields = [firstField, secondField]

          const viewFields = newFields.map((field) => ({
            fieldId: field.id,
            width: 160,
            visible: true,
          }))

          const tableView = await tx.view.create({
            data: {
              databaseId: newDatabase.id,
              name: 'Table',
              viewType: ViewType.TABLE,
              viewFields,
              sorts: [],
              filters: [],
              groups: [],
              kanbanOptionIds: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const listView = await tx.view.create({
            data: {
              databaseId: newDatabase.id,
              name: 'Gallery',
              viewType: ViewType.GALLERY,
              viewFields,
              sorts: [],
              filters: [],
              groups: [],
              kanbanOptionIds: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          await tx.database.update({
            where: { id: newDatabase.id },
            data: {
              activeViewId: tableView.id,
              viewIds: [tableView.id, listView.id],
            },
          })

          const recordFields = newFields.reduce(
            (acc, field) => {
              return {
                ...acc,
                [field.id]: '',
              }
            },
            {} as Record<string, any>,
          )

          await tx.record.createMany({
            data: [
              {
                databaseId: newDatabase.id,
                sort: 0,
                fields: recordFields,
                siteId: input.siteId,
                userId: ctx.token.uid,
              },
              {
                databaseId: newDatabase.id,
                sort: 1,
                fields: recordFields,
                siteId: input.siteId,
                userId: ctx.token.uid,
              },
            ],
          })

          return newDatabase
        },
        {
          maxWait: 1000 * 60, // default: 2000
          timeout: 1000 * 60, // default: 5000
        },
      )
    }),

  addRecord: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        siteId: z.string(),
        databaseId: z.string(),
        fields: z.record(z.unknown()),
        sort: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.record.create({
        data: {
          userId: ctx.token.uid,
          ...input,
          fields: input.fields as any,
        },
      })
      return true
    }),

  addRefBlockRecord: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        databaseId: z.string(),
        refBlockId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const fieldList = await prisma.field.findMany({
        where: { databaseId: input.databaseId },
      })

      const count = await prisma.field.count({
        where: { databaseId: input.databaseId },
      })

      const newFields = fieldList.reduce(
        (acc, field) => {
          return {
            ...acc,
            [field.id]: field.isPrimary
              ? { refType: 'BLOCK', id: input.refBlockId }
              : '',
          }
        },
        {} as Record<string, any>,
      )

      const record = await prisma.record.create({
        data: {
          userId: ctx.token.uid,
          siteId: input.siteId,
          databaseId: input.databaseId,
          sort: count + 1,
          fields: newFields,
        },
      })

      return record
    }),

  addField: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        siteId: z.string(),
        databaseId: z.string(),
        fieldType: z.string(),
        name: z.string(),
        displayName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const field = await tx.field.create({
            data: {
              ...input,
              options: [],
              config: {},
              userId: ctx.token.uid,
            },
          })

          const viewList = await tx.view.findMany({
            where: { databaseId: input.databaseId },
          })

          for (const view of viewList) {
            await tx.view.update({
              where: { id: view.id },
              data: {
                viewFields: [
                  ...(view.viewFields as any),
                  {
                    fieldId: field.id,
                    width: 160,
                    visible: true,
                  },
                ],
              },
            })
          }

          const recordList = await tx.record.findMany({
            where: { databaseId: input.databaseId },
          })

          for (const record of recordList) {
            await tx.record.update({
              where: { id: record.id },
              data: {
                fields: {
                  ...(record.fields as any),
                  [field.id]: '',
                },
              },
            })
          }

          return true
        },
        {
          maxWait: 1000 * 60, // default: 2000
          timeout: 1000 * 60, // default: 5000
        },
      )
    }),

  updateField: protectedProcedure
    .input(
      z.object({
        fieldId: z.string(),
        name: z.string().optional(),
        displayName: z.string().optional(),
        fieldType: z.string().optional(),
        options: z.array(z.any()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: handle options
      const { fieldId, options, ...rest } = input
      const field = await prisma.field.update({
        where: { id: fieldId },
        data: rest,
      })

      const { slug } = await prisma.database.findUniqueOrThrow({
        where: { id: field.databaseId },
        select: { slug: true },
      })

      const siteId = ctx.activeSiteId
      if (slug === PROJECT_DATABASE_NAME) {
        revalidateTag(`${siteId}-projects`)
      }

      if (slug === FRIEND_DATABASE_NAME) {
        revalidateTag(`${siteId}-friends`)
      }
      return true
    }),

  sortViewFields: protectedProcedure
    .input(
      z.object({
        viewId: z.string(),
        fromIndex: z.number(),
        toIndex: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const view = await prisma.view.findUniqueOrThrow({
        where: { id: input.viewId },
      })

      await prisma.view.update({
        where: { id: input.viewId },
        data: {
          viewFields: arrayMoveImmutable(
            view?.viewFields as any as ViewField[],
            input.fromIndex,
            input.toIndex,
          ) as any,
        },
      })

      return true
    }),

  updateRecord: protectedProcedure
    .input(
      z.object({
        recordId: z.string(),
        fields: z.record(z.unknown()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const record = await prisma.record.update({
        where: { id: input.recordId },
        data: { fields: input.fields as any },
      })

      const { slug } = await prisma.database.findUniqueOrThrow({
        where: { id: record.databaseId },
        select: { slug: true },
      })

      const siteId = ctx.activeSiteId
      if (slug === PROJECT_DATABASE_NAME) {
        revalidateTag(`${siteId}-projects`)
      }

      if (slug === FRIEND_DATABASE_NAME) {
        revalidateTag(`${siteId}-friends`)
      }

      return true
    }),

  deleteField: protectedProcedure
    .input(
      z.object({
        databaseId: z.string(),
        fieldId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [viewList, recordList] = await Promise.all([
        prisma.view.findMany({
          where: { databaseId: input.databaseId },
        }),
        prisma.record.findMany({
          where: { databaseId: input.databaseId },
        }),

        prisma.field.delete({
          where: { id: input.fieldId },
        }),
      ])

      for (const view of viewList) {
        const viewFields = view.viewFields as any as ViewField[]

        await prisma.view.update({
          where: { id: view.id },
          data: {
            viewFields: viewFields.filter(
              (i) => i.fieldId !== input.fieldId,
            ) as any,
          },
        })
      }

      for (const record of recordList) {
        const fields = record.fields as Record<string, any>
        delete fields[input.fieldId]

        await prisma.record.update({
          where: { id: record.id },
          data: { fields },
        })
      }

      return true
    }),

  deleteRecord: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const record = await prisma.record.delete({ where: { id: input } })

      const { slug } = await prisma.database.findUniqueOrThrow({
        where: { id: record.databaseId },
        select: { slug: true },
      })

      const siteId = ctx.activeSiteId
      if (slug === PROJECT_DATABASE_NAME) {
        revalidateTag(`${siteId}-projects`)
      }

      if (slug === FRIEND_DATABASE_NAME) {
        revalidateTag(`${siteId}-friends`)
      }
      return true
    }),

  updateViewField: protectedProcedure
    .input(
      z.object({
        viewId: z.string(),
        fieldId: z.string(),
        width: z.number().optional(),
        visible: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const view = await prisma.view.findUniqueOrThrow({
        where: { id: input.viewId },
      })

      const viewFields = view!.viewFields as any as ViewField[]

      for (const viewField of viewFields) {
        if (viewField.fieldId === input.fieldId) {
          if (input.width) viewField.width = input.width
          if (typeof input.visible === 'boolean') {
            viewField.visible = input.visible
          }
        }
      }

      await prisma.view.update({
        where: { id: input.viewId },
        data: { viewFields: viewFields as any },
      })

      return true
    }),

  addOption: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        fieldId: z.string(),
        name: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const field = await prisma.field.findUniqueOrThrow({
        where: { id: input.fieldId },
      })

      const options = (field?.options as any as Option[]) || []

      await prisma.field.update({
        where: { id: input.fieldId },
        data: {
          options: [...options, input],
        },
      })

      return true
    }),

  updateDatabase: protectedProcedure
    .input(
      z.object({
        databaseId: z.string(),
        name: z.string().optional(),
        color: z.string().optional(),
        cover: z.string().optional(),
        icon: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { databaseId, ...rest } = input
      await prisma.database.update({
        where: { id: databaseId },
        data: rest,
      })
      return true
    }),

  deleteDatabase: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await prisma.record.deleteMany({
        where: { databaseId: input },
      })
      await prisma.field.deleteMany({
        where: { databaseId: input },
      })
      await prisma.view.deleteMany({
        where: { databaseId: input },
      })
      await prisma.database.delete({
        where: { id: input },
      })
      return true
    }),

  getOrCreateProjectsDatabase: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const projectsDatabase = await tx.database.findFirst({
            include: {
              views: true,
              fields: true,
              records: true,
            },
            where: {
              siteId: input.siteId,
              slug: PROJECT_DATABASE_NAME,
            },
          })

          if (projectsDatabase) return projectsDatabase

          const newDatabase = await tx.database.create({
            data: {
              siteId: input.siteId,
              userId: ctx.token.uid,
              name: 'Project',
              slug: PROJECT_DATABASE_NAME,
              color: getRandomColorName(),
            },
          })

          const nameField = await tx.field.create({
            data: {
              databaseId: newDatabase.id,
              fieldType: FieldType.TEXT,
              displayName: 'Name',
              name: 'name',
              isPrimary: true,
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const introductionField = await tx.field.create({
            data: {
              databaseId: newDatabase.id,
              fieldType: FieldType.TEXT,
              name: 'introduction',
              displayName: 'Introduction',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const iconField = await tx.field.create({
            data: {
              databaseId: newDatabase.id,
              fieldType: FieldType.IMAGE,
              name: 'icon',
              displayName: 'Icon',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const coverField = await tx.field.create({
            data: {
              databaseId: newDatabase.id,
              fieldType: FieldType.IMAGE,
              name: 'cover',
              displayName: 'Cover',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const urlField = await tx.field.create({
            data: {
              databaseId: newDatabase.id,
              fieldType: FieldType.URL,
              name: 'url',
              displayName: 'URL',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const newFields = [
            nameField,
            introductionField,
            iconField,
            coverField,
            urlField,
          ]

          const viewFields = newFields.map((field) => ({
            fieldId: field.id,
            width: 160,
            visible: true,
          }))

          const tableView = await tx.view.create({
            data: {
              databaseId: newDatabase.id,
              name: 'Table',
              viewType: ViewType.TABLE,
              viewFields,
              sorts: [],
              filters: [],
              groups: [],
              kanbanOptionIds: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          await tx.database.update({
            where: { id: newDatabase.id },
            data: {
              activeViewId: tableView.id,
              viewIds: [tableView.id],
            },
          })

          const recordFields = newFields.reduce(
            (acc, field, index) => {
              let value = ''
              if (index === 0) value = 'PenX'
              if (index === 1) value = 'modern dynamic blogging tools'
              if (index === 2) value = PENX_LOGO_URL
              if (index === 3) value = PENX_LOGO_URL
              if (index === 4) value = PENX_URL
              return {
                ...acc,
                [field.id]: value,
              }
            },
            {} as Record<string, any>,
          )

          await tx.record.createMany({
            data: [
              {
                databaseId: newDatabase.id,
                sort: 0,
                fields: recordFields,
                siteId: input.siteId,
                userId: ctx.token.uid,
              },
            ],
          })

          return tx.database.findUniqueOrThrow({
            include: {
              views: true,
              fields: true,
              records: true,
            },
            where: { id: newDatabase.id },
          })
        },
        {
          maxWait: 1000 * 60, // default: 2000
          timeout: 1000 * 60, // default: 5000
        },
      )
    }),

  getOrCreateFriendsDatabase: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const friendsDatabase = await tx.database.findFirst({
            include: {
              views: true,
              fields: true,
              records: true,
            },
            where: {
              siteId: input.siteId,
              slug: FRIEND_DATABASE_NAME,
            },
          })

          if (friendsDatabase) return friendsDatabase

          const newDatabase = await tx.database.create({
            data: {
              siteId: input.siteId,
              userId: ctx.token.uid,
              name: 'Friend',
              slug: FRIEND_DATABASE_NAME,
              color: getRandomColorName(),
            },
          })

          const nameField = await tx.field.create({
            data: {
              databaseId: newDatabase.id,
              fieldType: FieldType.TEXT,
              displayName: 'Name',
              name: 'name',
              isPrimary: true,
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const introductionField = await tx.field.create({
            data: {
              databaseId: newDatabase.id,
              fieldType: FieldType.TEXT,
              name: 'introduction',
              displayName: 'Introduction',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const iconField = await tx.field.create({
            data: {
              databaseId: newDatabase.id,
              fieldType: FieldType.IMAGE,
              name: 'avatar',
              displayName: 'Avatar',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const urlField = await tx.field.create({
            data: {
              databaseId: newDatabase.id,
              fieldType: FieldType.URL,
              name: 'url',
              displayName: 'URL',
              config: {},
              options: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          const newFields = [nameField, introductionField, iconField, urlField]

          const viewFields = newFields.map((field) => ({
            fieldId: field.id,
            width: 160,
            visible: true,
          }))

          const tableView = await tx.view.create({
            data: {
              databaseId: newDatabase.id,
              name: 'Table',
              viewType: ViewType.TABLE,
              viewFields,
              sorts: [],
              filters: [],
              groups: [],
              kanbanOptionIds: [],
              siteId: input.siteId,
              userId: ctx.token.uid,
            },
          })

          await tx.database.update({
            where: { id: newDatabase.id },
            data: {
              activeViewId: tableView.id,
              viewIds: [tableView.id],
            },
          })

          const recordFields = newFields.reduce(
            (acc, field, index) => {
              let value = ''
              if (index === 0) value = 'Zio'
              if (index === 1) value = 'Creator of PenX'
              if (index === 2) value = PENX_LOGO_URL
              if (index === 3) value = 'https://zio.penx.io'
              return {
                ...acc,
                [field.id]: value,
              }
            },
            {} as Record<string, any>,
          )

          await tx.record.createMany({
            data: [
              {
                databaseId: newDatabase.id,
                sort: 0,
                fields: recordFields,
                siteId: input.siteId,
                userId: ctx.token.uid,
              },
            ],
          })

          return tx.database.findUniqueOrThrow({
            include: {
              views: true,
              fields: true,
              records: true,
            },
            where: { id: newDatabase.id },
          })
        },
        {
          maxWait: 1000 * 60, // default: 2000
          timeout: 1000 * 60, // default: 5000
        },
      )
    }),
})
