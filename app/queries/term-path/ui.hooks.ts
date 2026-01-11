import { useQuery } from "@tanstack/react-query"
import { termKeys } from "~/query-keys"

export const useTermPath = (termId: number, initials: { id: number; name: string }[]) => {
  const { data, isPending, isError } = useQuery<{ id: number; name: string }[]>({
    queryKey: termKeys.path(termId),
    queryFn: () => fetch(`/api/terms/${termId}/path`).then((res) => res.json()),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    placeholderData: initials
  })

  return { paths: data ?? [], isPending, isError }
}
