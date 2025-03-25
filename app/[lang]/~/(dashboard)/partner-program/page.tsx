// export const runtime = 'edge'
// export const dynamic = 'force-static'

import { ReferralList } from './ReferralList'

export default function Page() {
  return (
    <div>
      <div>
        <div className="text-xl font-semibold">My referrals</div>
        <ReferralList />
      </div>
    </div>
  )
}
