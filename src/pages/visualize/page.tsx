import { fetchTxs, getGraphFromData } from './visualize.api'
import type { Tx } from './visualize.api'
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { Button, Graph, Input } from '../../components'
import type { GraphType } from '../../components'
import { useGetAddress } from '../../hooks'
import { trimAddress } from '../../utils'
import './page.scss'

export const Visualize = () => {
  const { id } = useParams()
  const { data: rawData } = useQuery('txs', fetchTxs(id))
  const [data, setData] = useState<Tx[]>([])
  const [lastClickedNode, setLastClickedNode] = useState(id || '')
  const [graph, setGraph] = useState<GraphType>({ nodes: [], edges: [] })
  const [displayTrashhold, setDisplayTrashhold] = useState('100')

  const addressInfo = useGetAddress(lastClickedNode)

  useEffect(() => {
    if (rawData) {
      setData(rawData)
    }
  }, [rawData])

  useEffect(() => {
    if (data) {
      setGraph(getGraphFromData(data, id, lastClickedNode))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

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
            <br /> (total displayed: {graph.nodes.length})
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
