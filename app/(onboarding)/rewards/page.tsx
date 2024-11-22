import { PageRewards } from './PageRewards'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24 * 365

export default function Page() {
  return <PageRewards />
}
