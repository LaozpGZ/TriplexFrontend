'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Asset {
  symbol: string
  balance: number
  currentRatio: number
  liquidationThreshold: number
}

interface AddCollateralModalProps {
  isOpen: boolean
  onClose: () => void
  asset: Asset | null
  onConfirm: (amount: string) => void
}

export default function AddCollateralModal({
  isOpen,
  onClose,
  asset,
  onConfirm
}: AddCollateralModalProps) {
  const [amount, setAmount] = useState('')
  const [newRatio, setNewRatio] = useState(0)
  const [healthPercent, setHealthPercent] = useState(0)
  const [healthStatus, setHealthStatus] = useState<'safe' | 'caution' | 'danger'>('safe')
  
  // 计算新的抵押率和健康度
  useEffect(() => {
    if (!asset || !amount || isNaN(parseFloat(amount))) {
      setNewRatio(asset?.currentRatio || 0)
      setHealthPercent(getHealthPercent(asset?.currentRatio || 0, asset?.liquidationThreshold || 0))
      updateHealthStatus(asset?.currentRatio || 0, asset?.liquidationThreshold || 0)
      return
    }
    
    // 模拟计算新的抵押率 (假设每追加1单位资产增加0.5%抵押率)
    const additionalRatio = parseFloat(amount) * 0.5
    const calculatedRatio = (asset?.currentRatio || 0) + additionalRatio
    setNewRatio(calculatedRatio)
    
    // 计算健康度百分比
    setHealthPercent(getHealthPercent(calculatedRatio, asset?.liquidationThreshold || 0))
    
    // 更新健康状态
    updateHealthStatus(calculatedRatio, asset?.liquidationThreshold || 0)
  }, [amount, asset])
  
  // 根据抵押率和清算阈值计算健康度百分比
  const getHealthPercent = (ratio: number, threshold: number) => {
    const bufferSize = ratio - threshold
    
    if (bufferSize <= 0) return 10 // 至少显示一点进度
    if (bufferSize >= 60) return 100 // 最大100%
    
    // 映射到10-100之间
    return Math.round(10 + ((bufferSize / 60) * 90))
  }
  
  // 更新健康状态
  const updateHealthStatus = (ratio: number, threshold: number) => {
    const buffer = ratio - threshold
    
    if (buffer > 30) {
      setHealthStatus('safe')
    } else if (buffer > 10) {
      setHealthStatus('caution')
    } else {
      setHealthStatus('danger')
    }
  }
  
  // 设置最大金额
  const setMaxAmount = () => {
    if (asset) {
      setAmount(asset.balance.toString())
    }
  }
  
  // 处理确认追加抵押品
  const handleConfirm = () => {
    if (amount && parseFloat(amount) > 0) {
      onConfirm(amount)
      setAmount('')
      onClose()
    }
  }
  
  // 获取健康度颜色类名
  const getHealthColorClass = () => {
    switch (healthStatus) {
      case 'safe': return 'bg-green-500'
      case 'caution': return 'bg-amber-500'
      case 'danger': return 'bg-red-500'
      default: return 'bg-muted'
    }
  }
  
  // 获取健康度文本颜色类名
  const getHealthTextColorClass = () => {
    switch (healthStatus) {
      case 'safe': return 'text-green-500'
      case 'caution': return 'text-amber-500'
      case 'danger': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }
  
  // 获取健康状态文本
  const getHealthStatusText = () => {
    switch (healthStatus) {
      case 'safe': return '安全'
      case 'caution': return '注意'
      case 'danger': return '危险'
      default: return '-'
    }
  }

  if (!asset) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>追加抵押品 - {asset.symbol}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>追加数量</Label>
              <div className="text-sm text-muted-foreground">
                钱包余额: {asset.balance} {asset.symbol}
              </div>
            </div>
            
            <div className="relative">
              <Input
                type="text"
                placeholder={`输入${asset.symbol}数量`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-16"
              />
              <Button 
                variant="ghost" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-xs"
                onClick={setMaxAmount}
              >
                最大
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>更新后抵押率</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded bg-secondary p-2">
                {newRatio.toFixed(1)}%
              </div>
              <div className="text-muted-foreground text-sm">
                当前: {asset.currentRatio}%
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full ${getHealthColorClass()}`} 
                style={{ width: `${healthPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className={getHealthTextColorClass()}>
                {healthPercent}%
              </span>
              <span className="text-muted-foreground">
                {getHealthStatusText()} | 清算阈值: {asset.liquidationThreshold}%
              </span>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            disabled={!amount || parseFloat(amount) <= 0}
            onClick={handleConfirm}
          >
            确认追加抵押品
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 