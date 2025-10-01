import { Box, type BoxComponentProps } from "@mantine/core"
import type { PropsWithChildren } from "react"
import style from "./style.module.css"

interface Props extends BoxComponentProps {}

export default function ScrollArea({ children, ...props }: PropsWithChildren<Props>) {
  return (
    <Box className={style.scrollable} {...props}>
      {children}
    </Box>
  )
}
