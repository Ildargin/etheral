import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import type { GraphData, GraphEvents } from 'react-vis-graph-wrapper'
import { concatGraphs, fetchTxs, getGraphFromTxs, getUniqueTxAddresses } from '../../api'
import { Button, Graph, Input } from '../../components'
import { useGetAddress } from '../../hooks'
import { trimAddress } from '../../utils'
import './page.scss'

export const Visualize = () => {
  const { id } = useParams()
  const [lastClickedNode, setLastClickedNode] = useState('')
  const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] })
  const [displayTrashhold, setDisplayTrashhold] = useState('100')
  const [trashholdMessage, setTrashholdMessage] = useState('')
  const addressInfo = useGetAddress(lastClickedNode)

  const fetchAndUpdateGraph = useCallback(
    async (address: string) => {
      const txs = await fetchTxs(address)
      if (getUniqueTxAddresses(txs).length > Number(displayTrashhold)) {
        setTrashholdMessage(`Node txs(${txs.length}) is too big for display!`)
        return
      }
      setTrashholdMessage('')
      setGraph((graph) => concatGraphs(graph, getGraphFromTxs(txs, id, address)))
    },
    [displayTrashhold, id],
  )

  useEffect(() => {
    if (id) {
      fetchAndUpdateGraph(id)
    }
  }, [id, fetchAndUpdateGraph])

  const updateWithTrashhold = useCallback(() => {
    const address = lastClickedNode || id
    if (displayTrashhold && address) {
      fetchAndUpdateGraph(address)
    }
  }, [displayTrashhold, lastClickedNode, id, fetchAndUpdateGraph])

  useEffect(() => {
    updateWithTrashhold()
  }, [updateWithTrashhold])

  const events: GraphEvents = {
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
