'use client'

import { ReactNode } from 'react'
import { Link } from '@/lib/i18n'
import { ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

type NavItem = {
  text?: ReactNode
  icon?: ReactNode
  to: string
  isExternal?: boolean
  isToast?: boolean
}

export const Nav = () => {
  const navData: NavItem[] = [
    {
      text: 'Themes',
      to: '/themes',
    },
    // {
    //   text: 'Marketplace',
    //   to: '/marketplace',
    // },

    {
      text: 'Self-Hosted',
      to: '/self-hosted',
    },

    // {
    //   text: 'Tokenomics',
    //   to: '/tokenomics',
    // },

    // {
    //   text: 'Sponsor',
    //   to: '/sponsor',
    // },
    {
      text: 'Pricing',
      to: '/pricing',
    },
    // {
    //   text: 'Rewards',
    //   to: '/rewards',
    // },
    // {
    //   text: 'Download',
    //   isExternal: true,
    //   to: 'https://github.com/penx-labs/penx-desktop/releases',
    // },
  ]

  return (
    <div className="items-center gap-6 hidden md:flex">
      {navData.map((item, i) => {
        if (item.isToast) {
          return (
            <div
              key={i}
              className="inline-flex text-foreground/80 cursor-pointer"
              onClick={() => {
                toast.success(
                  'Join PenX Discord and contact 0xZio in "Join this project" channel.',
                )
              }}
            >
              {item.text}
            </div>
          )
        }
        if (item.isExternal) {
          return (
            <div key={i}>
              <a
                href={item.to}
                target="_blank"
                className="text-foreground/80 flex items-center gap-1"
              >
                {item.text && <div>{item.text}</div>}
                {!!item.icon && item.icon}
                <div className="inline-flex">
                  <ExternalLink size={16}></ExternalLink>
                </div>
              </a>
            </div>
          )
        }

        return (
          <div key={i}>
            <Link href={item.to} className="text-foreground/80">
              {item.text}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
