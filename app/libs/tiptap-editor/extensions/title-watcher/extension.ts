import { Extension } from "@tiptap/core"
import { Plugin } from "@tiptap/pm/state"
import type { EditorState, Transaction } from "@tiptap/pm/state"
import type { StepMap } from "@tiptap/pm/transform"

// 先頭ノードが見出しである前提でO(1)で読む
function readTopTitle(state: EditorState) {
  const doc = state.doc
  if (doc.childCount === 0) return { text: null, size: 0 }

  const first = doc.child(0)
  const size = first.nodeSize // 旧doc基準の範囲判定で使う
  if (first.type.name !== "title_block") return { text: null, size }

  return { text: first.textContent ?? "", size }
}

/**
 * StepMap が旧ドキュメントの [from, to) に触れたか？
 * - 置換/削除： [oldStart, oldEnd) と [from, to) が重なれば true
 * - 挿入： oldStart===oldEnd のとき、oldStart <= from で新規内容が追加されていれば true
 */
function mapTouchesRange(map: StepMap, from: number, to: number): boolean {
  let touched = false
  map.forEach((oldStart, oldEnd, newStart, newEnd) => {
    // 重なり（置換・削除）
    if (oldEnd > from && oldStart < to) touched = true
    // 挿入（空区間に対する追加）
    if (oldStart === oldEnd && newEnd > newStart && oldStart <= from) touched = true
  })
  return touched
}

/** トランザクション全体（マッピング列）が [from, to) に触れたか？ */
function mappingTouchesRange(tr: Transaction, from: number, to: number): boolean {
  // tr.mapping.maps は各 Step に対応する StepMap の配列
  return tr.mapping.maps.some((m) => mapTouchesRange(m as StepMap, from, to))
}

export interface TitleWatcherOptions {
  onTitleChange: (text: string | null) => void
}

export const TitleWatcher = Extension.create<TitleWatcherOptions>({
  name: "title-watcher",

  addOptions() {
    return { onTitleChange: () => {} }
  },

  addProseMirrorPlugins() {
    const onTitleChange = this.options.onTitleChange
    // 旧状態のキャッシュ（firstNodeSize は旧doc基準で [0, size) の範囲判定に使う）
    let prev = { text: null as string | null, firstNodeSize: 0 }

    return [
      new Plugin({
        view: () => {
          const init = readTopTitle(this.editor.state)
          prev = { text: init.text, firstNodeSize: init.size }
          return {}
        },

        state: {
          init: () => null,
          apply(tr, _v, _oldState, newState) {
            if (!tr.docChanged) return null

            // 旧docの先頭ノード範囲に触れていなければスキップ（先頭見出しは不変とみなす）
            const touched = mappingTouchesRange(tr, 0, Math.max(0, prev.firstNodeSize))
            if (!touched) return null

            // 触れている／またはサイズ不明なときだけ読み直す（O(1)）
            const next = readTopTitle(newState)

            if (next.text !== prev.text) {
              onTitleChange(next.text)
            }

            // 次回判定用に更新
            prev = { text: next.text, firstNodeSize: next.size }
            return null
          }
        }
      })
    ]
  }
})
