import { Config } from "./config"


export type ModifierTypes = ({ "@media": string } | { "@container": string } | { "selector": string } | { "::element": string })

export function modify(conf: Config, selector: string, modifiers: string[]): [string[], string[]] {
  const selectors: string[] = [selector]
  const wrappers: string[] = []
  const elements: string[] = []

  for (const k of modifiers) {
    const mod = conf.modifiers[k]

    if (mod == null) {
      continue
    }

    if ("selector" in mod) {
      selectors.push(mod.selector)
    } else if ("@media" in mod) {
      wrappers.push(`@media ${mod["@media"]}`)
    } else if ("@container" in mod) {
      wrappers.push(`@container ${mod["@container"]}`)
    } else if ("::element" in mod) {
      elements.push(mod["::element"])
    }
  }

  const compSelector = selectors.join("")
  const selectorList = elements.length === 0 ? [compSelector] : elements.map((elm) => `${compSelector}${elm}`)

  return [selectorList, wrappers]
}

export type ModifiersBase<P extends string> = {
  [p in P]: ModifierTypes
}
