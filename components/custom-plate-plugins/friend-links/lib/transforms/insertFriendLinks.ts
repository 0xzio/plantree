import type { InsertNodesOptions, SlateEditor } from '@udecode/plate'
import {
  BaseFriendLinksPlugin,
  type TFriendLinksElement,
} from '../BaseFriendLinksPlugin'

export const insertFriendLinks = (
  editor: SlateEditor,
  {
    ...options
  }: InsertNodesOptions & {
    icon?: string
    variant?: (string & {}) | TFriendLinksElement['variant']
  } = {},
) => {
  editor.tf.insertNodes<TFriendLinksElement>(
    {
      children: [{ text: '' }],
      postId: '',
      type: editor.getType(BaseFriendLinksPlugin),
    },
    options as any,
  )
}
