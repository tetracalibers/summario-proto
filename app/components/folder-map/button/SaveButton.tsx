import { Button } from "@mantine/core"

export default function SaveButton() {
  return (
    <Button
      variant="gradient"
      gradient={{ from: "grape", to: "indigo", deg: 90 }}
      radius="sm"
      style={{ display: "grid", width: "100%" }}
    >
      Save
    </Button>
  )
}
