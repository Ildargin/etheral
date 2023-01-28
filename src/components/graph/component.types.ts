type Node = {
  id: string
  label: string | null
  color: string
}

type Edge = {
  from: string
  to: string
}

export type GraphType = {
  nodes: Node[]
  edges: Edge[]
}

export type Events = {
  select: (event: { nodes: [] }) => Promise<void>
}
