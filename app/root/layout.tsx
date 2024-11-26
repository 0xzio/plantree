import { ModeToggle } from '@/components/ModeToggle'
import { Profile } from '@/components/Profile/Profile'
import { SocialNav } from '@/components/SocialNav'
import { TextLogo } from '@/components/TextLogo'
import { Philosopher } from 'next/font/google'
import Link from 'next/link'
import { Footer } from './Footer'
import { Nav } from './Nav'

const logoFont = Philosopher({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 container px-2 min-h-screen">
      <div className="z-10  py-3 relative flex justify-between">
        <div className="flex items-center">
          <Link href="/" className="cursor-pointer flex items-center">
            <TextLogo />
          </Link>
        </div>

        <Nav />

        <div className="flex items-center gap-2">
          <Profile />
        </div>
      </div>

      <div className="relative">
        <div className="z-10 relative">{children}</div>
        <div
          className="fixed left-[30%] top-[400px] -z-10 w-[800px] h-[800px] opacity-30 dark:opacity-0"
          style={{
            filter: 'blur(150px) saturate(150%)',
            transform: 'translateZ(0)',
            backgroundImage:
              'radial-gradient(at 27% 37%, #3a8bfd 0, transparent 50%), radial-gradient(at 97% 21%, #9772fe 0, transparent 50%), radial-gradient(at 52% 99%, #fd3a4e 0, transparent 50%), radial-gradient(at 10% 29%, #5afc7d 0, transparent 50%), radial-gradient(at 97% 96%, #e4c795 0, transparent 50%), radial-gradient(at 33% 50%, #8ca8e8 0, transparent 50%), radial-gradient(at 79% 53%, #eea5ba 0, transparent 50%)',
          }}
        ></div>
      </div>
      <Footer />
    </div>
  )
}
