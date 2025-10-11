import type { XYPosition } from "@xyflow/react"
import { useRef, useState, type PropsWithChildren, type RefObject } from "react"
import { useDraggable } from "@neodrag/react"

interface Props {
  className?: string
  nodeType: string
  onDrop: (nodeType: string, position: XYPosition) => void
}

export default function DraggableNode({
  className,
  children,
  nodeType,
  onDrop
}: PropsWithChildren<Props>) {
  const draggableRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<XYPosition>({ x: 0, y: 0 })

  const { dragState } = useDraggable(draggableRef as RefObject<HTMLDivElement>, {
    position: position,
    onDrag: ({ offsetX, offsetY }) => {
      // Calculate position relative to the viewport
      setPosition({ x: offsetX, y: offsetY })
    },
    onDragEnd: () => {
      setPosition({ x: 0, y: 0 })
      // onDropはここで呼ぶのではなく、handlePointerUpで呼ぶ
      // Why?: ここで onDropを呼んでも、フック内部が初回に受け取ったコールバックを保持し続けるので最新の props を参照できない
    }
  })

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    // dragState に最終座標が入っていれば優先的に使う
    const x = dragState?.event?.clientX ?? e.clientX
    const y = dragState?.event?.clientY ?? e.clientY
    // onDrop はここで呼ぶ
    // Why?: React のイベントなら毎レンダーで最新 props を参照できる
    onDrop(nodeType, { x, y })
  }

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  return (
    <div
      className={className}
      ref={draggableRef}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
    >
      {children}
    </div>
  )
}
