import { FriendsBlock } from '@/components/theme-ui/FriendsBlock'
import { Friend, Site } from '@/lib/theme.types'

interface Props {
  site: Site
  friends: Friend[]
}

export function FriendsPage({ site, friends }: Props) {
  return <FriendsBlock site={site} friends={friends} />
}
