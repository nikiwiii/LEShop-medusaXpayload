"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LivePreviewClient({ serverURL }: { serverURL: string }) {
  const router = useRouter()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin &&
        event.origin !== serverURL
      ) {
        return
      }

      if (typeof event.data !== "object" || event.data === null) {
        return
      }

      const { type } = event.data
      if (type === "payload-live-preview") {
        // Debounce router.refresh() to prevent hitting the server too frequently during typing
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          router.refresh()
        }, 150)
      }
    }

    window.addEventListener("message", handleMessage)
    // Send a message to Payload CMS that the live preview iframe is ready to receive messages
    window.parent.postMessage({ type: "payload-live-preview-ready" }, "*")

    // SAME-ORIGIN BONUS: Attach a click listener to Payload's Save button in the parent window
    // to automatically trigger a full iframe reload and clear Next.js route cache when saved.
    const findAndAttachSaveListener = () => {
      try {
        if (!window.parent || window.parent === window) return

        const parentDoc = window.parent.document
        if (!parentDoc) return

        const buttons = Array.from(parentDoc.querySelectorAll("button"))
        const saveBtn = buttons.find(
          (btn) =>
            btn.textContent?.toLowerCase().includes("save") ||
            btn.textContent?.toLowerCase().includes("zapisz") ||
            btn.classList.contains("form-submit")
        )

        if (saveBtn) {
          console.log("Found parent Save button, attaching click listener...")

          const handleSaveClick = () => {
            console.log("Save button clicked, scheduled iframe reload...")
            // 1000ms delay is perfect to allow backend database writes and cache revalidation to complete
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          }

          saveBtn.addEventListener("click", handleSaveClick)
          return true // Found and attached successfully
        }
      } catch (err) {
        console.warn(
          "Could not access parent window document for Save button:",
          err
        )
      }
      return false
    }

    // Try immediately
    let attached = findAndAttachSaveListener()

    // If not found yet (due to async rendering of parent DOM), retry every 500ms up to 10 times
    let intervalId: NodeJS.Timeout | null = null
    if (!attached) {
      let retries = 0
      intervalId = setInterval(() => {
        retries++
        if (findAndAttachSaveListener() || retries >= 10) {
          if (intervalId) clearInterval(intervalId)
        }
      }, 500)
    }

    return () => {
      window.removeEventListener("message", handleMessage)
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [router, serverURL])

  return null
}
