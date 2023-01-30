import { Container, RedirectButton } from '../../'
import { formatEther } from 'ethers/lib/utils'
import type { Tx } from '../../../api'
import { stringifyTxTime } from '../../../api'
import { trimTransaction } from '../../../utils'

type Props = { tx?: Tx }

export const TxWidget = ({ tx }: Props) => {
  return (
    <Container>
      <h4 style={{ margin: '10px 0' }}>
        Transaction <span>{!tx && '(click to the edge)'}</span>
      </h4>
      {tx && (
        <>
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
              <span>time: {stringifyTxTime(tx.time)}</span>
            </li>
          </ul>
          <div style={{ marginTop: 10 }}>
            <RedirectButton link={`/tx/${tx.txhash}`}>View transaction</RedirectButton>
          </div>
        </>
      )}
    </Container>
  )
}
