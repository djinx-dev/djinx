import { FetchEvent } from "@solidjs/start/server"
import { getRequestEvent, isServer } from "solid-js/web"
import { Sheet, Config } from "@djinx/core"


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
