import { createTheme } from "@mantine/core"

export const theme = createTheme({
  colors: {
    "blue-gray": [
      "#f1f4fe",
      "#e4e6ed",
      "#c8cad3",
      "#a9adb9",
      "#9094a3",
      "#7f8496",
      "#777c91",
      "#63687c",
      "#595e72",
      "#4a5167"
    ],
    "pale-indigo": [
      "#eff2ff",
      "#dfe2f2",
      "#bdc2de",
      "#99a0ca",
      "#7a84b9",
      "#6672af",
      "#5c69ac",
      "#4c5897",
      "#424e88",
      "#36437a"
    ],
    "bright-orange": [
      "#fff8e1",
      "#ffefcb",
      "#ffdd9a",
      "#ffca64",
      "#ffba38",
      "#ffb01b",
      "#ffa903",
      "#e39500",
      "#cb8400",
      "#b07100"
    ],
    magenta: [
      "#ffe9f6",
      "#ffd1e6",
      "#faa1c9",
      "#f66eab",
      "#f24391",
      "#f02981",
      "#f01879",
      "#d60867",
      "#c0005c",
      "#a9004f"
    ]
  },
  fontFamily: "Montserrat, Zen Kaku Gothic Antique",
  fontFamilyMonospace: "DM Mono",
  black: "#303841",
  white: "#fcfefe",

  headings: {
    fontWeight: "500",
    sizes: {
      h1: { fontSize: "1.75rem" },
      h2: { fontSize: "1.5rem" },
      h3: { fontSize: "1.25rem" },
      h4: { fontSize: "1.125rem" }
    }
  }
})
