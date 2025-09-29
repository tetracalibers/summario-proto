import TipTapEditor from "~/components/editor/Editor"
import styles from "./index.module.css"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"
import FolderTree from "~/components/folder-tree/FolderTree"
import { dummyFolderData, dummySearchKeywords } from "~/db/dummy"
import { Accordion, Autocomplete, Button, Paper, ScrollArea, TagsInput } from "@mantine/core"
import { Split } from "@gfazioli/mantine-split-pane"
import SaveButton from "~/components/term-note/SaveButton"
import { useTiptapEditor } from "~/components/editor/use-tiptap-editor"
import type { Route } from "./+types"
import { getRecentTerm } from "~/query/term"

export async function loader() {
  const [term] = await getRecentTerm(1)
  const editorContent = term.title + "\n" + term.content
  return { term: { ...term, content: editorContent } }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { term } = loaderData
  const editor = useTiptapEditor(term.content)

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Button variant="gradient" gradient={{ from: "gray", to: "cyan", deg: 207 }} radius="sm">
          Cancel
        </Button>
        <Button variant="gradient" gradient={{ from: "pink", to: "red", deg: 90 }} radius="sm">
          Delete
        </Button>
        <SaveButton editor={editor} />
      </header>
      <main className={styles.main}>
        <TipTapEditor editor={editor} />
      </main>
      <div className={styles.side_l}>
        <Autocomplete placeholder="Search by Title or Alias" data={dummySearchKeywords} />
        <Split orientation="horizontal" h="100%" spacing="md">
          <Split.Pane grow minHeight="30%">
            <Paper shadow="xs" withBorder p="1rem" h="100%">
              <FolderTree data={dummyFolderData} />
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
  )
}
