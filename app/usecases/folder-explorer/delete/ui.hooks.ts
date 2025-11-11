import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { FolderMutationSuccess } from "../types"
import { ActionError } from "~/libs/error"
import { folderKeys } from "~/query-keys"
import { useAtomValue } from "jotai"
import { folderIdforDB$ } from "../ui.selectors"

interface DeleteFolderParams {
  id: number
  name: string
}

export const useEmptyFolderDeleteUi = () => {
  const queryClient = useQueryClient()

  const parentId = useAtomValue(folderIdforDB$)

  const { mutate, isPending } = useMutation<FolderMutationSuccess, ActionError, DeleteFolderParams>(
    {
      mutationFn: ({ id, name }) =>
        fetch(`/api/folders/${id}/delete`, { method: "DELETE" }).then(async (res) => {
          const data = await res.json()
          if (!res.ok)
            throw new ActionError("Failed to delete the folder.", {
              ...data,
              message: data.message + ": " + name
            })
          return data
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: folderKeys.children(`${parentId}`) })
      }
    }
  )

  return { deleteFolder: mutate, isDeleting: isPending }
}
