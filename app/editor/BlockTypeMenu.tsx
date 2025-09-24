import BLOCK_TYPES from "./block-type.json"
import { Card } from "primereact/card"
import "./card.css"

const BlockTypeMenu = () => {
  return (
    <div className="stack">
      {BLOCK_TYPES.map((block) => (
        <Card
          title={block.label}
          subTitle={block.label_ja}
          draggable
          key={block.name}
          onDragStart={(e) => {
            e.dataTransfer.setData(
              "application/x-block",
              JSON.stringify({ type: block.name, label: block.label })
            )
          }}
        >
          <p style={{ margin: 0 }}>{block.description}</p>
        </Card>
      ))}
    </div>
  )
}

export default BlockTypeMenu
