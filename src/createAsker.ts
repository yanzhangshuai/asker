import { Asker } from './asker'
import type { AskerOptions } from './type'

export function createAsker(options?: AskerOptions): Asker {
  return new Asker(options)
}
