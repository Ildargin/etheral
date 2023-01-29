import type { Tx } from './api.types'
import type { GraphData } from 'react-vis-graph-wrapper'
import { trimAddress } from '../../utils'

//This is special API for graph visualization
const ApiRoot = 'http://localhost:3033'

export const fetchTxsByUserId = async (id?: string): Promise<Tx[]> => {
  const res = await fetch(`${ApiRoot}/tx?address=${id}`)
  const data = await res.json()
  return data
}

export const fetchTxById = async (id: number): Promise<Tx> => {
  const res = await fetch(`${ApiRoot}/tx?search=${id}`)
  const data = await res.json()
  return data
}

export const getUniqueTxAddresses = (arr: Tx[]) =>
  arr.reduce((acc, el) => {
    const items = []
    if (!acc.includes(el.txto)) {
      items.push(el.txto)
    }
    if (!acc.includes(el.txfrom)) {
      items.push(el.txfrom)
    }
    return acc.concat(items)
  }, [] as string[])

const getNodeColorByHash = (hash: string, root?: string, lastClicked?: string) => {
  const isRoot = root === hash
  const isLastClicked = lastClicked === hash
  if (isRoot) {
    return '#E0AFA0'
  }
  if (isLastClicked) {
    return 'red'
  }
  return '#fafafa'
}

export const getGraphFromTxs = (txs: Tx[], root?: string, lastClicked?: string): GraphData => {
  const nodes = getUniqueTxAddresses(txs).map((el) => ({
    id: el,
    label: trimAddress(el, 2),
    color: getNodeColorByHash(el, root, lastClicked),
  }))

  const edges = txs.map((node) => ({
    id: node.id,
    from: node.txfrom,
    to: node.txto,
  }))

  return { nodes, edges }
}

const getUniqueItemsById = <T extends { id?: number | string }>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter((node) => !arr2.some((node2) => node2.id === node.id)).concat(arr2)
}

export const concatGraphs = (g1: GraphData, g2: GraphData): GraphData => {
  return {
    nodes: getUniqueItemsById(g1.nodes, g2.nodes),
    edges: getUniqueItemsById(g1.edges, g2.edges),
  }
}
