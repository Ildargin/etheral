import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { Button, Graph, Input } from '../../components'
import { useGetAddress } from '../../hooks'
import { trimAddress } from '../../utils'
import './page.scss'

type Tx = {
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

const fetchTxs = (id?: string) => (): Promise<Tx[]> => {
  return fetch(`http://localhost:3033/tx?address=${id}`).then((res) => res.json())
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

export const Visualize = () => {
  const { id } = useParams()
  const [lastClickedNode, setLastClickedNode] = useState(id || '')
  const { data: rawData } = useQuery('txs', fetchTxs(id))
  const [data, setData] = useState<Tx[]>([])
  const [graph, setGraph] = useState({ nodes: {}, edges: {} })
  const [displayTrashhold, setDisplayTrashhold] = useState('100')

  const addressInfo = useGetAddress(lastClickedNode)

  useEffect(() => {
    if (rawData) {
      setData(rawData)
    }
  }, [rawData])

  const getNodeColorByHash = useCallback(
    (hash: string) => {
      const isRoot = id === hash
      const isLastClicked = lastClickedNode === hash
      if (isRoot) {
        return '#E0AFA0'
      }
      if (isLastClicked) {
        return 'red'
      }
      return '#fafafa'
    },
    [id, lastClickedNode],
  )

  useEffect(() => {
    if (!data) {
      return
    }
    const nodes = getUniqueAddresses(data).map((el) => ({
      id: el,
      label: trimAddress(el, 2),
      color: getNodeColorByHash(el),
    }))

    const edges = data.map((node) => ({
      from: node.txfrom,
      to: node.txto,
    }))

    setGraph({
      nodes,
      edges,
    })
  }, [data, id, getNodeColorByHash])

  const events = {
    select: async function (event: { nodes: [] }) {
      const node = event.nodes?.at(0)
      if (node) {
        setLastClickedNode(node)
        const res = await fetchTxs(node)()
        if (res.length > Number(displayTrashhold)) {
          console.log(`Node txs(${res.length}) is too big for display!`)
          return
        }
        if (res) {
          setData((d) => [...d, ...res])
        }
      }
    },
  }

  return (
    <div className="graph-container">
      <Graph graph={graph} events={events} />
      <div className="side">
        <div>
          <span>
            Display nodes Trashhold
            <br /> (total displayed: {data.length})
          </span>
        </div>
        <div>
          <Input
            className="trashhold-input"
            value={displayTrashhold}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayTrashhold(e.target.value)}
          />
        </div>
        <div>
          <span>
            Address: {trimAddress(lastClickedNode)}
            <Button style={{ display: 'inline' }}>copy</Button>
          </span>
        </div>
        <div className="side-address-info">
          <span>type: {addressInfo.isContract ? 'contract' : 'external owned acccount'}</span>
          <br />
          <span>balance: {addressInfo.balance || 'unknown'} eth</span>
          <br />
          <span>tx count: {addressInfo.transactionCount || 'unknown'}</span>
          <br />
        </div>
      </div>
    </div>
  )
}
