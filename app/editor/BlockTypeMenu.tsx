import { BLOCKS } from "./blocks"
import { Badge, Card, Group, Stack, Text } from "@mantine/core"

const BlockTypeMenu = () => {
  return (
    <Stack>
      {BLOCKS.map((block) => (
        <Card
          shadow="sm"
          padding="md"
          radius="md"
          withBorder
          draggable
          key={block.name}
          onDragStart={(e) => {
            e.dataTransfer.setData(
              "application/x-block",
              JSON.stringify({ type: block.name, label: block.label })
            )
          }}
        >
          <Group justify="space-between">
            <Text fw={500}>{block.label}</Text>
            <Badge color="pink">{block.label_ja}</Badge>
          </Group>
          <Text size="sm" c="dimmed">
            {block.description}
          </Text>
        </Card>
      ))}
    </Stack>
  )
}

export default BlockTypeMenu
