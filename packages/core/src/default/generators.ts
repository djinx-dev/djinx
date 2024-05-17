import { Atom, GeneratorsBase } from "src/atoms"


export type GeneratorProps = "bg"
  | "fg"
  | "flow"
  | "wrap"
  | "align"
  | "justify"
  | "pack"
  | "realign"
  | "gap"
  | "put"
  | "w"
  | "h"
  | "p"
  | "m"
  | "b"
  | "r"

export type Generators = GeneratorsBase<GeneratorProps>

export const generators: Generators = {
  bg(k: string, v: string) {
    return { background: v, }
  },

  fg(k: string, v: string) {
    return { color: v, }
  },

  flow(k: string, cv: string) {
    // inline row wrap 16px
    // colr nowrap 1em
    // rowr wrapr 2
    const atom: Atom = {}

    for (const part in cv.split(/\s+/)) {
      switch (part) {
      case "col":
      case "row":
      case "colr":
      case "rowr":
        atom["display"] = cv.startsWith("inline") ? "inline-flex" : "flex"
        atom["flex-direction"] = flowLookup[part]!
        break
      case "wrap":
      case "wrapr":
      case "nowrap":
        atom["flex-wrap"] = flowLookup[part]!
        break
      default:
        const n = defUnits(part)
        n != null && (atom["gap"] = part)
      }
    }

    return atom
  },

  wrap(k: string, v: string) {
    return { wrap: flowLookup[v]!, }
  },

  align(k: string, v: string) {
    return  { "align-items": v, }
  },

  justify(k: string, v: string) {
    return { "justify-items": v, }
  },

  pack(k: string, v: string) {
    return { "align-content": v, }
  },

  realign(k: string, v: string) {
    return  { "align-self": v, }
  },

  gap(k: string, v: string) {
    const n = defUnits(v)
    return { gap: n || "" } as Atom
  },

  // abs positioning
  put(k: string, cv: string) { // inset
    // xse, xs, xe, yse, ys, ye, xc, yc
    // t r b l center

    return {
      position: "absolute",
    }
  },

  w(k: string, cv: string) {
    // w = "16px 8px..32px"
    const vr = cv.split(/\s+/)
    const [val, mm=""] = vr.length > 1 ? vr : vr[0]?.includes("..") ? ["", ...vr] : vr
    const [min, max] = mm.split("..")
    const atom: Atom = {}
    val && (atom[`${lookup[k]}`] = val)
    min && (atom[`min-${lookup[k]}`] = min)
    max && (atom[`max-${lookup[k]}`] = max)
    return atom
  },

  h(k: string, cv: string) {
    return this.w(k, cv)
  },

  p(k: string, cv: string) {
    return {}
  },

  m(k: string, cv: string) {
    return this.p(k, cv)
  },

  b(k: string, cv: string) {
    return {}
  },

  r(k: string, cv: string) {
    return {}
  },
}


// *** Util functions and objects ***

function isEmpty(v: any) {
  return v == null || v == "" || v == "_"
}

function defUnits(v: string) {
  const n = parseFloat(v)

  if (isNaN(n)) {
    return null
    // const path = v.split("-")
    // const color = ctx?.theme.colors?.[path[0]]?.[path[1]]
    // return color == null ? v : color
  }

  return `${n}`.length === v.length ? `${v}rem` : v
}

function join(arr: (string | null | undefined)[], sep="-") {
  return arr.filter((v) => !(v == null || v == "")).join(sep)
}

function zip(keys: string[], vals: string[], tmpl: (dim?: string) => string, ctx?: RuleContext<Theme>) {
  return keys.reduce<Record<string, string>>((a, k, i) => {
    const v = vals[i]
    !isEmpty(v) && (a[tmpl(k)] = defUnits(v, ctx))
    return a
  }, {})
}

const lookup: Record<string, string> = {
  w: "width",
  h: "height",
  p: "padding",
  m: "margin",
  // bw: (dim?: string) => join(["border", dim, "width"]),
  // bc: (dim?: string) => join(["border", dim, "color"]),
  // bs: (dim?: string) => join(["border", dim, "style"]),
  // br: (dim?: string) => join(["border", dim, "radius"]),
  col: "column",
  colr: "column-reverse",
  row: "row",
  rowr: "row-reverse",
}

const flowLookup: Record<string, string> = {
  col: "column",
  colr: "column-reverse",
  row: "row",
  rowr: "row-reverse",
  wrap: "wrap",
  wrapr: "wrap-reverse",
  nowrap: "nowrap",
}
