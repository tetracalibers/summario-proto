import { TagsInput } from "@mantine/core"
import { disabledAtom, serverDataAtom, uiAtom, type Alias } from "./atoms"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"

interface Props {
  initials: Alias[]
}

export default function AliasInput({ initials }: Props) {
  const disabled = useAtomValue(disabledAtom)

  const setUiFromInput = useSetAtom(uiAtom)
  const setServerData = useSetAtom(serverDataAtom)

  useEffect(() => {
    setUiFromInput(initials.map((a) => a.title))
  }, [])
  useEffect(() => {
    setServerData(new Map(initials.map((a) => [a.title, a.id])))
  }, [initials])

  return (
    <TagsInput
      label="Alias"
      placeholder="Enter"
      defaultValue={initials.map((a) => a.title)}
      onChange={(values) => setUiFromInput(values)}
      disabled={disabled}
    />
  )
}
