import { providers } from 'ethers'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useToast } from '@contexts'
import { trimAddress } from '@utils'
import type { IWalletContext, WrappedProvider } from './context.types'

const WalletContext = createContext<IWalletContext>(undefined as unknown as IWalletContext)

export const useWallet = () => useContext<IWalletContext>(WalletContext)

type Props = {
  children: React.ReactNode
}

export const WalletProvider = ({ children }: Props) => {
  const { sendToast } = useToast()

  const [metaMask, setMetaMask] = useState<WrappedProvider | undefined>(undefined)
  const [account, setAccount] = useState<providers.JsonRpcSigner | undefined>(undefined)
  const accountRef = useRef(account)
  const [address, setAddress] = useState<string>('')

  useEffect(() => {
    if (window.ethereum) {
      const provider = new providers.Web3Provider(
        window.ethereum,
        providers.getNetwork('sepolia'),
      ) as WrappedProvider

      if (provider.provider.isMetaMask) {
        setMetaMask(provider)
        return
      }
    }

    // TODO: Should the connect button be hidden if no MetaMask is detected?
    // sendToast('MetaMask not detected.');
    // console.warn('MetaMask not detected.');
  }, [sendToast])

  const connect = () => {
    if (!metaMask || !metaMask.provider.isMetaMask) {
      sendToast('MetaMask not detected.')
      return
    } else if (account) {
      sendToast('Already connected.')
      return
    }

    metaMask
      .send('eth_requestAccounts', [])
      .then(async (accounts) => {
        console.debug('Retrieved accounts from MetaMask:', accounts)
        const signer = metaMask.getSigner()

        signer
          .getChainId()
          .then((chain) => {
            if (chain === providers.getNetwork('sepolia').chainId) {
              setAccount(signer)
            }
          })
          .catch((err) => {
            sendToast('Detected the wrong chain on MetaMask.')
            console.error('Detected the wrong chain on MetaMask:', err.message)

            metaMask.provider
              .request({
                method: 'wallet_switchEthereumChain',
                params: [
                  {
                    chainId: `0x${providers.getNetwork('sepolia').chainId}`,
                  },
                ],
              })
              .then(() => setAccount(signer))
              .catch((error) => {
                console.error('Error changing chain:', error.message)
                sendToast('Error changing chain. Try connecting again.')
              })
          })
      })
      .catch((err) => {
        switch (err.code) {
          case 4001:
            sendToast('Please connect to MetaMask.')
            break
          case -32002:
            sendToast('Connect window already visible.')
            break
          default:
            sendToast('Error connecting to MetaMask.')
            break
        }
      })
  }

  // TODO: MetaMask connect and disconnect events.

  const onAccountsChanged = useCallback(
    (accts: string[]) => {
      console.debug('MetaMask account changed:', accts)
      if (
        metaMask &&
        metaMask.provider.isMetaMask &&
        accountRef.current &&
        accountRef.current !== metaMask.getSigner()
      ) {
        sendToast('Detected a different wallet on MetaMask.')
        // Instead of updating account, set it to undefined and require reconnection.
        setAccount(undefined)
        setAddress('')
      }
    },
    [metaMask, sendToast],
  )

  const onChainChanged = useCallback(
    (chain: string) => {
      console.debug('MetaMask chain changed:', chain.slice(2))

      if (parseInt(chain.slice(2)) !== providers.getNetwork('sepolia').chainId) {
        sendToast('Detected the wrong chain on MetaMask.')
        // Instead of allowing account to remain, set it to undefined and require correct chain.
        setAccount(undefined)
        setAddress('')
      }
    },
    [sendToast],
  )

  const onDebug = useCallback((data: unknown) => {
    console.debug('Debug:', data)
  }, [])

  useEffect(() => {
    if (!metaMask) return

    // metaMask.on('debug', onDebug);
    metaMask.provider.on('accountsChanged', onAccountsChanged)
    metaMask.provider.on('chainChanged', onChainChanged)

    return () => {
      // metaMask.removeListener('debug', onDebug);
      metaMask.provider.removeListener('accountsChanged', onAccountsChanged)
      metaMask.provider.removeListener('chainChanged', onChainChanged)
    }
  }, [metaMask, onAccountsChanged, onChainChanged, onDebug])

  useEffect(() => {
    if (!account) return
    console.log(account)

    account
      .getAddress()
      .then((addr) => {
        setAddress(addr)
        console.log('Connected as', trimAddress(addr))
        sendToast('Connected as ' + trimAddress(addr))
      })
      .catch((err) => sendToast(err.message))
  }, [sendToast, account])

  return (
    <WalletContext.Provider value={{ address, connect, metaMask }}>
      {children}
    </WalletContext.Provider>
  )
}
