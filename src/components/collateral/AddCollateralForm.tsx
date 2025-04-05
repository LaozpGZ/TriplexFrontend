'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Info, ChevronDown, Wallet } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Asset = {
  id: string
  name: string
  symbol: string
  logo: string
  price: number
  balance: number
  maxLTV: number
}

export default function AddCollateralForm() {
  const [asset, setAsset] = useState<Asset | null>(null)
  const [amount, setAmount] = useState<string>('')
  const [ltv, setLtv] = useState<number>(50)
  const [borrowAmount, setBorrowAmount] = useState<string>('')
  
  // 示例资产数据
  const assets: Asset[] = [
    { id: '1', name: 'Aptos', symbol: 'APT', logo: '/assets/apt.png', price: 15.82, balance: 213.45, maxLTV: 75 },
    { id: '2', name: 'Bitcoin (Wrapped)', symbol: 'WBTC', logo: '/assets/wbtc.png', price: 62304.21, balance: 0.45, maxLTV: 80 },
    { id: '3', name: 'Staked Aptos', symbol: 'stAPT', logo: '/assets/stapt.png', price: 16.73, balance: 156.78, maxLTV: 70 },
    { id: '4', name: 'Solana', symbol: 'SOL', logo: '/assets/sol.png', price: 178.59, balance: 34.12, maxLTV: 65 },
  ]
  
  // 计算当前可借出金额
  const calculateBorrowLimit = () => {
    if (!asset || !amount || isNaN(parseFloat(amount))) return '0'
    
    const collateralValue = parseFloat(amount) * asset.price
    const maxBorrowValue = collateralValue * (ltv / 100)
    return maxBorrowValue.toFixed(2)
  }
  
  // 更新可借出金额
  const handleAmountChange = (value: string) => {
    setAmount(value)
    setBorrowAmount(calculateBorrowLimit())
  }
  
  // 更新 LTV 时更新借出金额
  const handleLtvChange = (value: number[]) => {
    const newLtv = value[0]
    setLtv(newLtv)
    
    if (asset && amount && !isNaN(parseFloat(amount))) {
      const collateralValue = parseFloat(amount) * asset.price
      const maxBorrowValue = collateralValue * (newLtv / 100)
      setBorrowAmount(maxBorrowValue.toFixed(2))
    }
  }
  
  // 计算抵押率
  const calculateCollateralRatio = () => {
    if (!asset || !amount || !borrowAmount || isNaN(parseFloat(amount)) || isNaN(parseFloat(borrowAmount)) || parseFloat(borrowAmount) === 0) {
      return 'N/A'
    }
    
    const collateralValue = parseFloat(amount) * asset.price
    const ratio = (collateralValue / parseFloat(borrowAmount)) * 100
    return ratio.toFixed(1) + '%'
  }
  
  // 处理资产选择
  const handleAssetSelect = (value: string) => {
    const selectedAsset = assets.find(a => a.id === value) || null
    setAsset(selectedAsset)
    setAmount('')
    setBorrowAmount('')
  }
  
  // 设置最大金额
  const setMaxAmount = () => {
    if (!asset) return
    
    setAmount(asset.balance.toString())
    const maxBorrowValue = asset.balance * asset.price * (ltv / 100)
    setBorrowAmount(maxBorrowValue.toFixed(2))
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">选择抵押资产</Label>
            <Select onValueChange={handleAssetSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择资产" />
              </SelectTrigger>
              <SelectContent>
                {assets.map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-muted"></div>
                      <span>{asset.name}</span>
                      <span className="text-muted-foreground">({asset.symbol})</span>
                      <span className="ml-auto text-muted-foreground">{asset.balance} 可用</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {asset && (
            <>
              <div>
                <div className="flex justify-between mb-2">
                  <Label>抵押数量</Label>
                  <Button variant="ghost" className="h-auto p-0 text-xs text-primary" onClick={setMaxAmount}>
                    最大 {asset.balance} {asset.symbol}
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder={`输入${asset.symbol}数量`}
                    className="pr-16"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                    {asset.symbol}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ ${amount ? (parseFloat(amount) * asset.price).toFixed(2) : '0.00'} USD
                </p>
              </div>
              
              <div className="py-2">
                <div className="flex justify-between mb-2">
                  <Label>贷款价值比 (LTV)</Label>
                  <span className="text-sm text-muted-foreground">最大 {asset.maxLTV}%</span>
                </div>
                <div className="space-y-4">
                  <Slider
                    value={[ltv]}
                    min={0}
                    max={asset.maxLTV}
                    step={1}
                    onValueChange={handleLtvChange}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">保守</span>
                    <span className="text-sm font-medium">{ltv}%</span>
                    <span className="text-xs text-muted-foreground">激进</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="space-y-4">
          {asset && (
            <>
              <div>
                <Label className="mb-2 block">借出金额</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    placeholder="借出金额"
                    className="pr-16"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                    trxUSD
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    最大借出: {calculateBorrowLimit()} trxUSD
                  </p>
                  <p className="text-xs text-muted-foreground">
                    抵押率: {calculateCollateralRatio()}
                  </p>
                </div>
              </div>
              
              <Card className="p-4 bg-secondary/40 border">
                <h3 className="font-medium mb-2">头寸信息</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">抵押资产</span>
                    <span className="text-sm font-medium">{amount || '0'} {asset.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">抵押价值</span>
                    <span className="text-sm font-medium">${amount ? (parseFloat(amount) * asset.price).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">借出金额</span>
                    <span className="text-sm font-medium">{borrowAmount || '0'} trxUSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">抵押率</span>
                    <span className="text-sm font-medium">{calculateCollateralRatio()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">清算阈值</span>
                    <span className="text-sm font-medium">140%</span>
                  </div>
                </div>
              </Card>
              
              <div className="flex flex-col gap-2 mt-4">
                <Button className="w-full" disabled={!asset || !amount || !borrowAmount || parseFloat(amount) <= 0}>
                  确认并提交
                </Button>
                <Button variant="outline" className="w-full">
                  仅添加抵押品
                </Button>
              </div>
            </>
          )}
          
          {!asset && (
            <Card className="p-4 border h-full flex items-center justify-center bg-secondary/20">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">选择抵押资产</h3>
                <p className="text-sm text-muted-foreground">
                  请从左侧选择您想要添加为抵押品的资产
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      <Card className="p-4 border-blue-500/20 bg-blue-500/5">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">抵押管理提示</h3>
            <p className="text-sm text-muted-foreground">
              保持健康的抵押率是避免清算的关键。建议您的抵押率始终保持在160%以上，以应对市场波动。您可以随时添加更多抵押品或还款来提高抵押率。
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
} 