import { createStore } from "jotai"
import { serverRelatedTerm$, uiRelatedTermLabel$ } from "~/units/related-term/ui.atoms"
import { applyServerRelatedTermSnapshot$ } from "./ui.actions"

test("applyServerRelatedTermSnapshot$", () => {
  const store = createStore()

  // スパイして値を固定
  const serverDataSpy = vi.spyOn(serverRelatedTerm$, "read")
  serverDataSpy.mockReturnValue(
    new Map([
      ["React", 1],
      ["Angular", 4]
    ])
  )

  store.set(
    applyServerRelatedTermSnapshot$,
    [{ title: "Vite", id: 2 }],
    [{ title: "React", id: 1 }]
  )

  const afterServerData = store.get(serverRelatedTerm$)
  const afterUiValues = store.get(uiRelatedTermLabel$)

  expect(afterServerData).toStrictEqual(
    new Map([
      ["Angular", 4],
      ["Vite", 2]
    ])
  )
  expect(afterUiValues).toStrictEqual(["Angular", "Vite"])

  // リセット
  serverDataSpy.mockRestore()
})
