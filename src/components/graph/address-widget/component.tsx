import Clipboard from 'clipboard'
import { useGetAddress } from '../../../hooks'
import { trimAddress } from '../../../utils'
import { Button } from '../../button'
import { Container } from '../../container'
import { FlexBox } from '../../flex-box'
import { RedirectButton } from '../../redirect-button'

const addressId = 'address-widget-address'
const onCopy = () => new Clipboard(`#${addressId}`)

export const AddressWidget = ({ address }: { address: string }) => {
  const addressInfo = useGetAddress(address)

  return (
    <Container>
      <FlexBox align="center" style={{ marginBottom: 10 }}>
        <span style={{ marginRight: 10 }}>
          <b>Address:</b> {trimAddress(address)}
        </span>
        <Button
          id={addressId}
          data-clipboard-text={address}
          style={{ display: 'inline' }}
          onClick={onCopy}
        >
          copy
        </Button>
      </FlexBox>
      <ul>
        <li>
          <span>type: {addressInfo.isContract ? 'contract' : 'external owned acccount'}</span>
        </li>
        <li>
          <span>balance: {addressInfo.balance || 'unknown'} eth</span>
        </li>
        <li>
          <span>tx count: {addressInfo.transactionCount || 'unknown'}</span>
        </li>
      </ul>
      <div style={{ marginTop: 10 }}>
        <RedirectButton link={`/address/${address}`}>View address</RedirectButton>
      </div>
    </Container>
  )
}
