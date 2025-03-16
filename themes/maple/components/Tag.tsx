import { slug } from 'github-slugger'
import { Link } from '@/lib/i18n'
import { PostTag } from '@/lib/theme.types'
import { cn } from '@/lib/utils'

interface Props {
  postTag: PostTag
  className?: string
}

const Tag = ({ postTag, className }: Props) => {
  return (
    <Link
      href={`/tags/${slug(postTag.tag.name)}`}
      className={cn(
        'mr-3 text-base font-medium text-brand hover:text-brand/80 dark:hover:text-brand/80',
        className,
      )}
    >
      {postTag.tag.name.split(' ').join('-')}
    </Link>
  )
}

export default Tag
