'use client'

import { Separator } from '@/components/ui/separator'
import { Link, usePathname } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface Props {}

export function SettingNav({}: Props) {
  const pathname = usePathname()

  const Paths = {
    profile: '/~/settings/profile',
    general: '/~/settings',
    linkAccounts: '/~/settings/link-accounts',
    appearance: '/~/settings/appearance',
    i18n: '/~/settings/i18n',
    theme: '/~/settings/theme',
    navigation: '/~/settings/navigation',
    catalogue: '/~/settings/catalogue',
    features: '/~/settings/features',
    socials: '/~/settings/socials',
    domain: '/~/settings/domain',
    tags: '/~/settings/tags',
    authType: '/~/settings/auth-type',
    web3: '/~/settings/web3',
    subscription: '/~/settings/subscription',
    collaborators: '/~/settings/collaborators',
    accessToken: '/~/settings/access-token',
    analytics: '/~/settings/analytics',
    importExport: '/~/settings/import-export',
    projects: '/~/settings/projects',
    friends: '/~/settings/friends',
    backup: '/~/settings/backup',
  }

  const linkClassName = (path: string) =>
    cn(
      'inline-flex item-center justify-center md:justify-start py-1.5 border-b-2 md:border-none -mb-[1px] border-transparent flex-shrink-0 text-foreground/60 hover:text-foreground hover:border-foreground/40',
      path === pathname && 'border-foreground/60',
      path === pathname && 'text-foreground font-bold',
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-row md:flex-col items-center md:items-start border-b md:border-none gap-x-8 overflow-x-auto overflow-y-hidden -mx-3 px-3 md:w-[240px]">
        <div className="text-xs text-foreground/30">Account</div>
        <Link href={Paths.profile} className={linkClassName(Paths.profile)}>
          Profile
        </Link>
        <Link
          href={Paths.linkAccounts}
          className={linkClassName(Paths.linkAccounts)}
        >
          Link Accounts
        </Link>
      </div>

      <Separator className="w-3/4" />

      <div className="flex flex-row md:flex-col items-center md:items-start border-b md:border-none gap-x-8 overflow-x-auto overflow-y-hidden -mx-3 px-3 md:w-[240px]">
        <div className="text-xs text-foreground/30">Site - general</div>
        <Link href={Paths.general} className={linkClassName(Paths.general)}>
          General
        </Link>
        <Link href={Paths.features} className={linkClassName(Paths.features)}>
          Features
        </Link>

        <Link href={Paths.web3} className={linkClassName(Paths.web3)}>
          Web3
        </Link>

        <Link
          href={Paths.subscription}
          className={linkClassName(Paths.subscription)}
        >
          Plan & Subscription
        </Link>

        <Link href={Paths.tags} className={linkClassName(Paths.tags)}>
          Tags
        </Link>

        <Link href={Paths.socials} className={linkClassName(Paths.socials)}>
          Socials
        </Link>

        <Link href={Paths.i18n} className={linkClassName(Paths.i18n)}>
          i18n
        </Link>
        <Link href={Paths.projects} className={linkClassName(Paths.projects)}>
          Projects
        </Link>
        <Link href={Paths.friends} className={linkClassName(Paths.friends)}>
          Friends
        </Link>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-start border-b md:border-none gap-x-8 overflow-x-auto overflow-y-hidden -mx-3 px-3 md:w-[240px]">
        <div className="text-xs text-foreground/30">Site - UI</div>

        <Link href={Paths.theme} className={linkClassName(Paths.theme)}>
          Theme
        </Link>
        <Link
          href={Paths.navigation}
          className={linkClassName(Paths.navigation)}
        >
          Navigation
        </Link>
        <Link href={Paths.catalogue} className={linkClassName(Paths.catalogue)}>
          Catalogue
        </Link>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-start border-b md:border-none gap-x-8 overflow-x-auto overflow-y-hidden -mx-3 px-3 md:w-[240px]">
        <div className="text-xs text-foreground/30">Site - advanced</div>

        <Link
          href={Paths.collaborators}
          className={linkClassName(Paths.collaborators)}
        >
          Collaborators
        </Link>
        <Link
          href={Paths.accessToken}
          className={linkClassName(Paths.accessToken)}
        >
          Access token
        </Link>
        <Link href={Paths.analytics} className={linkClassName(Paths.analytics)}>
          Analytics
        </Link>

        <Link href={Paths.domain} className={linkClassName(Paths.domain)}>
          Domain
        </Link>

        <Link href={Paths.backup} className={linkClassName(Paths.backup)}>
          Backup
        </Link>

        <Link
          href={Paths.importExport}
          className={linkClassName(Paths.importExport)}
        >
          Import/Export
        </Link>
      </div>
    </div>
  )
}
