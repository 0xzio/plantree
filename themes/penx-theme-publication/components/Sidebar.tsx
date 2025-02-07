import { Post, Site } from '@penxio/types'
import { AboutCard } from './AboutCard'
import { MostPopular } from './MostPopular'

interface Props {
  site: Site
  posts: Post[]
}

export const Sidebar = ({ site, posts }: Props) => {
  return (
    <div className="w-[340px] flex-shrink-0 space-y-20">
      <MostPopular posts={posts} />
      <AboutCard site={site} />
    </div>
  )
}
