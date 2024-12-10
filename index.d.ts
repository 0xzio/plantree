import { Site } from '@prisma/client'

declare global {
  interface Window {
    __SITE__: Site
    __USER_ID__: string
  }
}
