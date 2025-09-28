import TipTapEditor from "~/components/editor/Editor"
import styles from "./index.module.css"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"
import FolderTree from "~/components/folder-tree/FolderTree"
import { folderTreeDummyData } from "~/dummy/folder-tree-data"
import TiptapProvider from "~/components/editor/TiptapProvider"
import { Accordion, Autocomplete, Button, Paper, ScrollArea, TagsInput } from "@mantine/core"
import { Split } from "@gfazioli/mantine-split-pane"

export default function Index() {
  return (
    <TiptapProvider>
      <div className={styles.root}>
        <header className={styles.header}>
          <Button variant="gradient" gradient={{ from: "gray", to: "cyan", deg: 207 }} radius="sm">
            Cancel
          </Button>
          <Button variant="gradient" gradient={{ from: "pink", to: "red", deg: 90 }} radius="sm">
            Delete
          </Button>
          <Button
            variant="gradient"
            gradient={{ from: "grape", to: "indigo", deg: 90 }}
            radius="sm"
            className={styles.save_btn}
          >
            Save
          </Button>
        </header>
        <main className={styles.main}>
          <TipTapEditor />
        </main>
        <div className={styles.side_l}>
          <Autocomplete
            placeholder="Search by Title or Alias"
            data={["React", "Angular", "Vue", "Svelte"]}
          />
          <Split orientation="horizontal" h="100%" spacing="md">
            <Split.Pane grow minHeight="30%">
              <Paper shadow="xs" withBorder p="1rem" h="100%">
                <FolderTree data={folderTreeDummyData} />
              </Paper>
            </Split.Pane>
            <Split.Resizer />
            <Split.Pane px={"1rem"} minHeight="20%">
              <pre>Network Graph</pre>
            </Split.Pane>
          </Split>
        </div>
        <div className={styles.side_r}>
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
        </div>
      </div>
    </TiptapProvider>
  )
}
