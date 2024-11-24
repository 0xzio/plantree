'use client'

import { useState } from 'react'
import { useSpaceContext } from '@/components/SpaceContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MemberList } from '../../Space/MemberList'
import { SubscriptionRecordList } from '../../Space/SubscriptionRecordList'
import { AddPlanDialog } from './plans/AddPlanDialog/AddPlanDialog'
import { PlanList } from './plans/PlanList'

enum TabTypes {
  Plans = 'Plans',
  Members = 'Members',
  Activities = 'Activities',
}

export const dynamic = 'force-static'

export default function Page() {
  const [type, setType] = useState(TabTypes.Plans)
  const space = useSpaceContext()

  return (
    <div className="text-foreground">
      <Tabs
        className="w-full"
        value={type}
        onValueChange={(v) => {
          setType(v as TabTypes)
        }}
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value={TabTypes.Plans}>Plans</TabsTrigger>
            <TabsTrigger value={TabTypes.Members}>Members</TabsTrigger>
            <TabsTrigger value={TabTypes.Activities}>Activities</TabsTrigger>
          </TabsList>

          {type === TabTypes.Plans && <AddPlanDialog />}
        </div>
        <TabsContent value={TabTypes.Plans} className="pt-4">
          <PlanList align="left" />
        </TabsContent>
        <TabsContent value={TabTypes.Members} className="pt-4">
          <MemberList space={space} />
        </TabsContent>
        <TabsContent value={TabTypes.Activities} className="pt-4">
          <SubscriptionRecordList space={space} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
