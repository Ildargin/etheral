import type { Events, GraphType } from './component.types'
import { useMemo } from 'react'
//@ts-expect-error(no-types)
import GraphVis from 'react-graph-vis'
import { v4 as uuidv4 } from 'uuid'
import './component.scss'

const options = {
  nodes: {
    shape: 'circle',
  },
  edges: {
    arrows: {
      to: {
        scaleFactor: 0.3,
        type: 'arrow',
      },
      from: {
        scaleFactor: 0.3,
        type: 'arrow',
      },
    },
    arrowStrikethrough: true,
    hoverWidth: 1.5,
    labelHighlightBold: true,
    selectionWidth: 1,
    smooth: {
      enabled: true,
      type: 'dynamic',
      roundness: 1,
    },
    color: 'white',
  },
  physics: {
    barnesHut: {
      gravitationalConstant: -50000,
      centralGravity: 0.5,
    },
  },
}

type Props = {
  events: Events
  graph: GraphType
}

export const Graph = ({ graph, events }: Props): JSX.Element => {
  const key = useMemo(uuidv4, [graph])

  return <GraphVis className="graph" key={key} options={options} graph={graph} events={events} />
}
