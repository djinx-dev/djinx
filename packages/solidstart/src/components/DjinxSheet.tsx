import { getRequestEvent } from "solid-js/web"


export default function DjinxSheet() {
  const event = getRequestEvent()
  const djinx = JSON.stringify(event?.locals?.djinx || {})

  return (
    <>
      <script id="__djinx-script">
        {`
        console.log("djinxed");
        globalThis[Symbol.for("djinx")] = ${djinx};
        `}
      </script>
      <style id="__djinx-style">
        // djinxed
      </style>
    </>
  )
}
