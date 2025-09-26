export const BLOCKS = [
  {
    name: "catchphrase",
    label: "Catchphrase",
    label_ja: "キャッチフレーズ",
    description: "ひと言で表すなら？"
  },
  {
    name: "summary",
    label: "Summary",
    label_ja: "概要",
    description: "簡単に説明するなら？"
  },
  {
    name: "definition",
    label: "Definition",
    label_ja: "定義",
    description: "厳密な定義を述べると？"
  },
  {
    name: "background",
    label: "Background",
    label_ja: "背景",
    description: "どんな課題を解決するために登場した？"
  },
  {
    name: "mechanism",
    label: "Mechanism",
    label_ja: "仕組み",
    description: "どんな仕組みで動く？"
  },
  {
    name: "purpose",
    label: "Purpose",
    label_ja: "目的",
    description: "どんな目的で使われる？"
  },
  {
    name: "usage",
    label: "Usage",
    label_ja: "使い方",
    description: "どうやって使う？"
  },
  {
    name: "usecase",
    label: "Use Case",
    label_ja: "使用例",
    description: "どんな場面で使われる？"
  },
  {
    name: "advantage",
    label: "Advantage",
    label_ja: "利点",
    description: "どんなメリットがある？"
  },
  {
    name: "pitfall",
    label: "Pitfall",
    label_ja: "落とし穴",
    description: "注意すべき点は？"
  },
  {
    name: "constraints",
    label: "Constraints",
    label_ja: "制約条件",
    description: "使う上でどんな制約がある？"
  },
  {
    name: "limit",
    label: "Limit",
    label_ja: "限界",
    description: "適用できない状況はある？"
  },
  {
    name: "insight",
    label: "Insight",
    label_ja: "知見",
    description: "自分なりに気づいたことは？"
  }
] as const

export type BlockTypes = (typeof BLOCKS)[number]["name"]
