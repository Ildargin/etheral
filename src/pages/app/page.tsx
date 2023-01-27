import { Blocks, Transactions } from '../../components/web3'
import { BlockWidget, FlexBox, SearchBox } from '../../components'
import { InfuraProvider } from '../../contexts'

export const App = () => {
  return (
    <>
      <FlexBox direction="col">
        <InfuraProvider>
          <SearchBox />
          <BlockWidget />
          <FlexBox justify="center" wrap="wrap">
            <FlexBox direction="col">
              <span style={{ margin: '10px 15px', fontSize: '18px' }}>Recent Blocks</span>
              <Blocks />
            </FlexBox>
            <FlexBox direction="col">
              <span style={{ margin: '10px 15px', fontSize: '18px' }}>Recent Transactions</span>
              <Transactions />
            </FlexBox>
          </FlexBox>
        </InfuraProvider>
      </FlexBox>
    </>
  )
}
