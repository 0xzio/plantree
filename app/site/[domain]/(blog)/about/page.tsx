import { ContentRender } from '@/components/ContentRender/ContentRender'
import { getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default async function HomePage({
  params,
}: {
  params: { domain: string }
}) {
  const [site] = await Promise.all([getSite(params)])
  const { AboutPage } = loadTheme(site.themeName)

  if (!AboutPage) {
    return <div>Theme not found</div>
  }

  return <AboutPage site={site} ContentRender={ContentRender} />
}
