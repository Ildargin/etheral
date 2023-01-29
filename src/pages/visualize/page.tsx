import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import type { GraphData, GraphEvents } from 'react-vis-graph-wrapper'
import type { Tx } from '../../api'
import {
  concatGraphs,
  fetchTxById,
  fetchTxsByUserId,
  getGraphFromTxs,
  getUniqueTxAddresses,
} from '../../api'
import { AddressWidget, Container, Graph, Input, TxWidget } from '../../components'
import './page.scss'

export const Visualize = () => {
  const { id = '' } = useParams()
  const [lastClickedNode, setLastClickedNode] = useState('')
  const [edgeTx, setEdgeTx] = useState<Tx>()
  const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] })
  const [displayTrashhold, setDisplayTrashhold] = useState('100')
  const [trashholdMessage, setTrashholdMessage] = useState('')

  const fetchTxInfo = useCallback(async (address: number) => {
    const tx = await fetchTxById(address)
    setEdgeTx(tx)
  }, [])

  const fetchAndUpdateGraph = useCallback(
    async (address: string) => {
      const txs = await fetchTxsByUserId(address)
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
    const address = lastClickedNode || id
    if (address) {
      fetchAndUpdateGraph(address)
    }
  }, [id, fetchAndUpdateGraph, displayTrashhold])

  const events: GraphEvents = {
    select: async function (event: { nodes?: []; edges?: [] }) {
      const edge = event.edges?.at(0)
      const node = event.nodes?.at(0)
      if (node) {
        setLastClickedNode(node)
        setTrashholdMessage('')
        fetchAndUpdateGraph(node)
      }
      if (edge) {
        fetchTxInfo(edge)
      }
    },
  }

  return (
    <div className="graph-container">
      <Graph graph={graph} events={events} />
      <section className="side">
        <div>
          <span> Display nodes trashhold for 1 node</span>
          <br />
          <span>total displayed: {graph.nodes.length}</span>
        </div>
        <div>
          <Input
            value={displayTrashhold}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayTrashhold(e.target.value)}
          />
        </div>
        <AddressWidget address={lastClickedNode || id} />
        <TxWidget tx={edgeTx} />
        {trashholdMessage && (
          <Container>
            <span>{trashholdMessage}</span>
          </Container>
        )}
      </section>
    </div>
  )
}
