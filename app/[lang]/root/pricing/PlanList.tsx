import { PlanItem } from './PlanItem'

export function PlanList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center">
      <PlanItem
        price={0}
        name="Free"
        type="FREE"
        collaboratorCount={1}
        benefits={[
          '1 collaborators',
          '5 free official themes',
          'Custom domain',
        ]}
      />
      <PlanItem
        price={10}
        name="Creator"
        type="CREATOR"
        collaboratorCount={5}
        benefits={[
          '5 collaborators',
          'Unlimited custom themes',
          'Custom domain',
          'Sending newsletters',
          'AI assistance',
          'One-to-One support in discord',
        ]}
      />
      <PlanItem
        price={50}
        name="Team"
        type="TEAM"
        collaboratorCount={20}
        benefits={[
          '20 collaborators',
          'Unlimited custom themes',
          'Custom domain',
          'Sending newsletters',
          'AI assistance',
          'One-to-One support in discord',
          'Priority support',
        ]}
      />
    </div>
  )
}
