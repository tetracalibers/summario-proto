import type { JSONContent } from "@tiptap/react"
import { renderToHTMLString } from "@tiptap/static-renderer"
import { useMemo } from "react"
import { tiptapExtensions } from "../editor/extensions"
import { Typography } from "@mantine/core"

interface Props {
  contentJson: JSONContent
}

export default function MiniView({ contentJson }: Props) {
  const output = useMemo(() => {
    return renderToHTMLString({
      content: contentJson,
      extensions: tiptapExtensions
    })
  }, [contentJson])

  return (
    <div
      style={{
        border: "1px solid var(--mantine-color-gray-3)",
        borderRadius: "var(--mantine-radius-default)",
        padding: "0.75rem",
        overflowY: "auto"
      }}
    >
      <Typography style={{ fontSizeAdjust: "0.4", lineHeight: 1.2 }}>
        <div dangerouslySetInnerHTML={{ __html: output }} />
      </Typography>
    </div>
  )
}
