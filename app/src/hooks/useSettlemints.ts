import { ethers } from "ethers"
import { hexZeroPad } from "ethers/lib/utils"
import { useCallback, useEffect, useState } from "react"
import { SettleMint__factory } from "src/types/contracts"
import useWallet from "./useWallet"

type Settlemint = {
  address: string
  name?: string
}

type SettlemintWalletData = {
  membership: Map<string, Settlemint>
  ownership: Map<string, Settlemint>
}

const ADDED_MEMBER_TOPIC = ethers.utils.id("AddedMember(address)")
const ADDED_OWNER_TOPIC = ethers.utils.id("AddedOwner(address)")

export const useSettlemints = (): [
  SettlemintWalletData | undefined,
  boolean
] => {
  const wallet = useWallet()
  const [settlemints, setSettlemints] = useState<SettlemintWalletData>()
  const [isLoading, setIsLoading] = useState(false)

  const fetchSettlemints = useCallback(async () => {
    try {
      if (!wallet) {
        return undefined
      }
      const address = wallet.address
      const web3Provider = new ethers.providers.Web3Provider(wallet.provider)

      const ownerOrMemberLogs = await web3Provider.getLogs({
        fromBlock: 0,
        toBlock: "latest",
        topics: [
          [ADDED_MEMBER_TOPIC, ADDED_OWNER_TOPIC],
          hexZeroPad(address, 32),
        ],
      })

      return ownerOrMemberLogs.reduce<SettlemintWalletData>(
        (previous, current) => {
          const contractAddress = current.address

          if (current.topics[0] === ADDED_MEMBER_TOPIC) {
            const member = ethers.utils.hexStripZeros(current.topics[1])
            if (member.toLowerCase() === address.toLowerCase()) {
              previous.membership.set(contractAddress, {
                address: contractAddress,
              })
            }
          } else if (current.topics[0] === ADDED_OWNER_TOPIC) {
            const owner = ethers.utils.hexStripZeros(current.topics[1])
            if (owner.toLowerCase() === address.toLowerCase()) {
              previous.ownership.set(contractAddress, {
                address: contractAddress,
              })
            }
          } else {
            throw Error("Unexpected log topic")
          }
          return previous
        },
        {
          membership: new Map<string, Settlemint>(),
          ownership: new Map<string, Settlemint>(),
        }
      )
    } catch (error) {
      console.log(error)
    }
  }, [wallet])

  useEffect(() => {
    let isMounted = true
    const doLoad = async () => {
      setIsLoading(true)
      const newSettlemints = await fetchSettlemints()
      isMounted && setSettlemints(newSettlemints)
      isMounted && setIsLoading(false)
    }

    doLoad()
    return () => {
      isMounted = false
    }
  }, [fetchSettlemints])

  return [settlemints, isLoading]
}
