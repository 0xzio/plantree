import * as card from '@/themes/penx-theme-card'
import * as garden from '@/themes/penx-theme-garden'
import * as micro from '@/themes/penx-theme-micro'
import * as minimal from '@/themes/penx-theme-minimal'
import * as photo from '@/themes/penx-theme-photo'
import * as publication from '@/themes/penx-theme-publication'

const map: Record<string, any> = {
  card,
  garden,
  micro,
  minimal,
  photo,
  publication,
}

export function loadTheme(name = 'garden'): any {
  return map[name] || garden
}
