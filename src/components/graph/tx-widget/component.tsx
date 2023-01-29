import { formatEther } from 'ethers/lib/utils'
import type { Tx } from '../../../api'
import { trimTransaction } from '../../../utils'
import { Container } from '../../container'

type Props = { tx?: Tx }

export const TxWidget = ({ tx }: Props) => {
  return (
    <Container>
      <h4 style={{ margin: '10px 0' }}>
        Transaction <span>{!tx && '(click to the edge)'}</span>
      </h4>
      {tx && (
        <ul>
          <li>
            <span>value: {formatEther(tx.value)} eth</span>
          </li>
          <li>
            <span>hash: {trimTransaction(tx.txhash)}</span>
          </li>
          <li>
            <span>block: {tx.block}</span>
          </li>
          <li>
            <span>gas: {tx.gas}</span>
          </li>
          <li>
            <span>time: {new Date(tx.time * 1000).toLocaleDateString()}</span>
          </li>
        </ul>
      )}
    </Container>
  )
}
