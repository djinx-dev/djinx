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
    !isEmpty(val) && (atom[`${lookup[k]}`] = defUnits(val))
    !isEmpty(min) && (atom[`min-${lookup[k]}`] = defUnits(min))
    !isEmpty(max) && (atom[`max-${lookup[k]}`] = defUnits(max))
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
    return pmbr(k, cv)
  },

  m(k: string, cv: string) {
    return pmbr(k, cv)
  },

  bw(k: string, cv: string) {
    return pmbr(k, cv, "width")
  },

  bc(k: string, cv: string) {
    return pmbr(k, cv, "color")
  },

  bs(k: string, cv: string) {
    return pmbr(k, cv, "style")
  },

  r(k: string, cv: string) {
    return pmbr(k, cv, "radius")
  },

  s(k: string, cv: string) {
    return {}
  },
}


// *** Util functions and objects ***

function pmbr (k: string, cv: string, suffix="") {
  const prop = lookup[k]!
  let vals = cv.split(/\s+/) as (string | undefined)[]
  const tail = vals[vals.length - 1]
  let mode =  tail === "rel" || tail === "fix" ? vals.pop() : "fix"
  const atom: Atom = {}
  mode = suffix === "radius" ? `${mode}-${suffix}` : mode
  suffix = suffix ? `-${suffix}` : ""

  switch (vals.length) {
  case 1:
    vals = [vals[0], undefined, vals[0], undefined]
    break
  case 2:
    vals = [vals[0], vals[1], vals[0], vals[1]]
    break
  }

  if (vals.length == 4) {
    !isEmpty(vals[0]) && (atom[`${prop}-${pmbrMap[`a-${mode}`]}${suffix}`] = defUnits(vals[0]) || "")
    !isEmpty(vals[1]) && (atom[`${prop}-${pmbrMap[`b-${mode}`]}${suffix}`] = defUnits(vals[1]) || "")
    !isEmpty(vals[2]) && (atom[`${prop}-${pmbrMap[`c-${mode}`]}${suffix}`] = defUnits(vals[2]) || "")
    !isEmpty(vals[3]) && (atom[`${prop}-${pmbrMap[`d-${mode}`]}${suffix}`] = defUnits(vals[3]) || "")
  }

  return atom
}

const pmbrMap = {
  "a-fix": "top",
  "b-fix": "right",
  "c-fix": "bottom",
  "d-fix": "left",
  "a-rel": "block-start",
  "b-rel": "inline-end",
  "c-rel": "block-end",
  "d-rel": "inline-start",
  "a-fix-radius": "top-left",
  "b-fix-radius": "top-right",
  "c-fix-radius": "bottom-right",
  "d-fix-radius": "bottom-left",
  "a-rel-radius": "start-start",
  "b-rel-radius": "start-end",
  "c-rel-radius": "end-end",
  "d-rel-radius": "end-start",
}

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
  bw: "border",
  bc: "border",
  bs: "border",
  br: "border",
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
