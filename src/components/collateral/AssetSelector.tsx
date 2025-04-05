'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Asset {
  id: string
  symbol: string
  name: string
  type: string
  price: number
  icon: string
  minRatio: number
  liquidationThreshold: number
}

interface AssetSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (asset: Asset) => void
  title?: string
}

export default function AssetSelector({
  isOpen,
  onClose,
  onSelect,
  title = "选择资产"
}: AssetSelectorProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)
  
  // 示例资产数据
  const assets: Asset[] = [
    {
      id: '1',
      symbol: 'APT',
      name: 'APT',
      type: 'Aptos原生代币',
      price: 77.00,
      icon: 'A',
      minRatio: 150,
      liquidationThreshold: 140
    },
    {
      id: '2',
      symbol: 'WBTC',
      name: 'WBTC',
      type: '包装比特币',
      price: 35842.12,
      icon: 'BT',
      minRatio: 145,
      liquidationThreshold: 135
    },
    {
      id: '3',
      symbol: 'stAPT',
      name: 'stAPT',
      type: '质押APT',
      price: 78.75,
      icon: 'SA',
      minRatio: 155,
      liquidationThreshold: 145
    },
    {
      id: '4',
      symbol: 'SOL',
      name: 'SOL',
      type: 'Solana',
      price: 118.53,
      icon: 'S',
      minRatio: 150,
      liquidationThreshold: 140
    },
    {
      id: '5',
      symbol: 'ETH',
      name: 'ETH',
      type: '以太坊',
      price: 2345.67,
      icon: 'E',
      minRatio: 145,
      liquidationThreshold: 135
    }
  ]

  const handleSelect = (asset: Asset) => {
    setSelectedAssetId(asset.id)
    onSelect(asset)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
          {assets.map(asset => (
            <div
              key={asset.id}
              className={`flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors ${selectedAssetId === asset.id ? 'border-primary bg-primary/10' : 'border-transparent'}`}
              onClick={() => handleSelect(asset)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                  {asset.icon}
                </div>
                <div>
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-xs text-muted-foreground">{asset.type}</div>
                  <div className="text-xs text-muted-foreground mt-1">当前价格: ${asset.price.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="text-sm text-right text-muted-foreground">
                <div>最低抵押率: {asset.minRatio}%</div>
                <div>清算阈值: {asset.liquidationThreshold}%</div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 