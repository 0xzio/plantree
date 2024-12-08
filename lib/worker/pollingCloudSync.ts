import { SiteMode } from '@prisma/client'
import { get } from 'idb-keyval'
import { SITE_MODE } from '../constants'
import { getLocalSession } from '../local-session'
import { sync } from '../sync'
import { sleep } from '../utils'

export async function pollingCloudSync() {
  let pollingInterval = 10 * 1000

  // console.log('=======pollingInterval:', pollingInterval)

  while (true) {
    const mode = await get(SITE_MODE)

    if (mode === SiteMode.NOTE_TAKING) {
      try {
        const session = await getLocalSession()
        if (session?.userId) {
          await sync(true)
        }
      } catch (error) {
        console.log('error=========:', error)
      }
    }

    await sleep(pollingInterval)
  }
}
