import FileLink from "./FileLink"
import FolderLink from "./FolderLink"
import styles from "./FolderExplorer.module.css"
import { ActionIcon, UnstyledButton } from "@mantine/core"
import {
  IconChevronLeft,
  IconFolderOpen,
  IconFolderPlus,
  IconPencilPlus,
  IconExternalLink
} from "@tabler/icons-react"
import { Link } from "react-router"
import ScrollArea from "../scroll-area/ScrollArea"
import { useFolderExplorerUi } from "~/usecases/folder-explorer/ui.hooks"
import type { loader } from "~/routes/api/folders/children"
import { useFolderExplorerInputUi } from "~/usecases/folder-explorer/input/ui.hooks"
import NewEntryNameInput from "./NewEntryNameInput"

interface Props {
  currentTermId: number
  initials: Awaited<ReturnType<typeof loader>>
  pathFolderIds: Set<number>
}

export default function FolderExplorer({ initials, pathFolderIds, currentTermId }: Props) {
  const { showEntryInput, isActiveFileInput, isActiveFolderInput } = useFolderExplorerInputUi()

  const { data, setFolderId } = useFolderExplorerUi(initials)

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.action}>
          {data?.current && !data.current.isRoot && (
            <UnstyledButton
              className={styles.back_button}
              onClick={() => {
                setFolderId(data.current?.parentId ?? "root")
              }}
            >
              <IconChevronLeft size={16} color="var(--mantine-color-gray-7)" />
              ..
            </UnstyledButton>
          )}
          <div className={styles.new_button}>
            <ActionIcon
              variant="transparent"
              radius="xl"
              aria-label="new folder"
              onClick={() => showEntryInput("folder")}
              disabled={isActiveFolderInput}
            >
              <IconFolderPlus size={16} color="var(--mantine-color-gray-7)" />
            </ActionIcon>
            <ActionIcon
              variant="transparent"
              radius="xl"
              aria-label="new note"
              onClick={() => showEntryInput("file")}
              disabled={isActiveFileInput}
            >
              <IconPencilPlus size={16} color="var(--mantine-color-gray-7)" />
            </ActionIcon>
          </div>
        </div>
        <div className={styles.dirname}>
          <IconFolderOpen size={18} color="var(--mantine-color-gray-6)" />
          {data?.current?.name ?? <pre>(No Folder)</pre>}
        </div>
      </div>
      <ScrollArea h="100%" className={styles.scroll_shadows}>
        <ul className={styles.list}>
          {data?.folders.map((folder) => (
            <li key={folder.id}>
              <FolderLink
                onClick={() => {
                  setFolderId(folder.id)
                }}
                folderName={folder.name}
                isActiveStyle={pathFolderIds.has(folder.id)}
                entryCount={folder.entry_count}
              />
            </li>
          ))}
          {isActiveFolderInput && <NewEntryNameInput type="folder" />}
          {data?.files.map((file) => (
            <li key={file.id}>
              <FileLink targetTerm={file} isActive={currentTermId === file.id} />
            </li>
          ))}
          {isActiveFileInput && <NewEntryNameInput type="file" />}
        </ul>
      </ScrollArea>
      <Link
        to="/folder-map"
        className={styles.folder_map_link}
        reloadDocument
        target="_blank"
        rel="noopener noreferrer"
      >
        Edit structure
        <IconExternalLink size={14} color="var(--mantine-color-gray-7)" />
      </Link>
    </div>
  )
}
