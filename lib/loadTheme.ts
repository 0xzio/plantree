import * as card from '@/themes/card'
import * as garden from '@/themes/garden'
import * as micro from '@/themes/micro'
import * as minimal from '@/themes/minimal'
import * as publication from '@/themes/publication'

const map: Record<string, any> = {
  card,
  garden,
  micro,
  minimal,
  publication,
}

export function loadTheme(name = 'garden'): any {
  return map[name] || garden
}
