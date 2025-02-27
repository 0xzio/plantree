import { NETWORK, NetworkNames } from '@/lib/constants'
import { Post, Site } from '@prisma/client'
import { step } from 'viem/chains'
import { getTokenByInstallationId } from './getTokenByInstallationId'
import { SyncService } from './SyncService'

export async function syncPostToHub(site: Site, post: Post) {
  // if (NETWORK !== NetworkNames.BASE) return
  const token = await getTokenByInstallationId(site.installationId!)
  const sync = await SyncService.init(token, site)
  await sync.pushPost(post)
}
