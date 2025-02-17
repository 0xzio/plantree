import * as card from './card';
import * as garden from './garden';
import * as micro from './micro';
import * as minimal from './minimal';
import * as publication from './publication';
export const themes = ["card", "garden", "micro", "minimal", "publication"]
const map: Record<string, any> = {"card": card, "garden": garden, "micro": micro, "minimal": minimal, "publication": publication}

export function loadTheme(name = 'garden'): any {
  return map[name] || garden;
}