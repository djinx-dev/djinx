import { Atom, AtomGen } from "./atoms"
import { Config } from "./config"
import { modify } from "./modify"
import { cssEscape } from "./utils"


export function css<G extends string, M extends string>(conf: Config<G, M>, sheet: Record<string, Atom | null>, styles: Record<G, string>) {
  for (const [prop, decls] of Object.entries<string>(styles)) {
    for (const [selector, value, atomGen, modifiers] of split(conf, prop as G, decls)){
      if (!value || atomGen == null) {
        continue
      }

      const key = `${prop}:${value}${modifiers.length > 0 ? "@" : ""}${modifiers.join("+")}`

      // if this selector already exists, skip
      if (Object.hasOwn(sheet, key)) {
        continue
      }

      const [selectors, wrappers] = modify(conf, selector, modifiers)
      const atom = fuse(atomGen(prop, value), selectors, wrappers)

      sheet[key] = atom
    }
  }

  return sheet
}

export function split<G extends string, M extends string>(conf: Config<G, M>, prop: G, decls: string): [string, string, AtomGen | undefined, M[]][] {
  return decls.trim().split(/\s*;+\s*/).map((decl) => {
    const [value="", modifiers] = decl.split(/\s*@\s*/)
    const selector = "." + cssEscape(`${prop}:${value}`)
    const atomGen = conf.generators[prop]

    return [selector, value, atomGen, (modifiers?.split(/\s*\+\s*/) || []) as M[]]
  })
}

export function fuse(atom: Atom, selectors: string[], wrappers: string[]=[]) {
  if (atom == null || Object.keys(atom).length === 0) {
    return null
  }

  if (selectors == null || selectors.length === 0) {
    return null
  }

  atom = {
    [selectors.join(", ")]: atom,
  }

  for (let i = wrappers.length - 1; i >= 0; i--) {
    atom = {
      [wrappers[i]!]: atom,
    }
  }

  return atom
}
