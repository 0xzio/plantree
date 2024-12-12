import { NETWORK, NetworkNames } from '@/lib/constants'
import { Post, Site } from '@prisma/client'
import { getTokenByInstallationId } from './getTokenByInstallationId'
import { SyncService } from './SyncService'

export async function syncSiteToHub(site: Site) {
  if (NETWORK !== NetworkNames.BASE) return
  const token = await getTokenByInstallationId()
  const sync = await SyncService.init(token)
  await sync.pushSite(site)
}
