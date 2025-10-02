import { TagsInput } from "@mantine/core"
import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { initialAtom, setUiFromInputAtom } from "./atoms"

interface Props {
  initials: { id: number; title: string }[]
  suggestions: { id: number; title: string }[]
}

export default function RelatedInput({ initials, suggestions }: Props) {
  const setUiFromInput = useSetAtom(setUiFromInputAtom)
  const setInitial = useSetAtom(initialAtom)
  useEffect(() => {
    setInitial(new Map(initials.map((a) => [a.title, a.id])))
    setUiFromInput(initials.map((a) => a.title))
  }, [initials, setInitial])

  return (
    <TagsInput
      label="Related Terms"
      placeholder="Enter"
      defaultValue={initials.map((term) => term.title)}
      data={suggestions.map((term) => term.title)}
      onChange={(values) => setUiFromInput(values)}
      comboboxProps={{ shadow: "sm" }}
    />
  )
}
