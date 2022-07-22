import Onboard, { EIP1193Provider, OnboardAPI } from "@web3-onboard/core"
import { INFURA_TOKEN } from "src/config/constants"
import injectedModule from "@web3-onboard/injected-wallets"
import gnosisModule from "@web3-onboard/gnosis"
import { useState, useEffect } from "react"
import { getAddress } from "ethers/lib/utils"

export type ConnectedWallet = {
  label: string
  chainId: string
  address: string
  ens?: string
  provider: EIP1193Provider
}

const ETH_MAINNET_RPC = `https://mainnet.infura.io/v3/${INFURA_TOKEN}`
const ETH_RINKEBY_RPC = `https://rinkeby.infura.io/v3/${INFURA_TOKEN}`

const createOnboard = (): OnboardAPI => {
  const injected = injectedModule()
  const gnosis = gnosisModule()

  return Onboard({
    wallets: [injected, gnosis],
    chains: [
      {
        id: "0x1",
        token: "ETH",
        label: "Ethereum Mainnet",
        rpcUrl: ETH_MAINNET_RPC,
      },
      {
        id: "0x4",
        token: "rETH",
        label: "Ethereum Rinkeby Testnet",
        rpcUrl: ETH_RINKEBY_RPC,
      },
    ],
    appMetadata: {
      name: "537713 Mint",
      icon: "/icon.svg",
      description: "Track and settle group expenses",
      recommendedInjectedWallets: [
        { name: "MetaMask", url: "https://metamask.io" },
        { name: "Gnosis Safe", url: "https://gnosis-safe.io" },
      ],
    },
    accountCenter: {
      desktop: {
        position: "topRight",
        enabled: false,
        containerElement: "body",
      },
      mobile: {
        position: "topRight",
        enabled: false,
        containerElement: "body",
      },
    },
  })
}

let onboardSingleton: OnboardAPI | null = null

const initOnboardSingleton = (): OnboardAPI => {
  if (!onboardSingleton) {
    onboardSingleton = createOnboard()
  }
  return onboardSingleton
}

// Initialize an onboard singleton when chains are loaded
// Return a cached singleton if already initialized
export const useOnboard = (): OnboardAPI | null => {
  const [onboard, setOnboard] = useState<OnboardAPI | null>(null)

  useEffect(() => {
    setOnboard((prev) => prev || initOnboardSingleton())
  }, [])

  return onboard
}

export const getConnectedWallet = (
  wallets = onboardSingleton?.state.get().wallets
): ConnectedWallet | null => {
  if (!wallets) return null

  const primaryWallet = wallets[0]
  if (!primaryWallet) return null

  const account = primaryWallet?.accounts[0]
  if (!account) return null

  return {
    label: primaryWallet.label,
    address: getAddress(account.address),
    ens: account.ens?.name,
    chainId: Number(primaryWallet.chains[0].id).toString(10),
    provider: primaryWallet.provider,
  }
}
