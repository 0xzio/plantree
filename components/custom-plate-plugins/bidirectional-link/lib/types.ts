import type { TElement } from '@udecode/plate'

export interface TBidirectionalLinkElement extends TElement {
  postId: string
}

export interface TBidirectionalLinkInputElement extends TElement {
  trigger: string
}

export interface TBidirectionalLinkItemBase {
  text: string
  key?: any
}
