import { Accordion, ScrollArea, TagsInput } from "@mantine/core"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"

const SideRight = () => {
  return (
    <>
      <Accordion variant="contained" multiple defaultValue={["alias"]}>
        <Accordion.Item value="alias">
          <Accordion.Control>エイリアスの設定</Accordion.Control>
          <Accordion.Panel>
            <TagsInput
              label="Press Enter to submit a alias"
              placeholder="Type and press enter..."
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="related">
          <Accordion.Control>関連用語の設定</Accordion.Control>
          <Accordion.Panel>Related Input</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="references">
          <Accordion.Control>参考文献の設定</Accordion.Control>
          <Accordion.Panel>References Input</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <ScrollArea h="100%" pr="1rem">
        <BlockTypeMenu />
      </ScrollArea>
    </>
  )
}

export default SideRight
