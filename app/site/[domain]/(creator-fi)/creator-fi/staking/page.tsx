import { StakingPage } from './StakingPage'

export const dynamic = 'force-static'
export const revalidate = 3600 * 24

export default function Page() {
  return <StakingPage />
}
