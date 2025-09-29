import type { TreeNodeData } from "@mantine/core"

export const dummyEditorContent = `
<h1>Dummy Title</h1>
<p></p>
<ul>
  <li><p>item 1</p></li>
  <li><p>item 2</p></li>
</ul>
<section-block type="summary">
  <h2>Summary</h2>
  <ul>
    <li><p>item 1</p></li>
    <li><p>item 2</p></li>
  </ul>
</section-block>
<p>ABC</p>
<section-block type="">
  <h2>Context</h2>
  <p></p>
</section-block>
<p>Did you see that? That’s a React component. We are really living in the future.</p>
`

export const dummyFolderData: TreeNodeData[] = [
  {
    label: "src",
    value: "src",
    children: [
      {
        label: "components",
        value: "src/components",
        children: [
          { label: "Accordion.tsx", value: "src/components/Accordion.tsx" },
          { label: "Tree.tsx", value: "src/components/Tree.tsx" },
          { label: "Button.tsx", value: "src/components/Button.tsx" }
        ]
      }
    ]
  },
  {
    label: "node_modules",
    value: "node_modules",
    children: [
      {
        label: "react",
        value: "node_modules/react",
        children: [
          { label: "index.d.ts", value: "node_modules/react/index.d.ts" },
          { label: "package.json", value: "node_modules/react/package.json" }
        ]
      },
      {
        label: "@mantine",
        value: "node_modules/@mantine",
        children: [
          {
            label: "core",
            value: "node_modules/@mantine/core",
            children: [
              { label: "index.d.ts", value: "node_modules/@mantine/core/index.d.ts" },
              { label: "package.json", value: "node_modules/@mantine/core/package.json" }
            ]
          },
          {
            label: "hooks",
            value: "node_modules/@mantine/hooks",
            children: [
              { label: "index.d.ts", value: "node_modules/@mantine/hooks/index.d.ts" },
              { label: "package.json", value: "node_modules/@mantine/hooks/package.json" }
            ]
          },
          {
            label: "form",
            value: "node_modules/@mantine/form",
            children: [
              { label: "index.d.ts", value: "node_modules/@mantine/form/index.d.ts" },
              { label: "package.json", value: "node_modules/@mantine/form/package.json" }
            ]
          }
        ]
      }
    ]
  },
  {
    label: "package.json",
    value: "package.json"
  },
  {
    label: "tsconfig.json",
    value: "tsconfig.json"
  }
]
