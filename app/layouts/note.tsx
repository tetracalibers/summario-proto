import { Outlet } from "react-router"
import styles from "./note/layout.module.css"
import SideRight from "./note/SideRight"
import SideLeft from "./note/SideLeft"
import { Autocomplete } from "@mantine/core"
import { dummySearchKeywords } from "~/db/dummy"

export default function NotePageLayout() {
  return (
    <div className={styles.root}>
      <div className={styles.search}>
        <Autocomplete placeholder="Search by Title or Alias" data={dummySearchKeywords} />
      </div>
      <div className={styles.side_l}>
        <SideLeft />
      </div>
      <div className={styles.main}>
        <Outlet />
      </div>
      <div className={styles.side_r}>
        <SideRight />
      </div>
    </div>
  )
}
