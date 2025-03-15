import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import SocialIcon from './SocialIcon'

interface Props {
  site: Site
  className?: string
  size?: number
}

export function SocialNav({ site, className, size = 5 }: Props) {
  if (!site) return null
  const socials = site.socials
  return (
    <div className={cn('flex gap-4 item-center', className)}>
      <SocialIcon kind="mail" href={`mailto:${socials?.email}`} size={6} />
      <SocialIcon kind="github" href={socials.github} size={size} />
      <SocialIcon kind="discord" href={socials.discord} size={size} />
      <SocialIcon kind="twitter" href={socials.twitter} size={size} />
      <SocialIcon kind="facebook" href={socials.facebook} size={size} />
      <SocialIcon kind="youtube" href={socials.youtube} size={size} />
      <SocialIcon kind="linkedin" href={socials.linkedin} size={size} />
      <SocialIcon kind="x" href={socials.x} size={size} />
      <SocialIcon kind="instagram" href={socials.instagram} size={size} />
      <SocialIcon kind="threads" href={socials.threads} size={size} />
    </div>
  )
}
