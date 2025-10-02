import { TagsInput } from "@mantine/core"
import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { initialAtom, optionsAtom, setUiFromInputAtom } from "./atoms"

interface Props {
  initials: { id: number; title: string }[]
  suggestions: { id: number; title: string }[]
}

export default function RelatedInput({ initials, suggestions }: Props) {
  const setUiFromInput = useSetAtom(setUiFromInputAtom)
  const setInitial = useSetAtom(initialAtom)
  const setOptions = useSetAtom(optionsAtom)
  useEffect(() => {
    setInitial(initials)
    setOptions(suggestions)
    setUiFromInput(initials.map((a) => a.title))
  }, [])

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
