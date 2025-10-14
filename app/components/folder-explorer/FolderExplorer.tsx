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
import { NavLink } from "react-router"

interface Props {
  initialFolder: Awaited<ReturnType<typeof loader>>
}

export default function FolderExplorer({ initialFolder }: Props) {
  const [folderId, setFolderId] = useState(initialFolder?.current?.id ?? "root")

  const { data } = useQuery<Awaited<ReturnType<typeof loader>>>({
    queryKey: ["folders", "detail", { folderId }],
    queryFn: () => fetch(`/api/folder/${folderId}`).then((res) => res.json()),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    placeholderData: initialFolder
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
              <IconChevronLeft size={16} color="var(--mantine-color-gray-8)" />
              ..
            </UnstyledButton>
          )}
          <div>
            <ActionIcon variant="transparent">
              <IconFolderPlus size={16} color="var(--mantine-color-gray-7)" />
            </ActionIcon>
            <ActionIcon variant="transparent">
              <IconPencilPlus size={16} color="var(--mantine-color-gray-7)" />
            </ActionIcon>
          </div>
        </div>
        <div className={styles.dirname}>
          <IconFolderOpen size={18} color="var(--mantine-color-gray-6)" />
          {data?.current?.name ?? "(root)"}
        </div>
      </div>
      <ul className={styles.list}>
        {data?.entries.map((item) => (
          <li key={`${item.type}-${item.id}`}>
            {item.type === "folder" ? (
              <FolderLink
                onClick={() => {
                  setFolderId(item.id)
                }}
                folderName={item.name}
              />
            ) : (
              <FileLink targetTerm={item} />
            )}
          </li>
        ))}
      </ul>
      <NavLink to="/folder-map" className={styles.folder_map_link} reloadDocument>
        Edit structure...
        <IconExternalLink size={14} color="var(--mantine-color-gray-6)" />
      </NavLink>
    </div>
  )
}
