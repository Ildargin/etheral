import type { Transaction } from 'ethers'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseEther, trimAddress } from '../../../utils'
import './component.scss'

export const TxTooltip = ({ transaction }: { transaction: Transaction }) => {
  const navigate = useNavigate()
  const [isHovering, setHovering] = useState(false)

  const value = parseEther(transaction.value)

  return (
    <li className="txbit-container">
      <div
        className="txbit-block"
        onClick={() => navigate(`/tx/${transaction.hash}`)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{ opacity: value + 0.05 }}
      />
      {!isHovering || !transaction || !transaction.hash ? null : (
        <div className="txbit-tooltip">
          <div className="txbit-tooltip-top">
            <div>
              <span className="txbit-tooltip-field">From</span>
              <div className="txbit-tooltip-value">{trimAddress(transaction.from)}</div>
            </div>
            <div>
              <span className="txbit-tooltip-field">To</span>
              <div className="txbit-tooltip-value">{trimAddress(transaction.to)}</div>
            </div>
          </div>
          <div className="txbit-tooltip-bottom">
            <div>
              <span className="txbit-tooltip-field">Value</span>
              <div className="txbit-tooltip-value">
                <div>{value} ETH</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
