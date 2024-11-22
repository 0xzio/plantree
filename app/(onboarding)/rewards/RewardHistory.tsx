import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RewardRequest } from '@prisma/client'

interface Props {
  rewardRequests: RewardRequest[] | []
  isLoading: boolean
}

export const RewardHistory = ({ rewardRequests, isLoading }: Props) => {
  const pendingRequests = rewardRequests?.filter(
    (reward) => reward.status === 'PENDING',
  )

  return (
    <Tabs defaultValue="all" className="">
      <TabsList>
        <TabsTrigger value="all" className="data-[state=active]:bg-white">
          All
        </TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        {isLoading ? (
          <SkeletonTable />
        ) : rewardRequests?.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-sm font-medium leading-none">
            No records found.
          </div>
        ) : (
          <RewardTable data={rewardRequests} />
        )}
      </TabsContent>

      <TabsContent value="pending">
        {isLoading ? (
          <SkeletonTable />
        ) : pendingRequests?.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-sm font-medium leading-none">
            No records found.
          </div>
        ) : (
          <RewardTable data={pendingRequests} />
        )}
      </TabsContent>
    </Tabs>
  )
}

const SkeletonTable = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Type</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Token Amount</TableHead>
        <TableHead>Created At</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-6 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-full" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

const RewardTable = ({ data }: { data: RewardRequest[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Type</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Token Amount</TableHead>
        <TableHead>Created At</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data &&
        data.map((reward: RewardRequest) => (
          <TableRow key={reward.id}>
            <TableCell className="font-medium">{reward.type}</TableCell>
            <TableCell>{reward.status}</TableCell>
            <TableCell>{reward.tokenAmount}</TableCell>
            <TableCell>{new Date(reward.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
)
