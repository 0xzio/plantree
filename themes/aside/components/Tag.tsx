import { cn } from '@/lib/utils'
import { slug } from 'github-slugger'
import { Link } from '@/lib/i18n'

interface Props {
  text: string
  className?: string
}

const Tag = ({ text, className }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className={cn(
        'mr-3 text-base font-medium text-brand hover:text-brand/80 dark:hover:text-brand/80',
        className,
      )}
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
