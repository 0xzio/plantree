import { editorDefaultValue, ELEMENT_P } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { Option } from '@/lib/types'

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

  const database = await prisma.database.findFirst({
    include: {
      views: true,
      fields: true,
      records: {
        orderBy: {
          sort: 'asc',
        },
      },
    },
    where,
  })
  if (!database) return []

  const data = database.records.map((record) => {
    return database.fields.reduce(
      (acc, item) => {
        let value = (record.fields as any)[item.id]
        if (item.name === 'status') {
          const options = item.options as any as Option[]
          const option = options?.find((o) => o.id === value?.[0])
          value = option?.name || 'pending'
        }
        return {
          ...acc,
          [item.name]: value,
        }
      },
      {} as Record<string, any>,
    )
  })
  return data as T[]
}
