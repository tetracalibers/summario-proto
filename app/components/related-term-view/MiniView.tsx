import { Typography } from "@mantine/core"

interface Props {
  contentHTML: string
}

export default function MiniView({ contentHTML }: Props) {
  return (
    <Typography style={{ fontSizeAdjust: "0.4", lineHeight: 1.2 }}>
      <div dangerouslySetInnerHTML={{ __html: contentHTML }} className="tiptap-static" />
    </Typography>
  )
}
