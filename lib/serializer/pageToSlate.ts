import { RouterOutputs } from '@/server/_app'
import { Block } from '@prisma/client'

export type PageData = RouterOutputs['page']['byId']

/**
 * page to slate
 */
export function pageToSlate(page: PageData) {
  const serializer = new PageToSlateSerializer(page)
  return serializer.getEditorValue()
}

export class PageToSlateSerializer {
  blockMap = new Map<string, Block>()

  constructor(private page: PageData) {
    const blocks = page.blocks as any as Block[]

    for (const item of blocks) {
      this.blockMap.set(item.id, item)
    }
  }

  getEditorValue() {
    return this.getBlockContent()
  }

  getBlockContent() {
    const value: any[] = []

    const blockIds = this.page.children as string[]
    for (const id of blockIds) {
      const block = this.blockMap.get(id)!
      if (!block) continue
      value.push({
        ...(block.content as any),
        id: block.id,
      })
    }

    return value
  }
}
