import styles from "./index.module.css"

export default function Index() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>Header</header>
      <main className={styles.main}>Main</main>
      <div className={styles.side_l}>Side Left</div>
      <div className={styles.side_r}>Side Right</div>
      <footer className={styles.footer}>Footer</footer>
    </div>
  )
}
