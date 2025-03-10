import { bindFirst, createSlatePlugin, type TElement } from '@udecode/plate'
import { insertFriendLinks } from './transforms'

export interface TFriendLinksElement extends TElement {
  postId?: string
}

export const BaseFriendLinksPlugin = createSlatePlugin({
  key: 'friend-links',
  node: { isElement: true },
}).extendEditorTransforms(({ editor }) => ({
  insert: { callout: bindFirst(insertFriendLinks, editor) },
}))
