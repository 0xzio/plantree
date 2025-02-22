import { editorDefaultValue, ELEMENT_P } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

interface Input {
  siteId: string
  id?: string
  slug?: string
}

export async function getDatabaseData<T = any>(input: Input) {
  const where: Record<string, any> = {
    siteId: input.siteId,
  }
  if (input.slug) where.slug = input.slug
  if (input.id) where.id = input.id

  const database = await prisma.database.findFirstOrThrow({
    include: {
      views: true,
      fields: true,
      records: true,
    },
    where,
  })
  // console.log('=======>>>database:', database, database.records)

  const data = database.records.map((record) => {
    return database.fields.reduce(
      (acc, item) => {
        return {
          ...acc,
          [item.name]: (record.fields as any)[item.id],
        }
      },
      {} as Record<string, any>,
    )
  })
  return data as T[]
}
