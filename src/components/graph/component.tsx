import GraphVis from 'react-vis-graph-wrapper'
import type { GraphData, GraphEvents } from 'react-vis-graph-wrapper'
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
  events: GraphEvents
  graph: GraphData
}

export const Graph = ({ graph, events }: Props): JSX.Element => {
  return <GraphVis className="graph" options={options} graph={graph} events={events} />
}
