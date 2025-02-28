import { NETWORK, NetworkNames } from '@/lib/constants'
import { Post, Site } from '@prisma/client'
import { SyncService } from './SyncService'
import { api } from './trpc'

export async function syncPostToHub(site: Site, post: Post, markdown = '') {
  // if (NETWORK !== NetworkNames.BASE) return
  const token = await api.github.getGitHubToken.query({
    installationId: site.installationId!,
  })
  const sync = await SyncService.init(token, site)
  await sync.pushPost(post, markdown)
}
