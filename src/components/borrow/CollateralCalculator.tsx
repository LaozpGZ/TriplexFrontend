'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Calculator, RefreshCw, Info } from 'lucide-react'

export default function CollateralCalculator() {
  const [borrowAmount, setBorrowAmount] = useState('')
  const [collateralAmount, setCollateralAmount] = useState('')
  const [collateralRatio, setCollateralRatio] = useState(200)
  const [targetAsset, setTargetAsset] = useState('ETH')
  const [borrowAsset, setBorrowAsset] = useState('USDC')
  
  // 资产价格（在实际应用中应从API获取）
  const assetPrices = {
    'ETH': 1950,
    'BTC': 44280,
    'SOL': 98,
    'USDC': 1,
    'USDT': 1,
    'DAI': 1
  }
  
  // 当抵押率或借款金额变化时，重新计算所需抵押品
  useEffect(() => {
    if (borrowAmount && collateralRatio) {
      const borrowValue = parseFloat(borrowAmount)
      const requiredCollateralValue = borrowValue * (collateralRatio / 100)
      const requiredCollateralAmount = requiredCollateralValue / assetPrices[targetAsset as keyof typeof assetPrices]
      setCollateralAmount(requiredCollateralAmount.toFixed(6))
    }
  }, [borrowAmount, collateralRatio, targetAsset])
  
  // 当抵押品数量变化时，重新计算抵押率
  useEffect(() => {
    if (borrowAmount && collateralAmount) {
      const borrowValue = parseFloat(borrowAmount)
      const collateralValue = parseFloat(collateralAmount) * assetPrices[targetAsset as keyof typeof assetPrices]
      const calculatedRatio = (collateralValue / borrowValue) * 100
      setCollateralRatio(Math.round(calculatedRatio))
    }
  }, [collateralAmount, borrowAmount, targetAsset])
  
  // 重置表单
  const resetCalculator = () => {
    setBorrowAmount('')
    setCollateralAmount('')
    setCollateralRatio(200)
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">抵押品计算器</h2>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm flex items-center gap-1.5">
            借款金额
            <div className="group relative">
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              <div className="absolute left-0 w-48 p-2 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
                输入您想要借入的金额
              </div>
            </div>
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.00"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              className="flex-grow"
            />
            <div className="bg-secondary text-secondary-foreground flex items-center justify-center px-3 rounded-md min-w-20">
              {borrowAsset}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            建议抵押率: 150%-250%
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-sm flex items-center gap-1.5">
              目标抵押率
              <div className="group relative">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                <div className="absolute left-0 w-48 p-2 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
                  较高的抵押率可以降低清算风险，但会减少资本效率
                </div>
              </div>
            </Label>
            <span className={`text-sm font-medium ${
              collateralRatio >= 200 ? 'text-green-500' : 
              collateralRatio >= 150 ? 'text-amber-500' : 
              'text-red-500'
            }`}>
              {collateralRatio}%
            </span>
          </div>
          <Slider
            value={[collateralRatio]}
            min={120}
            max={300}
            step={5}
            onValueChange={(value) => setCollateralRatio(value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>最低 (120%)</span>
            <span>推荐 (200%)</span>
            <span>保守 (300%)</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-sm flex items-center gap-1.5">
            所需抵押品
            <div className="group relative">
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              <div className="absolute left-0 w-48 p-2 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
                基于您的借款金额和目标抵押率计算所需的抵押品数量
              </div>
            </div>
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.00"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              className="flex-grow"
            />
            <div className="bg-secondary text-secondary-foreground flex items-center justify-center px-3 rounded-md min-w-20">
              {targetAsset}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            价值 ≈ ${collateralAmount ? (parseFloat(collateralAmount) * assetPrices[targetAsset as keyof typeof assetPrices]).toFixed(2) : '0.00'}
          </div>
        </div>
        
        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">清算价格 ({targetAsset})</span>
            <span className="text-sm font-medium">
              ${borrowAmount && collateralAmount ? (
                (parseFloat(borrowAmount) / parseFloat(collateralAmount) * (150 / 100)).toFixed(2)
              ) : '0.00'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">当前价格 ({targetAsset})</span>
            <span className="text-sm font-medium">
              ${assetPrices[targetAsset as keyof typeof assetPrices].toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">安全缓冲区</span>
            <span className={`text-sm font-medium ${
              collateralRatio >= 200 ? 'text-green-500' : 
              collateralRatio >= 150 ? 'text-amber-500' : 
              'text-red-500'
            }`}>
              {borrowAmount && collateralAmount ? (
                `${(((assetPrices[targetAsset as keyof typeof assetPrices] / 
                    (parseFloat(borrowAmount) / parseFloat(collateralAmount) * (150 / 100))
                ) - 1) * 100).toFixed(2)}%`
              ) : '0.00%'}
            </span>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={resetCalculator}
        >
          <RefreshCw className="h-4 w-4" />
          重置计算器
        </Button>
      </div>
    </Card>
  )
} 