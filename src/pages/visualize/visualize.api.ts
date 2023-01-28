import { trimAddress } from '../../utils'

//This is special API for graph visualization
const ApiRoot = 'http://localhost:3033'

export type Tx = {
  time: number
  txfrom: string
  txto: string
  gas: string
  gasPrice: string
  block: number
  txhash: string
  value: string
  contract_to: string
  status: boolean
  contract_value: string
}

export const fetchTxs = (id?: string) => (): Promise<Tx[]> => {
  return fetch(`${ApiRoot}/tx?address=${id}`).then((res) => res.json())
}

const getUniqueAddresses = (arr: Tx[]) =>
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

export const getGraphFromData = (data: Tx[], root?: string, lastClicked?: string) => {
  const nodes = getUniqueAddresses(data).map((el) => ({
    id: el,
    label: trimAddress(el, 2),
    color: getNodeColorByHash(el, root, lastClicked),
  }))

  const edges = data.map((node) => ({
    from: node.txfrom,
    to: node.txto,
  }))

  return { nodes, edges }
}
