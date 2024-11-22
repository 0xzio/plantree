import * as card from '@/themes/penx-theme-card'
import * as garden from '@/themes/penx-theme-garden'
import * as micro from '@/themes/penx-theme-micro'
import * as minimal from '@/themes/penx-theme-minimal'
import * as photo from '@/themes/penx-theme-photo'

export function loadTheme(name = 'garden'): any {
  if (name === 'garden') return garden
  if (name === 'card') return card
  if (name === 'micro') return micro
  if (name === 'photo') return photo
  if (name === 'minimal') return minimal
  return garden
}
