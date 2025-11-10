import type { ReactNode } from "react"
import styles from "./notification.module.css"

export const successContent = (message: ReactNode) => ({
  title: "SUCCESS",
  message,
  color: "cyan",
  classNames: styles
})

export const warningContent = (message: ReactNode) => ({
  title: "WARNING",
  message,
  color: "yellow",
  classNames: styles
})

export const errorContent = (message: ReactNode, target?: string) => ({
  title: target ? `ERROR: ${target}` : "ERROR",
  message,
  color: "pink",
  classNames: styles,
  autoClose: false
})
