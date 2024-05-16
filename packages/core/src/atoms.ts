export type Atom = {
  [key: string]: string | Atom
}

export type AtomGen = (k: string, v: string) => Atom

export type Sheet = {
  [key: string]: Atom
}

export function stringifyAtom(atom: Atom, tab="  ", tabDepth=0) {
  const result = ["{"]
  const pad = "".padEnd(tabDepth + 1, tab)

  for (const [k, v] of Object.entries(atom)) {
    if (typeof v !== "string") {
      result.push(`${pad}${k}: ${stringifyAtom(v, tab, tabDepth + 1)}`)
    } else {
      result.push(`${pad}${k}: ${v};`)
    }
  }

  result.push(`${"".padEnd(tabDepth, tab)}}`)
  return result.join("\n")
}

export class GeneratorsBase {}
