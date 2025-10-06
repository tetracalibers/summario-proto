// DirtyState.ts
import { Extension } from "@tiptap/core"
import { Plugin } from "prosemirror-state"
import type { Node as PMNode } from "prosemirror-model"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    dirtyState: {
      /** 今のドキュメントを基準（未編集）にする */
      markClean: () => ReturnType
    }
  }
}

type DirtyOptions = {
  /** 初期 JSON（未指定なら “最初の doc” を基準にする） */
  initialJSON?: any | null
  /** dirty の変化を通知（任意） */
  onDirtyChange?: (dirty: boolean) => void
}

export const DirtyState = Extension.create<DirtyOptions>({
  name: "dirty-state",

  addOptions() {
    return {
      initialJSON: null,
      onDirtyChange: () => {}
    }
  },

  addStorage() {
    return {
      /** 現在 dirty か */
      dirty: false as boolean,
      /** 基準となる初期Doc */
      baseline: null as PMNode | null
    }
  },

  /**
   * Editor 初期化時に baseline を決定：
   *  - initialJSON があれば schema から生成
   *  - なければ “初期 state.doc” を基準に採用
   */
  onCreate() {
    const { initialJSON } = this.options
    const schema = this.editor.schema

    if (initialJSON) {
      try {
        this.storage.baseline = schema.nodeFromJSON(initialJSON)
      } catch (e) {
        // 万一 JSON が schema と不整合なら、最初の doc を基準にフォールバック
        this.storage.baseline = this.editor.state.doc
        if (process.env.NODE_ENV !== "production") {
          console.warn("[DirtyState] invalid initialJSON; fallback to first doc:", e)
        }
      }
    } else {
      this.storage.baseline = this.editor.state.doc
    }

    // 初期 dirty を算出（「初期コンテンツが既に差分あり」ケースにも対応）
    this.storage.dirty = !this.editor.state.doc.eq(this.storage.baseline!)
    this.options.onDirtyChange?.(this.storage.dirty)
  },

  addCommands() {
    return {
      markClean:
        () =>
        ({ editor }) => {
          this.storage.baseline = editor.state.doc
          const was = this.storage.dirty
          this.storage.dirty = false
          if (was !== this.storage.dirty) this.options.onDirtyChange?.(false)
          return true
        }
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        state: {
          init: () => null,
          // doc 変化のたびに dirty を更新
          apply: (tr, _value, _oldState, newState) => {
            if (!this.storage.baseline) return null
            if (!tr.docChanged) return null

            const nowDirty = !newState.doc.eq(this.storage.baseline)
            if (nowDirty !== this.storage.dirty) {
              this.storage.dirty = nowDirty
              this.options.onDirtyChange?.(nowDirty)
            }
            return null
          }
        }
      })
    ]
  }
})
