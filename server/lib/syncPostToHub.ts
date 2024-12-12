import { NETWORK, NetworkNames } from '@/lib/constants'
import { Post } from '@prisma/client'
import { getTokenByInstallationId } from './getTokenByInstallationId'
import { SyncService } from './SyncService'

export async function syncPostToHub(post: Post) {
  if (NETWORK !== NetworkNames.BASE) return
  const token = await getTokenByInstallationId()
  const sync = await SyncService.init(token)
  await sync.pushPost(post)
}
