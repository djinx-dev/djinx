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
  | "bw"
  | "bc"
  | "bs"
  | "r"
  | "s"

export type Generators = GeneratorsBase<GeneratorProps>

export const generators: Generators = {
  // background
  bg(k: string, v: string) {
    return { background: v, fill: v, }
  },

  // // midground
  // mg(k: string, v: string) {
  //   // fg // currentColor
  //   // #000
  //   // #000 #000
  //   // #000 _ #000 _
  //   return { "border-color": v, stroke: v, }
  // },

  // foreground
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
    // 2 _ 2 2
    // 2 2 2 2 rel
    // 2 2 fix
    // 2

    const prop = lookup[k]!
    const vals = cv.split(/\s+/)
    const ort = vals[vals.length - 1] === "rel" ? vals.pop()
    return pmbr(prop, vals)
  },

  m(k: string, cv: string) {
    const prop = lookup[k]!
    const vals = cv.split(/\s+/)
    return pmbr(prop, vals)
  },

  bw(k: string, cv: string) {
    const prop = lookup[k]!
    const vals = cv.split(/\s+/)
    return pmbr(prop, vals, "width")
  },

  bc(k: string, cv: string) {
    const prop = lookup[k]!
    const vals = cv.split(/\s+/)
    return pmbr(prop, vals, "color")
  },

  bs(k: string, cv: string) {
    const prop = lookup[k]!
    const vals = cv.split(/\s+/)
    return pmbr(prop, vals, "style")
  },

  r(k: string, cv: string) {
    const prop = lookup[k]!
    const vals = cv.split(/\s+/)
    return pmbr(prop, vals, "radius")
  },

  s(k: string, cv: string) {
    return {}
  },
}

function pmbr (prop: string, vals: string[], suffix="") {
  const atom: Atom = {}
  suffix = suffix ? `-${suffix}` : ""

  switch (vals.length) {
  case 1:
    !isEmpty(vals[0]) && (atom[prop] = defUnits(vals[0]) || "")
    break
  case 2:
    !isEmpty(vals[0]) && (atom[`${prop}-inline${suffix}`] = defUnits(vals[0]) || "")
    !isEmpty(vals[1]) && (atom[`${prop}-block${suffix}`] = defUnits(vals[1]) || "")
    break
  case 4:
    !isEmpty(vals[0]) && (atom[`${prop}-block-start${suffix}`] = defUnits(vals[0]) || "")
    !isEmpty(vals[1]) && (atom[`${prop}-inline-end${suffix}`] = defUnits(vals[1]) || "")
    !isEmpty(vals[2]) && (atom[`${prop}-block-end${suffix}`] = defUnits(vals[2]) || "")
    !isEmpty(vals[3]) && (atom[`${prop}-inline-start${suffix}`] = defUnits(vals[3]) || "")
    break
  }

  return atom
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
