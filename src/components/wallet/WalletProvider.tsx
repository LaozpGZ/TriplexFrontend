'use client'

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { ReactNode, useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast"
import { Network } from "@aptos-labs/ts-sdk"

// 定义API键和网络配置
const network = Network.TESTNET // 或者 MAINNET，根据需要设置

// 获取应用图标URL
let dappImageURI: string | undefined
if (typeof window !== "undefined") {
  dappImageURI = `${window.location.origin}${window.location.pathname}favicon.ico`
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network,
        aptosApiKeys: {
          mainnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_MAINNET,
          testnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_TESTNET,
          devnet: process.env.NEXT_PUBLIC_APTOS_API_KEY_DEVNET,
        },
        aptosConnect: {
          dappId: process.env.NEXT_PUBLIC_APTOS_DAPP_ID,
          dappImageURI,
        },
        // 其他钱包配置
        mizuwallet: {
          manifestURL: "https://assets.mz.xyz/static/config/mizuwallet-connect-manifest.json",
        },
      }}
      onError={(error) => {
        toast({
          variant: "destructive",
          title: "钱包错误",
          description: error || "未知钱包错误",
        })
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  )
} 