import { cn } from '@/lib/utils'
import {
  Discord,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Mastodon,
  Threads,
  Twitter,
  X,
  Youtube,
} from './icons'

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  x: X,
  mastodon: Mastodon,
  discord: Discord,
  threads: Threads,
  instagram: Instagram,
}

type SocialIconProps = {
  kind:
    | keyof typeof components
    | 'farcaster'
    | 'bilibili'
    | 'telegram'
    | 'slack'
    | 'medium'
  href: string | undefined
  size?: number
}

const SocialIcon = ({ kind, href, size = 8 }: SocialIconProps) => {
  if (
    !href ||
    (kind === 'mail' &&
      !/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(href))
  )
    return null

  let SocialSvg = components[kind]

  if (kind === 'bilibili') {
    return (
      <div className="h-full inline-flex">
        <span
          className={cn(`icon-[mingcute--bilibili-line] size-${size}`)}
        ></span>
      </div>
    )
  }

  if (kind === 'telegram') {
    return (
      <div className="h-full inline-flex">
        <span className={`icon-[lineicons--telegram] size-${size}`}></span>
      </div>
    )
  }

  if (kind === 'slack') {
    return (
      <div className="h-full inline-flex">
        <span className={`icon-[mdi--slack] size-${size}`}></span>
      </div>
    )
  }

  if (kind === 'farcaster') {
    return (
      <div className="h-full inline-flex">
        <span className={`icon-[simple-icons--farcaster] size-${size}`}></span>
      </div>
    )
  }

  if (kind === 'medium') {
    return (
      <div className="h-full inline-flex">
        <span className={`icon-[ri--medium-fill] size-${size}`}></span>
      </div>
    )
  }

  if (!SocialSvg) return <span>{kind.slice(0, 1)}</span>

  return (
    <a
      className="text-sm transition text-foreground/60 hover:text-foreground/70 leading-none"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`fill-current text-foreground/70 dark:text-background/60 hover:text-brand dark:hover:text-brand/80 size-${size}`}
      />
    </a>
  )
}

export default SocialIcon
