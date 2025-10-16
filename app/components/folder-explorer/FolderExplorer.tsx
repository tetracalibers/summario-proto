import FileLink from "./FileLink"
import FolderLink from "./FolderLink"
import styles from "./FolderExplorer.module.css"
import { ActionIcon, UnstyledButton } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { loader } from "~/routes/api/folder"
import {
  IconChevronLeft,
  IconFolderOpen,
  IconFolderPlus,
  IconPencilPlus,
  IconExternalLink
} from "@tabler/icons-react"
import { Link } from "react-router"
import ScrollArea from "../scroll-area/ScrollArea"
import { useAtom } from "jotai"
import { displayedEntryInputTypeAtom } from "./atoms"
import NewFolderInput from "./NewFolderInput"
import NewFileInput from "./NewFileInput"

interface Props {
  currentTermId: number
  initials: Awaited<ReturnType<typeof loader>>
  pathFolderIds: Set<number>
}

export default function FolderExplorer({ initials, pathFolderIds, currentTermId }: Props) {
  const [folderId, setFolderId] = useState(initials?.current?.id ?? "root")

  const [displayedEntryInputType, showEntryInput] = useAtom(displayedEntryInputTypeAtom)

  const { data } = useQuery<Awaited<ReturnType<typeof loader>>>({
    queryKey: ["folders", "detail", { folderId }],
    queryFn: () => fetch(`/api/folder/${folderId}`).then((res) => res.json()),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    placeholderData: initials
  })

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
              disabled={displayedEntryInputType === "folder"}
            >
              <IconFolderPlus size={16} color="var(--mantine-color-gray-7)" />
            </ActionIcon>
            <ActionIcon
              variant="transparent"
              radius="xl"
              aria-label="new note"
              onClick={() => showEntryInput("file")}
              disabled={displayedEntryInputType === "file"}
            >
              <IconPencilPlus size={16} color="var(--mantine-color-gray-7)" />
            </ActionIcon>
          </div>
        </div>
        <div className={styles.dirname}>
          <IconFolderOpen size={18} color="var(--mantine-color-gray-6)" />
          {data?.current?.name ?? "(root)"}
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
                isEmpty={folder.is_empty}
              />
            </li>
          ))}
          {displayedEntryInputType === "folder" && <NewFolderInput />}
          {data?.files.map((file) => (
            <li key={file.id}>
              <FileLink targetTerm={file} isActive={currentTermId === file.id} />
            </li>
          ))}
          {displayedEntryInputType === "file" && <NewFileInput />}
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
