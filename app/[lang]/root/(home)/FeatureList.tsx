import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import {
  BotIcon,
  BugIcon,
  MailIcon,
  MessageCircleMore,
  PaletteIcon,
  PencilIcon,
  RocketIcon,
  UserIcon,
  ZapIcon,
} from 'lucide-react'

type FeatureItem = {
  icon?: any
  title: any
  description: any
}

// Version control backup

export function FeatureList() {
  const features: FeatureItem[] = [
    {
      icon: <BotIcon size={24} />,
      title: <Trans>AI-assistants</Trans>,
      description: (
        <Trans>
          Enhance your content creation with AI-powered tools and suggestions.
        </Trans>
      ),
    },
    {
      icon: <UserIcon size={24} />,
      title: <Trans>Build for super individual</Trans>,
      description: (
        <Trans>
          Tailored for individual creators to express themselves freely.
        </Trans>
      ),
    },
    {
      icon: <MailIcon size={24} />,
      title: <Trans>Newsletters built-in</Trans>,
      description: (
        <Trans>
          Easily create and send newsletters to keep your audience engaged.
        </Trans>
      ),
    },
    {
      icon: <ZapIcon size={24} />,
      title: <Trans>Memberships built-in</Trans>,
      description: (
        <Trans>Offer exclusive content and benefits to loyal members.</Trans>
      ),
    },
    {
      icon: <BugIcon size={24} />,
      title: <Trans>SEO friendly</Trans>,
      description: (
        <Trans>Optimize your content for search engines with ease.</Trans>
      ),
    },
    {
      icon: <PencilIcon size={24} />,
      title: <Trans>Modern editor</Trans>,
      description: (
        <Trans>
          Enjoy a seamless writing experience with our intuitive editor.
        </Trans>
      ),
    },
    {
      title: <Trans>Data ownership</Trans>,
      description: (
        <Trans>Maintain full control over your content and data.</Trans>
      ),
    },
    {
      icon: <MessageCircleMore size={24} />,
      title: <Trans>Comments built-in</Trans>,
      description: (
        <Trans>
          Engage with your audience through integrated comment features.
        </Trans>
      ),
    },
    {
      icon: <PaletteIcon size={24} />,
      title: <Trans>Beautiful themes</Trans>,
      description: (
        <Trans>
          Customize your site with a variety of visually appealing themes.
        </Trans>
      ),
    },
  ]

  return (
    <div className="mt-10 space-y-10">
      <div className="text-center space-y-4">
        <div className="text-5xl font-bold">
          <Trans>Features</Trans>
        </div>
        <div className="text-xl text-foreground/60">
          <Trans>Powerful features to build to digital garden</Trans>
        </div>
      </div>
      <div className="bg-transparent">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 border-foreground/10 overflow-hidden border-l border-t">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'p-8 border-foreground/10 space-y-2 bg-background/30 border-r border-b group transition-all',
              )}
            >
              {feature.icon ?? <RocketIcon size={24} />}
              <div className="text-lg font-bold transition-all group-hover:scale-105">
                {feature.title}
              </div>
              <div className="text-base text-foreground/50  transition-all group-hover:scale-105">
                {feature.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
