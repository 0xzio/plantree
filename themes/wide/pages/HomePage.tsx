import { ProjectsBlock } from '@/components/custom-plate-plugins/projects/react/ProjectsBlock'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import {
  HOME_PROJECT_LIMIT,
  LATEST_POSTS_LIMIT,
  POSTS_PER_PAGE,
} from '@/lib/constants'
import { Link } from '@/lib/i18n'
import { Post, PostListStyle, Project, Site, Tag } from '@/lib/theme.types'
import { PostItem } from '../components/PostItem'

interface Props {
  about: any
  tags: Tag[]
  site: Site
  posts: Post[]
  projects: Project[]
}

export function HomePage({ about, posts = [], projects, tags, site }: Props) {
  const { popularPosts, featuredPost, commonPosts } = extractPosts(posts)
  const showAbout = site.theme?.home?.showAbout ?? true
  const showLatestPosts = site.theme?.home?.showLatestPosts ?? true
  const showProjects = site.theme?.home?.showProjects ?? true
  const showsFeatured = site.theme?.home?.showFeatured ?? false
  const postListStyle =
    site.theme?.common?.postListStyle ?? PostListStyle.SIMPLE
  return (
    <div className="mb-20 flex flex-col gap-16">
      {showAbout && <ContentRender content={about.content} />}

      <div className="">
        <div className="pb-6 pt-6 flex items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-3xl leading-none">
            Latest
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, LATEST_POSTS_LIMIT).map((post) => {
            return <PostItem key={post.slug} post={post} />
          })}
        </div>
      </div>

      {showProjects && projects.length > 0 && (
        <div>
          <div className="pb-6 pt-6 flex items-center justify-between">
            <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-3xl leading-none">
              Projects
            </h1>

            {projects.length > HOME_PROJECT_LIMIT && (
              <Link
                href="/projects"
                className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
              >
                All projects &rarr;
              </Link>
            )}
          </div>
          <ProjectsBlock projects={projects.slice(0, HOME_PROJECT_LIMIT)} />
        </div>
      )}
    </div>
  )
}

function extractPosts(posts: Post[]) {
  const popularPosts = posts.filter((post) => post.isPopular)
  const featuredPost = posts.find((post) => post.featured) || posts[0]
  const ids = popularPosts.map((post) => post.id)
  if (featuredPost) ids.push(featuredPost.id)
  const commonPosts = posts.filter((post) => !ids.includes(post.id))
  return {
    popularPosts,
    featuredPost,
    commonPosts,
  }
}
