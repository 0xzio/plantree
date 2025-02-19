import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import SocialIcon from './SocialIcon'

interface Props {
  site: Site
  className?: string
}

export function SocialNav({ site, className }: Props) {
  if (!site) return null
  const socials = site.socials
  return (
    <div className={cn('flex gap-4 item-center', className)}>
      <SocialIcon kind="mail" href={`mailto:${socials?.email}`} size={6} />
      <SocialIcon kind="github" href={socials.github} size={6} />
      <SocialIcon kind="discord" href={socials.discord} size={6} />
      <SocialIcon kind="twitter" href={socials.twitter} size={6} />
      <SocialIcon kind="facebook" href={socials.facebook} size={6} />
      <SocialIcon kind="youtube" href={socials.youtube} size={6} />
      <SocialIcon kind="linkedin" href={socials.linkedin} size={6} />
      <SocialIcon kind="x" href={socials.x} size={6} />
      <SocialIcon kind="instagram" href={socials.instagram} size={6} />
      <SocialIcon kind="threads" href={socials.threads} size={6} />
    </div>
  )
}
