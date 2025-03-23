'use client'

import { PropsWithChildren } from 'react'
import { Separator } from '@/components/ui/separator'
import { Link, usePathname } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'

interface Props {}

export function SettingNav({}: Props) {
  const pathname = usePathname()

  const Paths = {
    profile: '/~/settings/profile',
    general: '/~/settings',
    linkAccounts: '/~/settings/link-accounts',
    appearance: '/~/settings/appearance',
    i18n: '/~/settings/i18n',
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
    membership: '/~/settings/membership',
    products: '/~/settings/products',
    orders: '/~/settings/orders',
    seo: '/~/settings/seo',
    campaign: '/~/settings/campaign',
    design: '/~/settings/design',
  }

  const linkClassName = (path: string) =>
    cn(
      'inline-flex item-center justify-center md:justify-start py-1.5 border-b-2 md:border-none -mb-[1px] border-transparent shrink-0 text-foreground/60 hover:text-foreground hover:border-foreground/40',
      path === pathname && 'border-foreground/60',
      path === pathname && 'text-foreground font-bold',
    )

  return (
    <div className="space-y-6 pb-10">
      <Section title="Account">
        <Link href={Paths.profile} className={linkClassName(Paths.profile)}>
          <Trans>Profile</Trans>
        </Link>
        <Link
          href={Paths.linkAccounts}
          className={linkClassName(Paths.linkAccounts)}
        >
          <Trans>Link accounts</Trans>
        </Link>
      </Section>

      <Separator className="w-3/4" />

      <Section title="Site - general">
        <Link href={Paths.general} className={linkClassName(Paths.general)}>
          <Trans>General</Trans>
        </Link>
        <Link href={Paths.features} className={linkClassName(Paths.features)}>
          <Trans>Features</Trans>
        </Link>

        {/* <Link href={Paths.web3} className={linkClassName(Paths.web3)}>
          Web3
        </Link> */}

        <Link
          href={Paths.subscription}
          className={linkClassName(Paths.subscription)}
        >
          <Trans>Billing & plan</Trans>
        </Link>

        <Link href={Paths.tags} className={linkClassName(Paths.tags)}>
          <Trans>Tags</Trans>
        </Link>

        {/* <Link href={Paths.i18n} className={linkClassName(Paths.i18n)}>
          <Trans>i18n</Trans>
        </Link> */}
      </Section>

      <Section title="Site - creator economy">
        <Link
          href={Paths.membership}
          className={linkClassName(Paths.membership)}
        >
          <Trans>Membership</Trans>
        </Link>
        <Link href={Paths.products} className={linkClassName(Paths.products)}>
          <Trans>Products</Trans>
        </Link>
        <Link href={Paths.orders} className={linkClassName(Paths.orders)}>
          <Trans>Orders</Trans>
        </Link>
        <Link href={Paths.campaign} className={linkClassName(Paths.campaign)}>
          <Trans>Campaign</Trans>
        </Link>
      </Section>

      <Section title="Site - UI">
        <Link
          href={Paths.appearance}
          className={linkClassName(Paths.appearance)}
        >
          <Trans>Appearance</Trans>
        </Link>
        <Link
          href={Paths.navigation}
          className={linkClassName(Paths.navigation)}
        >
          <Trans>Navigation</Trans>
        </Link>
        <Link href={Paths.socials} className={linkClassName(Paths.socials)}>
          <Trans>Socials</Trans>
        </Link>

        <Link href={Paths.projects} className={linkClassName(Paths.projects)}>
          <Trans>Projects</Trans>
        </Link>
        <Link href={Paths.friends} className={linkClassName(Paths.friends)}>
          <Trans>Friends</Trans>
        </Link>
        <Link href={Paths.catalogue} className={linkClassName(Paths.catalogue)}>
          <Trans>Catalogue</Trans>
        </Link>
        <Link href={Paths.design} className={linkClassName(Paths.design)}>
          <Trans>Design</Trans>
        </Link>
      </Section>

      <Section title="Site - advanced">
        <Link
          href={Paths.collaborators}
          className={linkClassName(Paths.collaborators)}
        >
          <Trans>Collaborators</Trans>
        </Link>
        <Link
          href={Paths.accessToken}
          className={linkClassName(Paths.accessToken)}
        >
          <Trans>Access token</Trans>
        </Link>

        <Link href={Paths.seo} className={linkClassName(Paths.seo)}>
          <Trans>SEO</Trans>
        </Link>

        <Link href={Paths.analytics} className={linkClassName(Paths.analytics)}>
          <Trans>Analytics</Trans>
        </Link>

        <Link href={Paths.domain} className={linkClassName(Paths.domain)}>
          <Trans>Domain</Trans>
        </Link>

        <Link href={Paths.backup} className={linkClassName(Paths.backup)}>
          <Trans>Backup</Trans>
        </Link>

        <Link
          href={Paths.importExport}
          className={linkClassName(Paths.importExport)}
        >
          <Trans>Import/Export</Trans>
        </Link>
      </Section>
    </div>
  )
}

function Section({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="flex flex-row md:flex-col items-center md:items-start border-b md:border-none gap-x-8 overflow-x-auto overflow-y-hidden -mx-3 px-3 md:w-[240px]">
      <div className="text-xs text-foreground/30">{title}</div>
      {children}
    </div>
  )
}
