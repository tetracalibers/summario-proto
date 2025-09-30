import { Accordion, TagsInput } from "@mantine/core"

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
      </Accordion>
      <div>TODO: NetworkGraph</div>
      <div>TODO: MiniView</div>
    </>
  )
}

export default SideRight
