import { PageCreateSpace } from './PageCreateSpace'

export const dynamic = 'force-static'
export const revalidate = 86400; // 3600 * 24 * 365

export default function Page() {
  return <PageCreateSpace />
}
