import { Box, type BoxComponentProps } from "@mantine/core"
import type { PropsWithChildren } from "react"
import style from "./style.module.css"
import { clsx } from "clsx"

interface Props extends BoxComponentProps {}

export default function ScrollArea({ children, className, ...props }: PropsWithChildren<Props>) {
  return (
    <Box className={clsx(style.scrollable, className)} {...props}>
      {children}
    </Box>
  )
}
