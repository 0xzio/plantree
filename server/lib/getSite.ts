import { editorDefaultValue } from '@/app/(creator-fi)/constants'
import { prisma } from '@/lib/prisma'
import { getUrl } from '@/lib/utils'
import { Site } from '@penxio/types'
import { AuthType, StorageProvider } from '@prisma/client'

export async function getSite(id = '') {
  const site = await prisma.site.findFirstOrThrow({
    // where: { id },
  })

  function getAbout() {
    if (!site?.about) return editorDefaultValue
    try {
      return JSON.parse(site.about)
    } catch (error) {
      return editorDefaultValue
    }
  }

  return {
    ...site,
    // spaceId: site.spaceId || process.env.NEXT_PUBLIC_SPACE_ID,
    spaceId: process.env.NEXT_PUBLIC_SPACE_ID || site.spaceId,
    logo: getUrl(site.logo || ''),
    image: getUrl(site.image || ''),
    about: getAbout(),
  } as any as Site
}
