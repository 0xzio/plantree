import { ProjectsBlock } from '@/components/custom-plate-plugins/projects/react/ProjectsBlock'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { PostItem } from '@/components/theme-ui/post-item-blocks'
import { POSTS_PER_PAGE } from '@/lib/constants'
import { Post, PostListStyle, Project, Site } from '@/lib/theme.types'
import Link from '../components/Link'

const LATEST_POSTS_LIMIT = 2
const HOME_POSTS_LIMIT = 4

interface Props {
  site: Site
  posts: Post[]
  projects: Project[]
}

export function HomePage({ posts = [], site, projects }: Props) {
  const showAbout = site.theme?.home?.showAbout ?? true
  const showLatestPosts = site.theme?.home?.showLatestPosts ?? true
  const showProjects = site.theme?.home?.showProjects ?? true
  const postListStyle =
    site.theme?.common?.postListStyle ?? PostListStyle.SIMPLE

  return (
    <div className="space-y-16">
      {showAbout && (
        <section className="max-w-none">
          <PageTitle>{site.name}</PageTitle>
          <ContentRender content={site.about} />
        </section>
      )}

      {showLatestPosts && (
        <section className="">
          <div className="pb-6 pt-6 flex items-center justify-between">
            <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-3xl leading-none">
              Latest
            </h1>

            {posts.length > LATEST_POSTS_LIMIT && (
              <Link
                href="/posts"
                className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
              >
                All posts &rarr;
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-6">
            {!posts.length && 'No posts found.'}
            {posts.slice(0, LATEST_POSTS_LIMIT).map((post) => {
              return (
                <PostItem
                  key={post.id}
                  post={post}
                  postListStyle={postListStyle}
                />
              )
            })}
          </div>
        </section>
      )}

      {showProjects && (
        <div>
          <div className="pb-6 pt-6 flex items-center justify-between">
            <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-3xl leading-none">
              Projects
            </h1>

            {posts.length > LATEST_POSTS_LIMIT && (
              <Link
                href="/projects"
                className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
              >
                All projects &rarr;
              </Link>
            )}
          </div>
          <ProjectsBlock projects={projects.slice(0, 4)} />
        </div>
      )}
    </div>
  )
}
