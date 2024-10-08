import { Suspense } from 'react'
import { UserAvatar } from '@/components/UserAvatar'
import { getHomeSpaces } from '@/lib/fetchers'
import { precision } from '@/lib/math'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { LaunchButton } from './LaunchButton'
import { SpaceLogo } from './SpaceLogo'

export default async function HomePage() {
  const spaces = await getHomeSpaces()

  return (
    <div>
      <div className="flex items-center justify-between mt-10 mb-6">
        <div className="text-3xl font-semibold">Spaces</div>
        <Suspense fallback={''}>
          <LaunchButton />
        </Suspense>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mx-auto sm:w-full rounded-lg">
        {spaces.map((space, index) => (
          <Link
            key={space.id}
            href={`/space/${space.id}`}
            className={cn(
              'flex items-center justify-between p-5 gap-3 bg-white rounded-2xl shadow-sm hover:scale-105 cursor-pointer transition-all',
              // spaces.length !== index + 1 && 'border-b border-neutral-100/90',
            )}
          >
            <div className="flex items-center gap-2">
              <Suspense
                fallback={
                  <div className="w-12 h-12 rounded-lg bg-neutral-100" />
                }
              >
                <SpaceLogo address={space.address} />
              </Suspense>

              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <div className="text-xl font-semibold mr-3">{space.name}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-neutral-700 text-sm">
                    ${space.symbol}
                  </div>
                  <div className="text-xs text-neutral-500">
                    TVL {precision.toDecimal(space.ethVolume).toFixed(6)} ETH
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-neutral-500">
                    {space.memberCount} members
                  </div>
                  <div className="flex gap-1">
                    {space.members.map((item) => (
                      <UserAvatar
                        key={item.id}
                        address={item.account}
                        className={cn('w-5 h-5')}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* <Button asChild size="sm" className="cursor-pointer rounded-xl">
              <Link href={`/space/${space.id}`}>Visit space</Link>
            </Button> */}
          </Link>
        ))}
      </div>
    </div>
  )
}
