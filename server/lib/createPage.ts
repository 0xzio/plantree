import { editorDefaultValue, ELEMENT_P } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

interface Input {
  userId: string
  siteId: string
  title: string
  isJournal?: boolean
  date?: string
}

export async function createPage(input: Input) {
  const newPage = await prisma.post.create({
    data: {
      content: JSON.stringify(editorDefaultValue),
      isPage: true,
      ...input,
    },
  })

  return newPage
}
