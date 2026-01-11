import IconLoadingSpinner from "../icon-loading-spinner/IconLoadingSpinner"
import loadingStyle from "./LoadingLabel.module.css"

interface Props {
  doing: string
  iconSize?: string | number
}

export default function LoadingLabel({ doing, iconSize = "16px" }: Props) {
  return (
    <span className={loadingStyle.loading}>
      <IconLoadingSpinner size={iconSize} />
      {doing}...
    </span>
  )
}
