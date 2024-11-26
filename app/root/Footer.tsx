import { ModeToggle } from '@/components/ModeToggle'
import { SocialNav } from '@/components/SocialNav'

interface Props {}

export function Footer({}: Props) {
  return (
    <footer className="mt-auto mb-4">
      <div className="flex flex-col items-center">
        <div className="flex space-x-4 item-center">
          <SocialNav className="text-foreground/80" />
        </div>
        <div className="flex gap-2 text-sm justify-center item-center text-foreground/50">
          <div className="flex items-center">{`© ${new Date().getFullYear()}`}</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center">PenX</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center">All rights reserved</div>
          <div className="flex items-center">{` • `}</div>
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}
