import { SitePost } from '@/lib/types'
import { getEditorPlugin, type SlateEditor } from '@udecode/plate'
import {
  BaseBidirectionalLinkPlugin,
  type BidirectionalLink,
} from './BaseBidirectionalLinkPlugin'
import type { TBidirectionalLinkItemBase } from './types'

export type BidirectionalLinkOnSelectItem<TItem extends SitePost = SitePost> = (
  editor: SlateEditor,
  item: TItem,
  search?: string,
) => void

export const getBidirectionalLinkOnSelectItem =
  <TItem extends SitePost = SitePost>({
    key = BaseBidirectionalLinkPlugin.key,
  }: { key?: string } = {}): BidirectionalLinkOnSelectItem<TItem> =>
  (editor, item, search = '') => {
    const { getOptions, tf } = getEditorPlugin<BidirectionalLink>(editor, {
      key: key as any,
    })
    const { insertSpaceAfterMention } = getOptions()

    tf.insert.mention({ search, postId: item.id })

    // move the selection after the element
    editor.tf.move({ unit: 'offset' })

    const pathAbove = editor.api.block()?.[1]

    const isBlockEnd =
      editor.selection &&
      pathAbove &&
      editor.api.isEnd(editor.selection.anchor, pathAbove)

    if (isBlockEnd && insertSpaceAfterMention) {
      editor.tf.insertText(' ')
    }
  }
