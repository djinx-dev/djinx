import { ModifiersBase } from "src/modify"


export type ModifierProps = "sm"
  | "md"
  | "lg"
  | "hover"
  | "focus"
  | "checked"
  | "child"
  | "before"
  | "after"

export type Modifiers = ModifiersBase<ModifierProps>

export const modifiers: Modifiers = {
  sm: { "@media": "screen and (min-width: 320px)" },
  md: { "@media": "screen and (min-width: 768px)" },
  lg: { "@media": "screen and (min-width: 1024px)" },
  hover: { selector: ':hover' },
  focus: { selector: ':focus' },
  checked: { selector: ':checked' },
  child: { selector: ' > *' },
  before: { "::element": "::before"},
  after: { "::element": "::after"},
}
