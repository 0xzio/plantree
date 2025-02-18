export enum CatalogueNodeType {
  DOC = 'DOC',
  LINK = 'LINK',
  CATEGORY = 'CATEGORY',
}
export interface ICatalogueNode {
  id: string // nodeId

  folded: boolean

  type: CatalogueNodeType

  emoji?: string

  title?: string

  uri?: string // url or postId

  children?: ICatalogueNode[]
}
