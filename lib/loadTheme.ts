import * as aside from '@/themes/aside'
import * as card from '@/themes/card'
import * as docs from '@/themes/docs'
import * as garden from '@/themes/garden'
import * as micro from '@/themes/micro'
import * as minimal from '@/themes/minimal'
import * as paper from '@/themes/paper'
import * as publication from '@/themes/publication'
import * as sue from '@/themes/sue'

const map: Record<string, any> = {
  card,
  garden,
  micro,
  minimal,
  publication,
  docs,
  aside,
  sue,
  paper,
}

export function loadTheme(name = 'sue'): any {
  return map[name] || sue
}
