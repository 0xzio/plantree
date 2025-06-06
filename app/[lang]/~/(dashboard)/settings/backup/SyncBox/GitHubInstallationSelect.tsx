import { useSiteContext } from '@/components/SiteContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MenuItem } from '@/components/ui/menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { trpc } from '@/lib/trpc'
import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

interface Props {
  token: string
  value: string
  onChange: (value: string) => void
}

export function GithubInstallationSelect({ token, value, onChange }: Props) {
  const site = useSiteContext()
  const { data: installations, isLoading: isLoadInstallations } =
    trpc.github.appInstallations.useQuery({
      token,
    })

  // console.log('installations:', installations)

  const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME
  const newAppURL = `https://github.com/apps/${appName}/installations/new?state=${site.id}`

  return (
    <Select value={value} onValueChange={(v) => onChange(v)}>
      <SelectTrigger className="flex-1">
        <SelectValue placeholder="Select a account"></SelectValue>
      </SelectTrigger>
      <SelectContent className="">
        {installations?.map((item) => (
          <SelectItem
            className="flex gap-1 items-center"
            key={item.installationId}
            value={item.installationId.toString()}
          >
            <div className="flex gap-1 items-center w-40">
              <Avatar className="w-5 h-5">
                <AvatarImage src={item.avatarUrl} />
                <AvatarFallback>{item.accountName}</AvatarFallback>
              </Avatar>
              <div>{item.accountName}</div>
            </div>
          </SelectItem>
        ))}

        <MenuItem
          className="gap-1"
          onClick={() => {
            location.href = newAppURL
          }}
        >
          <Box inlineFlex gray600>
            <Plus size={20} />
          </Box>
          <Box>Add GitHub Account</Box>
        </MenuItem>
      </SelectContent>
    </Select>
  )
}
