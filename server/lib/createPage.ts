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
  const { userId, siteId } = input
  const newPage = await prisma.page.create({
    data: {
      props: {},
      children: [],
      ...input,
    },
  })

  const newBlock = await prisma.block.create({
    data: {
      userId,
      siteId,
      pageId: newPage.id,
      parentId: newPage.id,
      content: editorDefaultValue[0],
      type: ELEMENT_P,
      props: {},
      children: [],
    },
  })

  await prisma.page.update({
    where: { id: newPage.id },
    data: { children: [newBlock.id] },
  })

  newPage.children = [newBlock.id]
  return newPage
}
