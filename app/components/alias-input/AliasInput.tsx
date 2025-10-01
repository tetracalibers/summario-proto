import { TagsInput } from "@mantine/core"
import { initialAtom, setUiFromInputAtom, type Alias } from "./atoms"
import { useSetAtom } from "jotai"
import { useEffect } from "react"

interface Props {
  alias: Alias[]
}

export default function AliasInput({ alias }: Props) {
  const setUiFromInput = useSetAtom(setUiFromInputAtom)
  const setInitial = useSetAtom(initialAtom)
  useEffect(() => {
    setInitial(new Map(alias.map((a) => [a.title, a.id])))
    setUiFromInput(alias.map((a) => a.title))
  }, [alias, setInitial])

  return (
    <TagsInput
      label="Press Enter to submit a alias"
      placeholder="Enter"
      defaultValue={alias.map((a) => a.title)}
      onChange={(values) => setUiFromInput(values)}
    />
  )
}
