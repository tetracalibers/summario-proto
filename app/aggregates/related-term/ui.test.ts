import { currentRelatedTerms$, toRemoveRelatedTermLabels$ } from "./ui.selectors"
import { createStore } from "jotai"
import { optionsRelatedTerm$, serverRelatedTerm$, uiRelatedTermLabel$ } from "./ui.atoms"
import { toAddRelatedTermLabels$ } from "./ui.selectors"

test("UIに関連用語を追加したら差分が更新される", () => {
  const store = createStore()

  // スパイして値を固定
  const serverDataSpy = vi.spyOn(serverRelatedTerm$, "read")
  serverDataSpy.mockReturnValue(new Map([["React", 1]]))

  const optionsSpy = vi.spyOn(optionsRelatedTerm$, "read")
  optionsSpy.mockReturnValue(
    new Map([
      ["React", 1],
      ["Vite", 2],
      ["Jotai", 3]
    ])
  )

  store.set(uiRelatedTermLabel$, ["React", "Vite"])
  expect(store.get(toAddRelatedTermLabels$)).toStrictEqual(["Vite"])

  // リセット
  serverDataSpy.mockRestore()
  optionsSpy.mockRestore()
})

test("UIに関連用語を削除したら差分が更新される", () => {
  const store = createStore()

  // スパイして値を固定
  const serverDataSpy = vi.spyOn(serverRelatedTerm$, "read")
  serverDataSpy.mockReturnValue(
    new Map([
      ["React", 1],
      ["Vite", 2]
    ])
  )

  const optionsSpy = vi.spyOn(optionsRelatedTerm$, "read")
  optionsSpy.mockReturnValue(
    new Map([
      ["React", 1],
      ["Vite", 2],
      ["Jotai", 3]
    ])
  )

  store.set(uiRelatedTermLabel$, ["React"])
  expect(store.get(toRemoveRelatedTermLabels$)).toStrictEqual(["Vite"])

  // リセット
  serverDataSpy.mockRestore()
  optionsSpy.mockRestore()
})

test("currentRelatedTerms$", () => {
  const store = createStore()

  const optionsSpy = vi.spyOn(optionsRelatedTerm$, "read")
  optionsSpy.mockReturnValue(
    new Map([
      ["React", 1],
      ["Vite", 2],
      ["Jotai", 3]
    ])
  )

  store.set(uiRelatedTermLabel$, ["React", "Jotai"])
  expect(store.get(currentRelatedTerms$)).toStrictEqual([
    { title: "React", id: 1 },
    { title: "Jotai", id: 3 }
  ])

  // リセット
  optionsSpy.mockRestore()
})
