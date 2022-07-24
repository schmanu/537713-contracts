import { ethers } from "ethers"
import { hexZeroPad } from "ethers/lib/utils"
import { useCallback, useEffect, useState } from "react"
import { SettleMint__factory } from "src/types/contracts"
import useWallet from "./useWallet"

type Settlemint = {
  address: string
  name?: string
}

export type Memberships = {
  membership: Map<string, Settlemint>
  ownership: Map<string, Settlemint>
}

export type SettlemintMap = Map<string, SettlemintDetails>

export type SettlemintDetails = {
  name: string
  address: string
  members: string[]
  owners: string[]
}

const ADDED_MEMBER_TOPIC = ethers.utils.id("AddedMember(address)")
const ADDED_OWNER_TOPIC = ethers.utils.id("AddedOwner(address)")

export const useSettlemints = (): [
  Memberships | undefined,
  Map<string, SettlemintDetails> | undefined,
  boolean
] => {
  const wallet = useWallet()
  const [memberships, setMemberships] = useState<Memberships>()
  const [mappedDetails, setMappedDetails] =
    useState<Map<string, SettlemintDetails>>()
  const [isLoading, setIsLoading] = useState(false)

  const fetchSettlemints = useCallback(async (): Promise<
    [Memberships | undefined, Map<string, SettlemintDetails> | undefined]
  > => {
    try {
      if (!wallet) {
        return [undefined, undefined]
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

      const uniqAddresses = new Set<string>()

      const fetchedMemberships = ownerOrMemberLogs.reduce<Memberships>(
        (previous, current) => {
          const contractAddress = current.address
          uniqAddresses.add(contractAddress)

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

      const settlemintDetails = new Map<string, SettlemintDetails>()

      for (const contractAddress of Array.from(uniqAddresses)) {
        const contract = SettleMint__factory.connect(
          contractAddress,
          web3Provider
        )

        const name = await contract.name()
        const members = await contract.getMembers()
        const owners = await contract.getOwners()

        settlemintDetails.set(contractAddress, {
          name,
          address: contractAddress,
          members,
          owners,
        })
      }

      return [fetchedMemberships, settlemintDetails]
    } catch (error) {
      console.log(error)
      return [undefined, undefined]
    }
  }, [wallet])

  useEffect(() => {
    let isMounted = true
    const doLoad = async () => {
      setIsLoading(true)
      const [newMemberships, settlemintDetails] = await fetchSettlemints()
      isMounted && setMemberships(newMemberships)
      isMounted && setMappedDetails(settlemintDetails)
      isMounted && setIsLoading(false)
    }

    doLoad()
    return () => {
      isMounted = false
    }
  }, [fetchSettlemints])

  return [memberships, mappedDetails, isLoading]
}
