import { memo } from 'react'
import { Avatar, Button } from '@components'
import { useWallet } from '@contexts'
import { trimAddress } from '@utils'

type Props = React.HTMLAttributes<HTMLButtonElement> & {
  address: string
}

const Address = memo(({ address, ...rest }: Props) => (
  <Button style={{ padding: '7px 15px', cursor: 'initial' }} {...rest}>
    <Avatar address={address} />
    {trimAddress(address)}
  </Button>
))

export const AddressBox = (rest: React.HTMLAttributes<HTMLButtonElement>) => {
  const { address, connect } = useWallet()

  return address ? (
    <Address address={address} {...rest} />
  ) : (
    <Button style={{ padding: '7px 15px' }} onClick={() => connect()} {...rest}>
      Connect Wallet
    </Button>
  )
}
