import { Post, Site } from '@/lib/theme.types'
import { AboutCard } from './AboutCard'
import { MostPopular } from './MostPopular'

interface Props {
  about: any
  site: Site
  posts: Post[]
}

export const Sidebar = ({ site, posts, about }: Props) => {
  return (
    <div className="sm:w-[340px] w-full shrink-0 space-y-20">
      <MostPopular posts={posts} />
      <AboutCard site={site} about={about} />
    </div>
  )
}
