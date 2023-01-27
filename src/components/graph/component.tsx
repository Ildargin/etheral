//@ts-expect-error(no-types)
import { Graph as GraphVis } from 'react-graph-vis'
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

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const Graph = (props: any) => {
  return <GraphVis className="graph" key={uuidv4()} options={options} {...props} />
}
