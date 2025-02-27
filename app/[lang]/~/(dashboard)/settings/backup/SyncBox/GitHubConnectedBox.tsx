import { Github } from '@/components/theme-ui/SocialIcon/icons'
import { Box } from '@fower/react'
import { ExternalLink, Link } from 'lucide-react'
import { DisconnectPopover } from './DisconnectPopover'

interface Props {
  repo: string
}

export function GithubConnectedBox({ repo }: Props) {
  return (
    <Box toBetween toCenterY border borderGray100 roundedXL p4>
      <Box toCenterY gap2>
        <Github />
        <Box textBase>{repo}</Box>
        <Box as="a" href={`https://github.com/${repo}`} target="_blank">
          <ExternalLink size={16} />
        </Box>
      </Box>
      <DisconnectPopover />
    </Box>
  )
}
