import { AtomGen } from "./atoms"
import { ModifierTypes } from "./modify"


export type Config = {
  // preflight: Sheet,
  // themes: {
  //   any: Theme,
  // },
  generators: Record<string, AtomGen>,
  modifiers: Record<string, ModifierTypes>
}
