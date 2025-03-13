import { ProjectsBlock } from '@/components/custom-plate-plugins/projects/react/ProjectsBlock'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { HOME_PROJECT_LIMIT, POSTS_PER_PAGE } from '@/lib/constants'
import { Link } from '@/lib/i18n'
import { Post, PostListStyle, Project, Site, Tag } from '@/lib/theme.types'
import { slug } from 'github-slugger'
import { PostItem } from '../components/PostItem'
import { FeaturedCard } from './FeaturedCard'

interface Props {
  about: any
  tags: Tag[]
  site: Site
  posts: Post[]
  projects: Project[]
}

export function HomePage({ about, posts = [], projects, tags, site }: Props) {
  const { popularPosts, featuredPosts } = extractPosts(posts)
  const showAbout = site.theme?.home?.showAbout ?? true
  const showLatestPosts = site.theme?.home?.showLatestPosts ?? true
  const showProjects = site.theme?.home?.showProjects ?? true
  const showsFeatured = site.theme?.home?.showFeatured ?? false
  const postListStyle =
    site.theme?.common?.postListStyle ?? PostListStyle.SIMPLE
  return (
    <div className="flex flex-col gap-16">
      {showAbout && <ContentRender content={about.content} />}

      {showsFeatured && <FeaturedCard posts={featuredPosts} />}

      {tags.length > 0 && (
        <div>
          <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-3xl leading-none">
            Tags
          </h1>

          <ul className="flex flex-wrap gap-x-5">
            {tags.map((t) => {
              return (
                <li key={t.id} className="">
                  <Link
                    href={`/tags/${slug(t.name)}`}
                    className="text-foreground/80 font-medium hover:text-brand dark:hover:text-brand rounded-full"
                    aria-label={`View posts tagged ${t.name}`}
                  >
                    #{`${t.name}`}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {showLatestPosts && (
        <div className="">
          <div className="pb-6 flex items-center justify-between">
            <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-3xl leading-none">
              Latest
            </h1>

            <Link
              href="/posts"
              className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
            >
              All posts &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {posts.slice(0, POSTS_PER_PAGE).map((post) => {
              return <PostItem key={post.slug} post={post} />
            })}
          </div>
        </div>
      )}

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
  const featuredPosts = posts.filter((post) => post.featured)
  const ids = popularPosts.map((post) => post.id)
  const commonPosts = posts.filter((post) => !ids.includes(post.id))
  return {
    popularPosts,
    featuredPosts,
    commonPosts,
  }
}
