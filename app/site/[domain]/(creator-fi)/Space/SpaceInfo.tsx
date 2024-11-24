'use client'

import { useSpaceContext } from '@/components/SpaceContext'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SpaceBasicInfo } from './SpaceBasicInfo'
import { SpaceStats } from './SpaceStats'

interface Props {}

export function SpaceInfo({}: Props) {
  const pathname = usePathname()
  const space = useSpaceContext()

  if (!space) return null

  const Paths = {
    about: `/creator-fi`,
    members: `/creator-fi/members`,
    plans: `/creator-fi/plans`,
    shares: `/creator-fi/contributors`,
    subscriptionRecords: `/creator-fi/subscription-records`,
    funding: `/creator-fi/funding`,
    staking: `/creator-fi/staking`,
  }

  const linkClassName = (path: string) =>
    cn(
      'inline-flex item-center justify-center py-1.5 border-b-2 px-3 -mb-[1px] border-transparent',
      path === pathname && 'border-black',
    )

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-y-8 mb-4">
        <SpaceBasicInfo />
        <SpaceStats />
      </div>

      <div className="border-b">
        <Link href={Paths.about} className={linkClassName(Paths.about)}>
          About
        </Link>

        <Link href={Paths.members} className={linkClassName(Paths.members)}>
          Members
        </Link>

        <Link href={Paths.plans} className={linkClassName(Paths.plans)}>
          Plans
        </Link>

        <Link href={Paths.shares} className={linkClassName(Paths.shares)}>
          Shares
        </Link>

        <Link
          href={Paths.subscriptionRecords}
          className={linkClassName(Paths.subscriptionRecords)}
        >
          Activities
        </Link>

        <Link href={Paths.staking} className={linkClassName(Paths.staking)}>
          Staking
        </Link>
      </div>
    </div>
  )
}
