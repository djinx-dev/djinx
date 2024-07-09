import { Atom } from "./atoms"
import { Config } from "./config"


export const defaultConf: Config = {
  generators: {
    bg: (k, v) => ({
      background: v,
    }),

    fg: (k, v) => ({
      color: v,
    }),

    flow: (k, cv) => {
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

    wrap: (k, v) => ({
      wrap: flowLookup[v]!,
    }),

    align: (k, v) => ({
      "align-items": v,
    }),

    justify: (k, v) => ({
      "justify-items": v,
    }),

    spread: (k, v) => ({
      "justify-content": v,
    }),

    gap(k, v) {
      const n = defUnits(v)
      return { gap: n || "" } as Atom
    },

    w: genDim,

    h: genDim,
  },

  modifiers: {
    sm: { "@media": "screen and (min-width: 320px)" },
    md: { "@media": "screen and (min-width: 768px)" },
    lg: { "@media": "screen and (min-width: 1024px)" },
    hover: { selector: ':hover' },
    focus: { selector: ':focus' },
    checked: { selector: ':checked' },
    child: { selector: ' > *' },
    before: { "::element": "::before"},
    after: { "::element": "::after"},
  },
}

function genDim (k: string, cv: string) {
  // w = "16px 8px..32px"
  const vr = cv.split(/\s+/)
  const [val, mm=""] = vr.length > 1 ? vr : vr[0]?.includes("..") ? ["", ...vr] : vr
  const [min, max] = mm.split("..")
  const atom: Atom = {}
  val && (atom[`${lookup[k]}`] = val)
  min && (atom[`min-${lookup[k]}`] = min)
  max && (atom[`max-${lookup[k]}`] = max)
  return atom
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
