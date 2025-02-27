import { Box } from '@fower/react'
import { GitHubAuthButton } from './GitHubAuthButton'
import { GithubConnectionBox } from './GitHubConnectionBox'
import { GitIntegration } from './GitIntegration'
import { useGitHubToken } from './useGitHubToken'

export const ConnectGitHub = () => {
  const { github, isTokenValid, isLoading } = useGitHubToken()

  return (
    <Box rounded2XL>
      <div className="text-2xl font-bold">Github Connection</div>
      <Box mb6 gray600>
        Connect to you GitHub Repository, so you can sync docs to GitHub
      </Box>

      <GithubConnectionBox isLoading={isLoading}>
        {isTokenValid ? (
          <GitIntegration github={github!} />
        ) : (
          <GitHubAuthButton />
        )}
      </GithubConnectionBox>
    </Box>
  )
}
