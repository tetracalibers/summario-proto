import { TagsInput } from "@mantine/core"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { serverDataAtom, optionsAtom, type Term, disabledAtom } from "./atoms"
import { uiAtom } from "./atoms"

interface Props {
  initials: Term[]
  suggestions: Term[]
}

export default function RelatedInput({ initials, suggestions }: Props) {
  const disabled = useAtomValue(disabledAtom)

  const setUiFromInput = useSetAtom(uiAtom)
  const setServerData = useSetAtom(serverDataAtom)
  const setOptions = useSetAtom(optionsAtom)

  useEffect(() => {
    setUiFromInput(initials.map((a) => a.title))
  }, [])
  useEffect(() => {
    setServerData(new Map(initials.map((a) => [a.title, a.id])))
    setOptions(new Map(suggestions.map((a) => [a.title, a.id])))
  }, [initials, suggestions])

  return (
    <TagsInput
      label="Related Terms"
      placeholder="Enter"
      defaultValue={initials.map((term) => term.title)}
      data={suggestions.map((term) => term.title)}
      onChange={(values) => setUiFromInput(values)}
      comboboxProps={{ shadow: "sm" }}
      disabled={disabled}
    />
  )
}
