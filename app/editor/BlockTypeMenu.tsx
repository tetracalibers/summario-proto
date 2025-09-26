import { BLOCKS } from "./blocks"
import { Badge, Card, Group, Stack, Text } from "@mantine/core"
import { useAtomValue } from "jotai"
import { usedBlockTypesAtom } from "./atoms"
import { IconCheck } from "@tabler/icons-react"

const BlockTypeMenu = () => {
  const usedBlockTypes = useAtomValue(usedBlockTypesAtom)
  const usedTypesSet = new Set(usedBlockTypes)

  const usedBlocksInOrder = usedBlockTypes
    .map((type) => BLOCKS.find((b) => b.name === type))
    .filter((b) => b !== undefined)

  const unusedBlocks = BLOCKS.filter((block) => !usedTypesSet.has(block.name))

  const allBlocksToRender = [...usedBlocksInOrder, ...unusedBlocks]

  return (
    <Stack>
      {allBlocksToRender.map((block) => {
        if (!block) return null
        const isUsed = usedTypesSet.has(block.name)

        return (
          <Card
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
            draggable={!isUsed}
            key={block.name}
            onDragStart={(e) => {
              if (isUsed) {
                e.preventDefault()
                return
              }
              e.dataTransfer.setData(
                "application/x-block",
                JSON.stringify({ type: block.name, label: block.label })
              )
            }}
            style={{ opacity: isUsed ? 0.6 : 1, cursor: isUsed ? "not-allowed" : "grab" }}
          >
            <Group justify="space-between">
              <Text fw={500}>{block.label}</Text>
              <Group gap="xs">
                {isUsed && <IconCheck size={16} />}
                <Badge color="pink">{block.label_ja}</Badge>
              </Group>
            </Group>
            <Text size="sm" c="dimmed">
              {block.description}
            </Text>
          </Card>
        )
      })}
    </Stack>
  )
}

export default BlockTypeMenu
