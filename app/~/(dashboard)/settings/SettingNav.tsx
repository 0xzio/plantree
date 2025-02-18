'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {}

export function SettingNav({}: Props) {
  const pathname = usePathname()

  const Paths = {
    profile: '/~/settings/profile',
    general: '/~/settings',
    linkAccounts: '/~/settings/link-accounts',
    appearance: '/~/settings/appearance',
    features: '/~/settings/features',
    socials: '/~/settings/socials',
    domain: '/~/settings/domain',
    tags: '/~/settings/tags',
    authType: '/~/settings/auth-type',
    web3: '/~/settings/web3',
    subscription: '/~/settings/subscription',
    collaborators: '/~/settings/collaborators',
    storageProvider: '/~/settings/storage-provider',
    accessToken: '/~/settings/access-token',
    analytics: '/~/settings/analytics',
    importExport: '/~/settings/import-export',
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

      <div className="flex flex-row md:flex-col items-center md:items-start border-b md:border-none gap-x-8 overflow-x-auto overflow-y-hidden -mx-3 px-3 md:w-[240px]">
        <div className="text-xs text-foreground/30">Site</div>
        <Link href={Paths.general} className={linkClassName(Paths.general)}>
          General
        </Link>
        <Link href={Paths.features} className={linkClassName(Paths.features)}>
          Features
        </Link>

        <Link
          href={Paths.appearance}
          className={linkClassName(Paths.appearance)}
        >
          Appearance
        </Link>
        {/* <Link href={Paths.authType} className={linkClassName(Paths.authType)}>
        Auth type
      </Link> */}
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

        <Link href={Paths.domain} className={linkClassName(Paths.domain)}>
          Domain
        </Link>
        {/* <Link
        href={Paths.storageProvider}
        className={linkClassName(Paths.storageProvider)}
      >
        Storage provider
      </Link> */}
        <Link href={Paths.socials} className={linkClassName(Paths.socials)}>
          Socials
        </Link>
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
