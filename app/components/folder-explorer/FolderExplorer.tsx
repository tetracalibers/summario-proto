import FileLink from "./FileLink"
import FolderLink from "./FolderLink"

interface Props {
  currentTermId: string
  items: {
    id: number | string
    name: string
    fullPath: string
    parentId: number | null
    type: "folder" | "file"
  }[]
}

export default function FolderExplorer({ currentTermId, items }: Props) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item) => (
        <li key={item.id}>
          {item.type === "folder" ? (
            <FolderLink currentTermId={currentTermId} folderId={item.id} folderName={item.name} />
          ) : (
            <FileLink targetTerm={item} />
          )}
        </li>
      ))}
    </ul>
  )
}
