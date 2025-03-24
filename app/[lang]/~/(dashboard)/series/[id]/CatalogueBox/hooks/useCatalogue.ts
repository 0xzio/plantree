import { useSeriesContext } from '@/components/SeriesContext'
import { CatalogueTree, CreateCatalogueNodeOptions } from '@/lib/catalogue'
import { CatalogueNodeType, ICatalogueNode } from '@/lib/model'
import { queryClient } from '@/lib/queryClient'
import { trpc } from '@/lib/trpc'
import { uniqueId } from '@/lib/unique-id'

export function useCatalogue() {
  const series = useSeriesContext()
  const { mutateAsync } = trpc.series.updateSeries.useMutation()
  const catalogue = CatalogueTree.fromJSON(series!.catalogue || [])

  async function update(catalogue: CatalogueTree) {
    const json = catalogue.toJSON()

    queryClient.setQueriesData(
      { queryKey: ['series', series!.id] },
      { ...series, catalogue: json },
    )
    await mutateAsync({ id: series!.id, catalogue: json })
  }

  async function addNode(
    opt: Partial<CreateCatalogueNodeOptions>,
    parentId?: string,
  ) {
    const { id, type, title, ...res } = opt
    catalogue.addNode(
      {
        id: id || uniqueId(),
        folded: false,
        type: type || CatalogueNodeType.CATEGORY,
        title: title || '',
        children: [],
        ...res,
      },
      parentId,
    )
    await update(catalogue)
  }

  async function updateTitle(id: string, title: string) {
    catalogue.updateTitle(id, title)
    await update(catalogue)
  }

  async function updateEmoji(id: string, unified: string) {
    catalogue.updateEmoji(id, unified)
    await update(catalogue)
  }

  async function deleteNode(nodeId: string) {
    catalogue.deleteNode(nodeId)
    await update(catalogue)
  }

  async function setNodes(nodes: any) {
    const catalogue = CatalogueTree.fromJSON(nodes)
    await update(catalogue)
  }

  return { catalogue, addNode, updateTitle, deleteNode, setNodes, updateEmoji }
}
