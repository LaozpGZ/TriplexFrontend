'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface Asset {
  symbol: string
  price: number
}

interface PriceAlertModalProps {
  isOpen: boolean
  onClose: () => void
  asset: Asset | null
  onSave: (data: any) => void
}

export default function PriceAlertModal({
  isOpen,
  onClose,
  asset,
  onSave
}: PriceAlertModalProps) {
  const [alertPrice, setAlertPrice] = useState('')
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [browserEnabled, setBrowserEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [autoAddCollateral, setAutoAddCollateral] = useState(false)
  const [autoRepayDebt, setAutoRepayDebt] = useState(false)
  
  // 计算价格变动百分比
  const getPriceChangePercent = () => {
    if (!asset || !alertPrice || isNaN(parseFloat(alertPrice))) return 0
    
    const currentPrice = asset.price
    const targetPrice = parseFloat(alertPrice)
    const changePercent = ((targetPrice - currentPrice) / currentPrice) * 100
    
    return changePercent
  }
  
  // 处理保存预警设置
  const handleSave = () => {
    if (!asset || !alertPrice) return
    
    const data = {
      asset: asset.symbol,
      alertPrice: parseFloat(alertPrice),
      notifications: {
        email: emailEnabled,
        browser: browserEnabled,
        sms: smsEnabled
      },
      autoActions: {
        addCollateral: autoAddCollateral,
        repayDebt: autoRepayDebt
      }
    }
    
    onSave(data)
    onClose()
  }

  if (!asset) return null

  const changePercent = getPriceChangePercent()
  const isPriceDecrease = changePercent < 0
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>设置价格预警 - {asset.symbol}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label>当前价格</Label>
            <div className="text-2xl font-semibold">${asset.price.toFixed(2)}</div>
          </div>
          
          <div className="space-y-2">
            <Label className="mb-2 block">下跌预警</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="输入价格阈值"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                className="pr-12"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                USD
              </div>
            </div>
            {alertPrice && (
              <div className="text-sm text-muted-foreground">
                {isPriceDecrease ? '低于' : '高于'}当前价格 {Math.abs(changePercent).toFixed(1)}%
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <Label>预警方式</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={emailEnabled}
                  onCheckedChange={(checked: boolean) => setEmailEnabled(checked)}
                />
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  电子邮件通知
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="browser"
                  checked={browserEnabled}
                  onCheckedChange={(checked: boolean) => setBrowserEnabled(checked)}
                />
                <label
                  htmlFor="browser"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  浏览器通知
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms"
                  checked={smsEnabled}
                  onCheckedChange={(checked: boolean) => setSmsEnabled(checked)}
                />
                <label
                  htmlFor="sms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  短信通知
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>自动操作</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-add"
                  checked={autoAddCollateral}
                  onCheckedChange={(checked: boolean) => setAutoAddCollateral(checked)}
                />
                <label
                  htmlFor="auto-add"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  自动追加抵押品 (25 {asset.symbol})
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-repay"
                  checked={autoRepayDebt}
                  onCheckedChange={(checked: boolean) => setAutoRepayDebt(checked)}
                />
                <label
                  htmlFor="auto-repay"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  自动偿还部分债务 (500 trxUSD)
                </label>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            disabled={!alertPrice || isNaN(parseFloat(alertPrice))}
            onClick={handleSave}
          >
            保存预警设置
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 