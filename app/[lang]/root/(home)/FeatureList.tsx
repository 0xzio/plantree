import { cn } from '@/lib/utils'

type FeatureItem = {
  title: string
  description: string
}

const features: FeatureItem[] = [
  {
    title: 'Build for super individual',
    description:
      'Tailored for individual creators to express themselves freely.',
  },
  {
    title: 'Newsletters built-in',
    description:
      'Easily create and send newsletters to keep your audience engaged.',
  },
  {
    title: 'Memberships built-in',
    description: 'Offer exclusive content and benefits to loyal members.',
  },
  {
    title: 'SEO friendly',
    description: 'Optimize your content for search engines with ease.',
  },
  {
    title: 'Modern editor',
    description:
      'Enjoy a seamless writing experience with our intuitive editor.',
  },
  {
    title: 'Data ownership',
    description: 'Maintain full control over your content and data.',
  },
]
// Version control backup

export function FeatureList() {
  return (
    <div className="mt-10 space-y-4">
      <div className="text-4xl font-bold">Features</div>
      <div className="bg-background">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 rounded-md border-foreground/5 overflow-hidden shadow">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'p-8 border-foreground/5 space-y-2',
                (index + 1) % 3 !== 0 && 'xl:border-r',
                index < 3 && 'xl:border-b',
                index < 5 && 'sm:border-b md:border-b',
                (index + 1) % 2 !== 0 && 'sm:border-r md:border-r',
              )}
            >
              <div className="text-lg font-bold">{feature.title}</div>
              <div className="text-base text-foreground/50">
                {feature.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
