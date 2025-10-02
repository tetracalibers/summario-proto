import { TagsInput } from "@mantine/core"
import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { initialAtom, optionsAtom, setUiFromInputAtom, type Term } from "./atoms"

interface Props {
  initials: Term[]
  suggestions: Term[]
}

export default function RelatedInput({ initials, suggestions }: Props) {
  const setUiFromInput = useSetAtom(setUiFromInputAtom)
  const setInitial = useSetAtom(initialAtom)
  const setOptions = useSetAtom(optionsAtom)
  useEffect(() => {
    setInitial(new Map(initials.map((a) => [a.title, a.id])))
    setOptions(new Map(suggestions.map((a) => [a.title, a.id])))
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
