import { useEffect, useState } from 'react'
import { useChainData } from '@contexts'
import { parseEther } from '@utils'

export const useGetAddress = (id: string) => {
  const [isContract, setIsContract] = useState(false)
  const [balance, setBalance] = useState(0)
  const [transactionCount, setTransactionCount] = useState(0)
  const { chainData } = useChainData()

  useEffect(() => {
    if (!chainData || !id) {
      return
    }
    chainData.getCode(id).then((code) => setIsContract(code !== '0x'))
    chainData.getBalance(id).then((val) => setBalance(parseEther(val)))
    chainData.getTransactionCount(id).then((val) => setTransactionCount(val))
  }, [id, chainData])

  return { balance, transactionCount, isContract }
}
