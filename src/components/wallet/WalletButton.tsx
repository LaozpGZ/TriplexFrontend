'use client'

import { useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { Wallet, ChevronDown, Copy, LogOut } from 'lucide-react'
import { truncateAddress } from '@aptos-labs/wallet-adapter-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '../ui/use-toast'

export function WalletButton() {
  const { connected, account, disconnect, wallets, connect } = useWallet()
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false)
  const { toast } = useToast()

  // 连接已安装的钱包
  const handleConnect = async (walletName: string) => {
    const selectedWallet = wallets.find(wallet => wallet.name === walletName)
    if (selectedWallet) {
      try {
        await connect(walletName)
        setIsWalletSelectorOpen(false)
      } catch (error) {
        console.error('连接钱包失败:', error)
      }
    }
  }

  // 复制地址
  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address.toString())
      toast({
        title: '已复制',
        description: '钱包地址已复制到剪贴板'
      })
    }
  }

  // 断开连接
  const handleDisconnect = () => {
    disconnect()
    toast({
      title: '已断开连接',
      description: '您的钱包已断开连接'
    })
  }

  return (
    <>
      {!connected ? (
        <Dialog open={isWalletSelectorOpen} onOpenChange={setIsWalletSelectorOpen}>
          <DialogTrigger asChild>
            <Button>
              <Wallet className="mr-2 h-4 w-4" />
              连接钱包
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">连接钱包</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.name}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleConnect(wallet.name)}
                >
                  {wallet.icon && (
                    <img 
                      src={wallet.icon} 
                      alt={`${wallet.name} 图标`} 
                      className="mr-2 h-5 w-5" 
                    />
                  )}
                  {wallet.name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {account && truncateAddress(account.address.toString())}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={copyAddress}>
              <Copy className="mr-2 h-4 w-4" />
              复制地址
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDisconnect}>
              <LogOut className="mr-2 h-4 w-4" />
              断开连接
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
} 