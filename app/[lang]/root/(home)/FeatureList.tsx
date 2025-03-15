import { cn } from '@/lib/utils'
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
  title: string
  description: string
}

const features: FeatureItem[] = [
  {
    icon: <BotIcon size={24} />,
    title: 'AI-assistants',
    description:
      'Enhance your content creation with AI-powered tools and suggestions.',
  },
  {
    icon: <UserIcon size={24} />,
    title: 'Build for super individual',
    description:
      'Tailored for individual creators to express themselves freely.',
  },
  {
    icon: <MailIcon size={24} />,
    title: 'Newsletters built-in',
    description:
      'Easily create and send newsletters to keep your audience engaged.',
  },
  {
    icon: <ZapIcon size={24} />,
    title: 'Memberships built-in',
    description: 'Offer exclusive content and benefits to loyal members.',
  },
  {
    icon: <BugIcon size={24} />,
    title: 'SEO friendly',
    description: 'Optimize your content for search engines with ease.',
  },
  {
    icon: <PencilIcon size={24} />,
    title: 'Modern editor',
    description:
      'Enjoy a seamless writing experience with our intuitive editor.',
  },
  {
    title: 'Data ownership',
    description: 'Maintain full control over your content and data.',
  },
  {
    icon: <MessageCircleMore size={24} />,
    title: 'Comments built-in',
    description:
      'Engage with your audience through integrated comment features.',
  },
  {
    icon: <PaletteIcon size={24} />,
    title: 'Beautiful themes',
    description:
      'Customize your site with a variety of visually appealing themes.',
  },
]
// Version control backup

export function FeatureList() {
  return (
    <div className="mt-10 space-y-10">
      <div className="text-center space-y-4">
        <div className="text-5xl font-bold">Features</div>
        <div className="text-xl text-foreground/60">
          Powerful features to build to modern individual blog
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
