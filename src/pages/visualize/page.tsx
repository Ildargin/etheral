import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import { concatGraphs, fetchTxs, getGraphFromTxs } from '../../api'
import { Button, Graph, Input } from '../../components'
import type { GraphType } from '../../components'
import { useGetAddress } from '../../hooks'
import { trimAddress } from '../../utils'
import './page.scss'

export const Visualize = () => {
  const { id } = useParams()
  const [lastClickedNode, setLastClickedNode] = useState('')
  const [graph, setGraph] = useState<GraphType>({ nodes: [], edges: [] })
  const [displayTrashhold, setDisplayTrashhold] = useState('1')
  const [trashholdMessage, setTrashholdMessage] = useState('')
  const addressInfo = useGetAddress(lastClickedNode)

  const fetchAndUpdateGraph = async (address: string) => {
    const txs = await fetchTxs(address)
    if (txs.length > Number(displayTrashhold)) {
      setTrashholdMessage(`Node txs(${txs.length}) is too big for display!`)
      return
    }
    setTrashholdMessage('')
    setGraph((graph) => concatGraphs(graph, getGraphFromTxs(txs, id, address)))
  }

  useEffect(() => {
    if (id) {
      fetchAndUpdateGraph(id)
    }
  }, [id])

  useEffect(() => {
    const address = lastClickedNode || id
    if (displayTrashhold && address) {
      fetchAndUpdateGraph(address)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayTrashhold])

  const events = {
    select: async function (event: { nodes?: [] }) {
      const node = event.nodes?.at(0)
      if (node) {
        setLastClickedNode(node)
        setTrashholdMessage('')
        fetchAndUpdateGraph(node)
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
        {trashholdMessage && (
          <div className="side-address-info">
            <span>{trashholdMessage}</span>
          </div>
        )}
      </div>
    </div>
  )
}
