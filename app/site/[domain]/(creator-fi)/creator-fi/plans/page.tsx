import { PlanList } from './PlanList'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default async function Page() {
  return <PlanList className="justify-start" />
}
