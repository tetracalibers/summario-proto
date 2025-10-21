export const createSectionBlockJson = (title: string) => ({
  type: "section_block",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [
        {
          type: "text",
          text: title
        }
      ]
    },
    {
      type: "paragraph",
      content: []
    }
  ]
})
