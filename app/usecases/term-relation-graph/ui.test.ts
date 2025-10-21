import { createStore } from "jotai"
import { optionsRelatedTerm$, serverRelatedTerm$ } from "~/units/related-term/ui.atoms"
import { centerNode$ } from "./ui.atoms"
import { applyServerRelatedTermSnapshot$ } from "../term-edit/ui.actions"
import { nodes$ } from "./ui.selectors"
import { currentRelatedTerms$ } from "~/units/related-term/ui.selectors"

test("nodes$", () => {
  const store = createStore()

  // スパイして値を固定
  const centerNodeSpy = vi.spyOn(centerNode$, "read")
  centerNodeSpy.mockReturnValue({ title: "Vue", id: 3 })

  const serverDataSpy = vi.spyOn(serverRelatedTerm$, "read")
  serverDataSpy.mockReturnValue(
    new Map([
      ["React", 1],
      ["Angular", 4]
    ])
  )

  const optionsSpy = vi.spyOn(optionsRelatedTerm$, "read")
  optionsSpy.mockReturnValue(
    new Map([
      ["React", 1],
      ["Angular", 4],
      ["Vite", 2],
      ["JavaScript", 5]
    ])
  )

  store.set(
    applyServerRelatedTermSnapshot$,
    [{ title: "Vite", id: 2 }],
    [{ title: "React", id: 1 }]
  )

  const afterCurrentRelated = store.get(currentRelatedTerms$)
  expect(afterCurrentRelated).toEqual([
    { title: "Angular", id: 4 },
    { title: "Vite", id: 2 }
  ])

  const afterNodes = store.get(nodes$)
  expect(afterNodes).toEqual([
    { title: "Vue", id: 3 },
    { title: "Angular", id: 4 },
    { title: "Vite", id: 2 }
  ])

  // リセット
  centerNodeSpy.mockRestore()
  serverDataSpy.mockRestore()
})
