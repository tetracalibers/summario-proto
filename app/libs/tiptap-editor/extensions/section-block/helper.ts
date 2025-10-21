export const createSectionBlockJson = (type: string, label: string) => ({
  type: "section_block",
  attrs: { type },
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [
        {
          type: "text",
          text: label
        }
      ]
    },
    {
      type: "paragraph",
      content: []
    }
  ]
})
