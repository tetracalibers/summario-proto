import { IconLoader } from "@tabler/icons-react"
import loadingStyle from "./loading.module.css"

interface Props {
  size?: string | number
}

export default function IconLoadingSpinner({ size }: Props) {
  return <IconLoader className={loadingStyle.loading_icon} size={size} />
}
