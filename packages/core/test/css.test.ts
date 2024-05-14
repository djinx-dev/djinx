// css.test.js
import { describe, expect, test } from "vitest"
import { css, fuse, split } from "../src/css"
import { Config } from "../src/config"
import { Atom } from "../src/atoms"


const conf: Config = {
  generators: {
    bg: (k, v) => ({
      background: v,
    }),

    fg: (k, v) => ({
      color: v,
    }),
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

const prop = "bg"
const decls = "blue@md+lg+before+after+hover+focus, red@sm"

describe("split(conf: Config, prop: string, decls: string): [string, string, AtomGen, string[]][]", () => {
  test("Split a prop declaration into its parts", ({ expect }) => {
    expect(split(conf, prop, decls)).toStrictEqual([
      [".bg\\:blue", "blue", conf.generators.bg, ["md", "lg", "before", "after", "hover", "focus"]],
      [".bg\\:red", "red", conf.generators.bg, ["sm"]],
    ])
  })
})


const wrappers = ["@media screen and (min-width: 768px)", "@media screen and (min-width: 1024px)"]
const selectors = [".bg\\:blue:before:hover", ".bg\\:blue:after:hover"]
const propsAtom = {
  background: "blue",
}

describe("fuse(atom: Atom, selectors: string[], wrappers: string[]=[]): Atom | null", () => {
  test("Combine wrappers and selectors, return Atom object", ({ expect }) => {
    expect(
      fuse(propsAtom, selectors, wrappers)
    ).toStrictEqual({
      "@media screen and (min-width: 768px)": {
        "@media screen and (min-width: 1024px)": {
          ".bg\\:blue:before:hover, .bg\\:blue:after:hover": {
            background: "blue",
          }
        }
      }
    })
  })

  test.each([
    [{}, selectors, wrappers],
    [undefined, selectors, wrappers],
    [propsAtom, [], wrappers],
    [propsAtom, undefined, wrappers],
    [{}, [], wrappers],
    [undefined, [], wrappers],
    [{}, undefined, wrappers],
    [undefined, undefined, wrappers],
  ])(`%#. fuse() should return null when missing atom or selectors args`, (a, s, w) => {
    expect(fuse(a, s, w)).null
  })

  test.each([
    [propsAtom, selectors, []],
    [propsAtom, selectors, undefined],
    [propsAtom, selectors, undefined],
  ])(`%#. fuse() the last arg (wrappers) should be optional`, (a, s, w) => {
    expect(fuse(a, s, w)).toStrictEqual({
      ".bg\\:blue:before:hover, .bg\\:blue:after:hover": {
        background: "blue",
      }
    })
  })
})


const sheet: Record<string, Atom | null> = {}

describe("css(conf: Config, sheet: Sheet, styles: Record<string, string>): Sheet", () => {
  test("Take a conf, sheet, and styles and return a Sheet of atoms", ({ expect }) => {
    expect(css(conf, sheet, {
      bg: "blue@md+lg+before+after+hover+focus, red@sm, pink",
    })).toStrictEqual({
      "bg:blue@md+lg+before+after+hover+focus": {
        "@media screen and (min-width: 768px)": {
          "@media screen and (min-width: 1024px)": {
            ".bg\\:blue:hover:focus::before, .bg\\:blue:hover:focus::after": {
              background: "blue",
            },
          },
        },
      },
      "bg:red@sm": {
        "@media screen and (min-width: 320px)": {
          ".bg\\:red": {
            background: "red",
          },
        },
      },
      "bg:pink": {
        ".bg\\:pink": {
          background: "pink",
        },
      },
    })

  })
})
