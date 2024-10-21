import { PropsWithChildren, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { addressMap } from '@/lib/address'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface TokenInfoItemProps {
  label: string
  value: ReactNode
}

// export const runtime = 'edge'

function TokenInfoItem({ label, value }: TokenInfoItemProps) {
  return (
    <div className="space-y-2">
      <div className="text-foreground/60 text-xl">{label}</div>
      <div className="text-foreground font-bold text-3xl">{value}</div>
    </div>
  )
}

interface AllocationItemProps {
  percent: string
  desc: string
  dotColor: string
}

function AllocationItem({ percent, desc, dotColor }: AllocationItemProps) {
  return (
    <div className="flex gap-2 items-center">
      <div className={cn('w-3 h-3 rounded-full', dotColor)} />
      <div className="text-foreground text-2xl font-bold w-14">{percent}</div>
      <div className="text-foreground/60 text-lg">{desc}</div>
    </div>
  )
}

export default function Page() {
  return (
    <div className="mt-20 space-y-20 pb-20">
      <div className="flex flex-col justify-center p-8 gap-8 bg-background dark:bg-zinc-800 rounded-2xl shadow">
        <div className="font-extrabold text-5xl">$TREE Token</div>
        <div className="text-xl leading-relaxed text-foreground/90">
          $TREE is the token of Plantree community, a Web3 blogging platform
          that champions content ownership and free expression. Designed to
          reward quality creators, $TREE enables tipping, subscription models,
          and governance participation. By holding $TREE, users can engage in
          community decisions and earn rewards, fostering a vibrant ecosystem
          where ideas flourish and creativity thrives. Join us in planting the
          seeds for a decentralized blog future!
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex-1 space-y-6">
            <TokenInfoItem label="Token name" value="Tree" />
            <TokenInfoItem label="Symbol" value="$TREE" />
            <TokenInfoItem label="Chain" value="Base" />
            <TokenInfoItem label="Supply" value="30,000,000,000" />
            <TokenInfoItem
              label="Contract"
              value={
                <div className="text-sm sm:text-base">
                  {addressMap.TreeToken}
                </div>
              }
            />
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-2xl font-bold text-foreground/40">
              Allocation
            </div>
            <div className="space-y-4">
              <AllocationItem
                percent="66%"
                desc="Plantree community"
                dotColor="bg-green-500"
              />
              <AllocationItem
                percent="4%"
                desc="Liquidity Providers"
                dotColor="bg-orange-500"
              />
              <AllocationItem
                percent="10%"
                desc="Early sponsors"
                dotColor="bg-red-500"
              />
              <AllocationItem
                percent="8%"
                desc="Early backers"
                dotColor="bg-red-500"
              />
              <AllocationItem
                percent="12%"
                desc="Core contributors"
                dotColor="bg-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center p-8 gap-12 bg-background dark:bg-zinc-800 rounded-2xl shadow">
        <div className="font-extrabold text-5xl pt">How get $TREE?</div>
        <div>
          <div className="text-xl leading-relaxed text-foreground/60 mb-4">
            There to way to get $TREE:
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold">
                1. Sponsor Plantree project and get $TREE:{' '}
              </div>
              <Button size="sm" asChild variant="brand">
                <Link href="/sponsor">Go to sponsor</Link>
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-xl font-bold">
                2. Do any contribution to Plantree project and get rewards.
              </div>
              <ul className="list-disc list-inside ml-5">
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
                <li>Item 3</li>
                <li>Item 3</li>
                <li>Item 3</li>
              </ul>

              <div>
                <Button size="sm" asChild variant="brand">
                  <Link href="/sponsor">Request rewards</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
