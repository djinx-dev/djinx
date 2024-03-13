import { FetchEvent } from "@solidjs/start/server"
import { getRequestEvent, isServer } from "solid-js/web"
import { splitProps } from "solid-js"
import { Sheet, Config, css as _css } from "@djinx/core"
export { default as DjinxSheet } from "./components/DjinxSheet"


export function createCssFn(conf: Config) {
  const genKeys = Object.keys(conf.generators)

  return function css(styles: Record<string, string>) {
    const sheet = getSheet()
    const [gens, others] = splitProps(styles, genKeys)

    _css(conf, sheet, gens)
    return others
  }
}

export function getSheet() {
  if (isServer) {
    const req = getRequestEvent()!
    // @ts-ignore
    return req.locals.djinx.sheet as Sheet
  }

  // @ts-ignore
  return globalThis[Symbol.for("djinx")].sheet as Sheet
}

export async function djinxPlugin(event: FetchEvent) {
  event.locals["djinx"] = {
    conf: {},
    sheet: {},
  } as { conf: Config, sheet: Sheet, }
}
