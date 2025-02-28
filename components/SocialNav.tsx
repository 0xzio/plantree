import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export function SocialNav({ className }: Props) {
  return (
    <div
      className={cn(
        'flex gap-2 justify-center items-center cursor-pointer',
        className,
      )}
    >
      <a
        href="https://discord.com/invite/nyVpH9njDu"
        target="_blank"
        className="inline-flex"
      >
        <span className="icon-[ic--round-discord] w-7 h-7  hover:text-foreground/60 text-foreground/80"></span>
      </a>
      <a
        href="https://github.com/penx-labs/penx"
        target="_blank"
        className="inline-flex"
      >
        <span className="icon-[mdi--github] w-7 h-7  hover:text-foreground/60 text-foreground/80"></span>
      </a>
      <a href="https://x.com/0xzio_eth" target="_blank" className="inline-flex">
        <span className="icon-[prime--twitter] w-5 h-5 hover:text-foreground/60 text-foreground/80"></span>
      </a>
    </div>
  )
}
