import FileLink from "./FileLink"
import FolderLink from "./FolderLink"
import styles from "./FolderExplorer.module.css"
import { UnstyledButton } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { loader } from "~/routes/api/folder"

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
    <div>
      <div>{data?.current?.name ?? "(root)"}</div>
      {data?.current && !data.current.isRoot && (
        <UnstyledButton
          onClick={() => {
            setFolderId(data.current?.parentId ?? "root")
          }}
        >
          <pre>cd ..</pre>
        </UnstyledButton>
      )}
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
    </div>
  )
}
