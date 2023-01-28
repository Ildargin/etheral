export type Node = {
  id: string
  label: string | null
  color: string
}

export type Edge = {
  id: string | number
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
