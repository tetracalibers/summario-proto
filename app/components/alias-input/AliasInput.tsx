import { TagsInput } from "@mantine/core"
import { initialAtom, setUiFromInputAtom, type Alias } from "./atoms"
import { useSetAtom } from "jotai"
import { useEffect } from "react"

interface Props {
  initials: Alias[]
}

export default function AliasInput({ initials }: Props) {
  const setUiFromInput = useSetAtom(setUiFromInputAtom)
  const setInitial = useSetAtom(initialAtom)
  useEffect(() => {
    setInitial(new Map(initials.map((a) => [a.title, a.id])))
    setUiFromInput(initials.map((a) => a.title))
  }, [initials, setInitial])

  return (
    <TagsInput
      label="Alias"
      placeholder="Enter"
      defaultValue={initials.map((a) => a.title)}
      onChange={(values) => setUiFromInput(values)}
    />
  )
}
