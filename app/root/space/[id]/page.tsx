import { getSpaceIds } from '@/lib/fetchers'
import { PageSpace } from './PageSpace'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24 * 365

export async function generateStaticParams() {
  const t0 = Date.now()
  const spaces = await getSpaceIds()
  const t1 = Date.now()
  console.log('get space ids time>>>>>', t1 - t0)
  return spaces.map((item) => item.id)
}

export default function Page() {
  return <PageSpace />
}
