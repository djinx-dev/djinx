import { AtomGen, GeneratorsBase } from "./atoms"
import { ModifierTypes, ModifiersBase } from "./modify"


export type Config<G extends string, M extends string> = {
  // preflight: Sheet,
  // themes: {
  //   any: Theme,
  // },
  generators: GeneratorsBase<G>,
  modifiers: ModifiersBase<M>,
}
