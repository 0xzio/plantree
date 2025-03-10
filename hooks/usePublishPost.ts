import { useState } from 'react'
import { editorPlugins } from '@/components/editor/plugins/editor-plugins'
import { useCheckChain } from '@/hooks/useCheckChain'
import { loadPost, Post, postAtom, usePost } from '@/hooks/usePost'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { creationFactoryAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { syncPostToHub } from '@/lib/syncPostToHub'
import { api } from '@/lib/trpc'
import { store } from '@/store'
import { GateType, PostType } from '@prisma/client'
import { createPlateEditor } from '@udecode/plate/react'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
import { z } from 'zod'
import { useSiteContext } from '../components/SiteContext'

export const PublishPostFormSchema = z.object({
  slug: z.string().min(1, { message: 'Slug is required' }),
  gateType: z.nativeEnum(GateType),
  collectible: z.any(),
  delivered: z.any(),
})

export type PublishPostOptions = z.infer<typeof PublishPostFormSchema>

export function usePublishPost() {
  const site = useSiteContext()
  const { spaceId, id } = site
  const { address } = useAccount()
  const [isLoading, setLoading] = useState(false)
  const checkChain = useCheckChain()
  const { writeContractAsync } = useWriteContract()
  const wagmiConfig = useWagmiConfig()

  return {
    isLoading,
    publishPost: async (opt: PublishPostOptions, currentPost?: Post) => {
      const { gateType, collectible, delivered, slug } = opt
      setLoading(true)
      const post = currentPost || store.get(postAtom)

      let creationId: number | undefined
      try {
        if (spaceId && typeof post?.creationId !== 'number' && collectible) {
          await checkChain()
          const hash = await writeContractAsync({
            address: addressMap.CreationFactory,
            abi: creationFactoryAbi,
            functionName: 'create',
            args: [post?.slug, precision.token(0.0001024), spaceId as Address],
          })

          await waitForTransactionReceipt(wagmiConfig, { hash })

          const creation = await readContract(wagmiConfig, {
            address: addressMap.CreationFactory,
            abi: creationFactoryAbi,
            functionName: 'getUserLatestCreation',
            args: [address!],
          })
          creationId = Number(creation.id)
        }

        await api.post.publish.mutate({
          siteId: id,
          type: post?.type || PostType.ARTICLE,
          slug,
          postId: post?.id,
          gateType,
          collectible,
          creationId,
          delivered,
        })

        setLoading(false)
        revalidateMetadata(`posts`)
        // revalidateMetadata(`posts-${post.slug}`)
        toast.success('published successfully!')

        // backup to github
        if (site.repo && site.installationId) {
          const editor = createPlateEditor({
            value: JSON.parse(post.content),
            plugins: editorPlugins,
          })

          const content = (editor.api as any).markdown.serialize()
          syncPostToHub(site, post, content).catch((error) => {
            const msg = extractErrorMessage(error)
            toast.error(msg)
          })
        }
      } catch (error) {
        console.log('========error:', error)
        const msg = extractErrorMessage(error)
        toast.error(msg)
        setLoading(false)
      }
    },
  }
}
