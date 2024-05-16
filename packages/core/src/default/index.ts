import { Config } from "src/config"
import { GeneratorProps, generators } from "./generators"
import { ModifierProps, modifiers } from "./modifiers"


export default {
  generators,
  modifiers,
} as Config<GeneratorProps, ModifierProps>
