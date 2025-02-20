import { PropsWithChildren, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { addressMap } from '@/lib/address'
import { cn } from '@/lib/utils'
import { Link } from '@/lib/i18n'

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

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="mt-20 space-y-20 pb-20">
      <div className="flex flex-col justify-center p-8 gap-4 bg-background rounded-2xl shadow">
        <div className="font-bold text-5xl">$PEN</div>
        <div className="text-4xl font-thin text-foreground/60 space-y-1">
          <div className="">
            Tip token for{' '}
            <span className="text-brand-500 font-bold">individual Blog</span>
          </div>
          <div>
            Tip token for{' '}
            <span className="text-orange-500 font-bold">Writers</span>
          </div>
          <div className="">
            Tip token for{' '}
            <span className="text-sky-500 font-bold">PenX community</span>
          </div>
        </div>
        <div className="text-xl leading-relaxed text-foreground/80">
          $PEN is the token of PenX community, a Web3 blogging platform that
          champions content ownership and free expression. Designed to reward
          quality creators, $PEN enables tipping, subscription models, and
          governance participation. By holding $PEN, users can engage in
          community decisions and earn rewards, fostering a vibrant ecosystem
          where ideas flourish and creativity thrives. Join us in planting the
          seeds for a decentralized blog future!
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex-1 space-y-6">
            <TokenInfoItem label="Token name" value="Pen" />
            <TokenInfoItem label="Symbol" value="$PEN" />
            <TokenInfoItem label="Chain" value="Base" />
            <TokenInfoItem label="Supply" value="30,000,000,000" />
            <TokenInfoItem
              label="Contract"
              value={
                <div className="text-sm sm:text-base">
                  {addressMap.PenToken}
                </div>
              }
            />
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-2xl font-bold text-foreground/70">
              Allocation
            </div>
            <div className="space-y-4">
              <AllocationItem
                percent="66%"
                desc="PenX community"
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

      <div className="flex flex-col justify-center p-8 gap-12 bg-background rounded-2xl shadow">
        <div className="font-extrabold text-5xl pt">How get $PEN?</div>
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="text-xl font-medium">
                1. Sponsor PenX project and get $PEN:{' '}
              </div>
              <Button size="sm" asChild variant="brand">
                <Link href="/sponsor">Go to sponsor</Link>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-xl font-medium">
                2. Create a blog and get $PEN automatically.
              </div>
            </div>

            <div className="flex flex-col gap-2 text-foreground">
              <div className="flex items-center gap-4">
                <div className="text-xl font-medium ">
                  3. Contribute to the PenX project and earn rewards.
                </div>
                <Button size="sm" asChild variant="brand">
                  <Link href="/sponsor">Request rewards</Link>
                </Button>
              </div>
              <ul className="list-disc list-inside ml-5 text-foreground/80">
                <li>
                  Contribute code to{' '}
                  <a
                    href="https://github.com/penx-lab/penx"
                    className="text-brand-500"
                  >
                    github.com/penx-lab/penx
                  </a>
                  .
                </li>
                <li>
                  Contribute valid issues to{' '}
                  <a
                    href="https://github.com/penx-lab/penx"
                    target="_blank"
                    className="text-brand-500"
                  >
                    github.com/penx-lab/penx
                  </a>
                  .
                </li>
                <li>
                  Improve docs{' '}
                  <a
                    href="https://github.com/penx-lab/penx-docs"
                    target="_blank"
                    className="text-brand-500"
                  >
                    https:/github.com/penx-lab/penx-docs
                  </a>
                  .
                </li>
                <li>
                  Improve official themes{' '}
                  <a
                    href="https://github.com/penx-lab/penx-themes"
                    target="_blank"
                    className="text-brand-500"
                  >
                    github.com/penx-lab/penx-themes
                  </a>
                  .
                </li>
                <li>Create new theme.</li>
                <li>Any contributions to the PenX project...</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="text-xl font-medium">
                  4. Curate the PenX project and earn rewards.
                </div>
                <Button size="sm" asChild variant="brand">
                  <Link href="/sponsor">Request rewards</Link>
                </Button>
              </div>
              <ul className="list-disc list-inside ml-5">
                <li>Write some post about PenX</li>
                <li>Post a tweet about PenX on X</li>
                <li>Make a cast about PenX on Farcaster</li>
                <li>Any curation to the PenX project...</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
