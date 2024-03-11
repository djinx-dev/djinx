import { describe, expect, test } from "vitest"
import { djinxPlugin } from "../src/main"
import { FetchEvent } from "@solidjs/start/server"


describe("djinxPlugin(event: FetchEvent)", () => {
  test("Check that locals is populated", async ({ expect }) => {
    const event = { locals: {} } as FetchEvent
    await djinxPlugin(event)
    expect(event).toStrictEqual({
      locals: {
        djinx: {
          conf: {},
          sheet: {},
        },
      },
    })
  })
})
