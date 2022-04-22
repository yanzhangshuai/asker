import { Asker } from "./asker";
import { AskerOptions } from "./type";

export function createAsker(options?: AskerOptions): Asker {
  return new Asker(options);
}