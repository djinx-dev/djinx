import { Config } from "./config"


export type ModifierTypes = ({ "@media": string } | { "@container": string } | { "selector": string } | { "::element": string })

export function modify(conf: Config, selector: string, modifiers: string[]) {
  const selectors: string[] = [selector]
  const wrappers: string[] = []

  for (const k of modifiers) {
    const mod = conf.modifiers[k]

    if (mod == null) {
      continue
    }

    if ("selector" in mod) {
      for (let i = 0; i < selectors.length; i++) {
        selectors[i] = `${selectors[i]}${mod.selector}`
      }
    } else if ("@media" in mod) {
      wrappers.push(`@media ${mod["@media"]}`)
    } else if ("@container" in mod) {
      wrappers.push(`@container ${mod["@container"]}`)
    } else if ("::element" in mod) {
      const last = selectors.pop()!
      selectors.push(`${last}${mod["::element"]}`)
      selectors.push(last)
    }
  }

  return [selectors, wrappers]
}
