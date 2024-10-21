import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export function SocialNav({ className }: Props) {
  return (
    <div
      className={cn(
        'flex gap-2 justify-center items-center mx-auto cursor-pointer',
        className,
      )}
    >
      <a
        href="https://discord.com/invite/nyVpH9njDu"
        target="_blank"
        className="inline-flex"
      >
        <span className="i-[ic--round-discord] w-7 h-7 hover:text-foreground text-foreground/70"></span>
      </a>
      <a
        href="https://github.com/plantree-xyz/plantree"
        target="_blank"
        className="inline-flex"
      >
        <span className="i-[mdi--github] w-7 h-7 hover:text-foreground text-foreground/70"></span>
      </a>
      <a href="https://x.com/0xzio_eth" target="_blank" className="inline-flex">
        <span className="i-[prime--twitter] w-5 h-5 hover:text-foreground text-foreground/70"></span>
      </a>
    </div>
  )
}
