import { useEffect, useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Github } from '@/components/theme-ui/SocialIcon/icons'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/useSession'
import { Box } from '@fower/react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export function GitHubAuthButton() {
  const [loading, setLoading] = useState(false)
  const { data } = useSession()

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    errorMessage && toast.error(errorMessage)
  }, [error])

  return (
    <Button
      size="lg"
      className="gap-x-2 w-52"
      disabled={loading}
      onClick={() => {
        setLoading(true)
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
        const baseURL = process.env.NEXT_PUBLIC_ROOT_HOST

        const callbackURL = `${baseURL}/api/github-oauth`
        const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${data?.userId}&redirect_uri=${callbackURL}`
        console.log('url======>>>>>>>:', url)

        location.href = url
      }}
    >
      {loading ? (
        <LoadingDots className="bg-background" />
      ) : (
        <>
          <Github className="w-4 h-4 fill-background" />
          <Box>Connect GitHub</Box>
        </>
      )}
    </Button>
  )
}
