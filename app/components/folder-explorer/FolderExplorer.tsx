import FileLink from "./FileLink"
import FolderLink from "./FolderLink"
import styles from "./FolderExplorer.module.css"
import { ActionIcon, Button } from "@mantine/core"
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
import { useMovingModeUi } from "~/usecases/folder-explorer/move-to-folder/ui.hooks"
import clsx from "clsx"

interface Props {
  currentTermId: number
  initials: Awaited<ReturnType<typeof loader>>
  pathFolderIds: Set<number>
}

export default function FolderExplorer({ initials, pathFolderIds, currentTermId }: Props) {
  const { showEntryInput, isActiveFileInput, isActiveFolderInput } = useFolderExplorerInputUi()
  const { data, setFolderId } = useFolderExplorerUi(initials)
  const { isMovingMode, cancelMovingMode, selectedCount } = useMovingModeUi()

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.action}>
          {data?.current && !data.current.isRoot && (
            <Button
              aria-label="go to parent folder"
              className={styles.back_button}
              onClick={() => {
                setFolderId(data.current?.parentId ?? "root")
              }}
              variant="transparent"
              color="blue-gray"
              size="compact-xs"
              radius="sm"
              disabled={isMovingMode}
            >
              <IconChevronLeft size={16} />
              ..
            </Button>
          )}
          <div className={styles.new_button}>
            <ActionIcon
              variant="transparent"
              color="blue-gray"
              radius="xl"
              aria-label="new folder"
              onClick={() => showEntryInput("folder")}
              disabled={isActiveFolderInput}
            >
              <IconFolderPlus size={16} />
            </ActionIcon>
            <ActionIcon
              variant="transparent"
              color="blue-gray"
              radius="xl"
              aria-label="new note"
              onClick={() => showEntryInput("file")}
              disabled={isActiveFileInput}
            >
              <IconPencilPlus size={16} />
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
                onLinkClick={() => setFolderId(folder.id)}
                folder={folder}
                folderEntryCount={folder.entry_count}
                isActiveStyle={pathFolderIds.has(folder.id)}
                selectable={isMovingMode}
              />
            </li>
          ))}
          {isActiveFolderInput && <NewEntryNameInput type="folder" />}
          {data?.files.map((file) => (
            <li key={file.id}>
              <FileLink
                targetTerm={file}
                isActive={currentTermId === file.id}
                selectable={isMovingMode}
              />
            </li>
          ))}
          {isActiveFileInput && <NewEntryNameInput type="file" />}
        </ul>
      </ScrollArea>
      <div className={styles.footer}>
        {isMovingMode ? (
          <div className={styles.moving_controls}>
            <div
              className={clsx(
                styles.selected_count,
                selectedCount > 0 && styles.selected_one_or_more
              )}
            >
              {selectedCount}件選択中
            </div>
            <Button
              onClick={cancelMovingMode}
              variant="light"
              color="blue"
              size="compact-xs"
              radius="sm"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Link
            to="/folder-map"
            className={styles.folder_map_link}
            reloadDocument
            target="_blank"
            rel="noopener noreferrer"
          >
            Open MindMap
            <IconExternalLink size={14} color="var(--mantine-color-blue-gray-light-color)" />
          </Link>
        )}
      </div>
    </div>
  )
}
