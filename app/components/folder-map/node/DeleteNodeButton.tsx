import { ActionIcon } from "@mantine/core"
import { IconTrash } from "@tabler/icons-react"
import { useReactFlow } from "@xyflow/react"
import { useCallback } from "react"

interface Props {
  id: string
}

export default function DeleteNodeButton({ id }: Props) {
  const { setNodes } = useReactFlow()

  const handleClick = useCallback(() => {
    setNodes((nds) => nds.filter((n) => n.id !== id))
  }, [id, setNodes])

  return (
    <ActionIcon variant="light" color="pink" aria-label="delete node" onClick={handleClick}>
      <IconTrash size={18} />
    </ActionIcon>
  )
}
