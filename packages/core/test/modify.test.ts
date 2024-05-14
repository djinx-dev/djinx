// modify.test.js
import { describe, test } from "vitest"
import { Config } from "../src/config"
import { modify } from "../src/modify"


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

describe("modify", () => {
  test("many complex modifiers", ({ expect }) => {
    expect(modify(conf, ".bg\\:blue", ["sm", "md", "before", "after", "child", "checked", "hover"]))
      .toStrictEqual([
        [".bg\\:blue > *:checked:hover::before", ".bg\\:blue > *:checked:hover::after",],
        ["@media screen and (min-width: 320px)", "@media screen and (min-width: 768px)",],
      ])
  })

  test("single modifier", ({ expect }) => {
    expect(modify(conf, ".bg\\:red", ["sm"]))
      .toStrictEqual([
        [".bg\\:red",],
        ["@media screen and (min-width: 320px)",],
      ])
  })
})
