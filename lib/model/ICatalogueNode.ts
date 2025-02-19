export enum CatalogueNodeType {
  POST = 'POST',
  PAGE = 'PAGE',
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

export interface CatalogueNodeJSON {
  id: string // nodeId

  folded: boolean

  type: CatalogueNodeType

  emoji?: string

  title?: string

  uri?: string // url or postId

  hasChildren: boolean
}
