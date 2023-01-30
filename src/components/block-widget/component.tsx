import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@components'
import { useInfura } from '@contexts'
import './component.scss'
import { TxTooltip } from './tx-tooltip'

const MaxBits = 22 * 10

export const BlockWidget = () => {
  const navigate = useNavigate()
  const { blocks, loadingInitial } = useInfura()
  const block = blocks.get(Math.max(...blocks.keys()))
  const transactions = block?.transactions || []
  const undisplayed = transactions.length - MaxBits

  return loadingInitial || !block ? (
    <Skeleton width={582} height={372} style={{ margin: 24 }} />
  ) : (
    <section className="block-widget">
      <div className="block-container">
        <div className="block-container-header">
          <div className="block-container-header-top">
            <span>Last block: №{block.number.toLocaleString()}</span>
            <span>Transaction count: {block.transactions.length}</span>
          </div>
        </div>
        <div className="block-container-body">
          {transactions.slice(0, MaxBits).map((e) => (
            <TxTooltip key={e.hash} transaction={e} />
          ))}
        </div>
        <div className="block-container-footer">
          <span>{undisplayed > 0 ? `MORE TX ${undisplayed}` : ''} </span>
          <div>
            <button
              style={{ padding: '5px', margin: 0 }}
              onClick={() => navigate(`/block/${block.number}`)}
            >
              more details
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
