import { Post, Site } from '@/lib/theme.types'
import { AboutCard } from './AboutCard'
import { FeaturedPosts } from './FeaturedPosts'
import { MostPopular } from './MostPopular'

interface Props {
  about: any
  site: Site
  popularPosts: Post[]
  featuredPosts: Post[]
}

export const Sidebar = ({
  site,
  popularPosts,
  featuredPosts,
  about,
}: Props) => {
  return (
    <div className="sm:w-[340px] w-full shrink-0 space-y-10">
      <MostPopular posts={popularPosts} />
      <FeaturedPosts posts={featuredPosts} />
      <AboutCard site={site} about={about} />
    </div>
  )
}
