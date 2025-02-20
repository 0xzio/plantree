import { LangSwitcher } from '@/components/LangSwitcher'
import { ModeToggle } from '@/components/ModeToggle'
import { SocialNav } from '@/components/SocialNav'
import { Link } from '@/lib/i18n'
import { ExternalLink } from 'lucide-react'

interface Props {}

export function Footer({}: Props) {
  return (
    <footer className="mt-auto mb-4">
      <div className="flex flex-col items-center">
        <div className="flex space-x-4 item-center mb-2">
          <SocialNav className="text-foreground/80" />
        </div>

        <div className="flex gap-4 text-sm justify-center item-center text-foreground/50">
          <div className="flex items-center"></div>
          <div className="flex items-center">
            <a
              href="https://github.com/penx-labs/penx"
              target="_blank"
              className="flex items-center gap-1"
            >
              <span>About</span>
              {/* <div className="inline-flex">
                <ExternalLink size={16}></ExternalLink>
              </div> */}
            </a>
          </div>

          <div className="flex items-center">
            <a
              href="https://docs.penx.io/"
              target="_blank"
              className="flex items-center gap-1"
            >
              <span>Docs</span>
            </a>
          </div>

          <div className="flex items-center">
            <a
              href="https://0xzio.penx.io/"
              target="_blank"
              className="flex items-center gap-1"
            >
              <span>Blog</span>
              {/* <div className="inline-flex">
                <ExternalLink size={16}></ExternalLink>
              </div> */}
            </a>
          </div>
          <div className="flex items-center">
            <a
              href="https://github.com/penx-labs/penx-desktop/releases"
              target="_blank"
              className="flex items-center gap-1"
            >
              <span>Download</span>
              {/* <div className="inline-flex">
                <ExternalLink size={16}></ExternalLink>
              </div> */}
            </a>
          </div>
          <div className="flex items-center">
            <Link href="/privacy" className="">
              Privacy
            </Link>
          </div>

          <div className="flex items-center">
            <Link href="/refund-policy" className="">
              Refund policy
            </Link>
          </div>

          <div className="flex items-center">
            <Link href="/terms" className="">
              Terms & Conditions
            </Link>
          </div>
        </div>
        <div className="flex gap-2 text-sm justify-center item-center text-foreground/50">
          <div className="flex items-center">{`© ${new Date().getFullYear()}`}</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center">PenX</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center">All rights reserved</div>
          <div className="flex items-center">{` • `}</div>
          <ModeToggle />
          <LangSwitcher />
        </div>
      </div>
    </footer>
  )
}
