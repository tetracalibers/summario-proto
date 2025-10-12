import type { XYPosition } from "@xyflow/react"

export const isInMapArea = (screenPosition: XYPosition) => {
  const flow = document.querySelector(".react-flow")
  if (!flow) return false

  const flowRect = flow.getBoundingClientRect()
  if (!flowRect) return false

  return (
    screenPosition.x >= flowRect.left &&
    screenPosition.x <= flowRect.right &&
    screenPosition.y >= flowRect.top &&
    screenPosition.y <= flowRect.bottom
  )
}
