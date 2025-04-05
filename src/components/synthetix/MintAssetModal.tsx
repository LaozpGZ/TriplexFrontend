'use client'

import { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SyntheticAsset } from '@/types/synthetix'
import { Slider } from '@/components/ui/slider'
import { 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Info, 
  Loader2, 
  LucideDollarSign, 
  PlusCircle, 
  Shield 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface MintAssetModalProps {
  asset: SyntheticAsset | null
  isOpen: boolean
  onClose: () => void
  onMint: (asset: SyntheticAsset, amount: number) => void
}

// 可用的抵押品类型
const COLLATERAL_TYPES = [
  { id: 'usdc', name: 'USDC', icon: '💵', rate: 1.0 },
  { id: 'usdt', name: 'USDT', icon: '💴', rate: 1.0 },
  { id: 'dai', name: 'DAI', icon: '💶', rate: 1.0 },
  { id: 'apt', name: 'APT', icon: '🪙', rate: 7.95 }
]

export function MintAssetModal({ asset, isOpen, onClose, onMint }: MintAssetModalProps) {
  const [mintAmount, setMintAmount] = useState<string>('')
  const [collateralType, setCollateralType] = useState('usdc')
  const [collateralRatio, setCollateralRatio] = useState(200)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [estimatedFee, setEstimatedFee] = useState(0)
  const [estimatedGas, setEstimatedGas] = useState(0.025)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [sliderValues, setSliderValues] = useState<number[]>([200])

  // 重置表单
  useEffect(() => {
    if (isOpen) {
      setMintAmount('')
      setCollateralType('usdc')
      setCollateralRatio(200)
      setErrors({})
      setShowAdvanced(false)
      setSliderValues([200])
    }
  }, [isOpen])

  // 计算费用
  useEffect(() => {
    if (!asset || !mintAmount || isNaN(parseFloat(mintAmount))) {
      setEstimatedFee(0)
      return
    }
    
    // 铸造费率 0.3%
    const amount = parseFloat(mintAmount)
    const fee = amount * asset.price * 0.003
    setEstimatedFee(fee)
  }, [mintAmount, asset])
  
  // 抵押品价值计算
  const getCollateralValue = () => {
    if (!asset || !mintAmount || isNaN(parseFloat(mintAmount))) return 0
    
    const amount = parseFloat(mintAmount)
    const selectedCollateral = COLLATERAL_TYPES.find(c => c.id === collateralType)
    
    if (!selectedCollateral) return 0
    
    // 抵押品价值 = 铸造资产价值 * 抵押率 / 100
    const assetValue = amount * asset.price
    return (assetValue * collateralRatio / 100)
  }
  
  // 需要的抵押品数量
  const getRequiredCollateral = () => {
    const collateralValue = getCollateralValue()
    const selectedCollateral = COLLATERAL_TYPES.find(c => c.id === collateralType)
    
    if (!selectedCollateral || collateralValue === 0) return 0
    
    // 需要的抵押品数量 = 抵押品价值 / 抵押品汇率
    return collateralValue / selectedCollateral.rate
  }

  // 表单验证
  const validate = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!mintAmount) {
      newErrors.amount = '请输入铸造数量'
    } else if (isNaN(parseFloat(mintAmount)) || parseFloat(mintAmount) <= 0) {
      newErrors.amount = '请输入有效的铸造数量'
    } else if (parseFloat(mintAmount) > 10000) {
      newErrors.amount = '单次铸造数量不能超过10,000'
    }
    
    if (collateralRatio < 150) {
      newErrors.ratio = '抵押率不能低于150%'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理铸造提交
  const handleSubmit = async () => {
    if (!asset) return
    
    if (!validate()) return
    
    try {
      setIsSubmitting(true)
      
      // 模拟网络请求
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const amount = parseFloat(mintAmount)
      onMint(asset, amount)
      onClose()
    } catch (error) {
      console.error('铸造失败:', error)
      setErrors({ submit: '铸造失败，请重试' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理抵押率滑块变化
  const handleSliderChange = (values: number[]) => {
    setSliderValues(values)
    setCollateralRatio(values[0])
  }

  // 抵押率颜色
  const getRatioColor = () => {
    if (collateralRatio < 150) return 'text-destructive'
    if (collateralRatio < 180) return 'text-yellow-500'
    if (collateralRatio < 200) return 'text-yellow-400'
    if (collateralRatio >= 250) return 'text-green-500'
    return 'text-primary'
  }
  
  // 抵押率状态
  const getRatioStatus = () => {
    if (collateralRatio < 150) return '风险过高'
    if (collateralRatio < 180) return '较高风险'
    if (collateralRatio < 200) return '中等风险'
    if (collateralRatio < 250) return '低风险'
    return '非常安全'
  }
  
  // 清算价格
  const getLiquidationPrice = () => {
    if (!asset || !mintAmount || isNaN(parseFloat(mintAmount))) return 0
    
    // 清算价格 = 当前价格 * 150 / 抵押率
    return asset.price * 150 / collateralRatio
  }

  if (!asset) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border overflow-hidden">
              <img 
                src={asset.icon} 
                alt={asset.symbol} 
                className="h-5 w-5" 
                onError={(e) => {
                  e.currentTarget.src = "";
                  e.currentTarget.textContent = asset.symbol.slice(0, 2);
                }}
              />
            </div>
            铸造{asset.symbol}
          </DialogTitle>
          <DialogDescription>
            您正在铸造{asset.name}，当前价格 ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* 铸造数量输入 */}
          <div className="space-y-2">
            <Label htmlFor="mint-amount">
              铸造数量 <span className="text-muted-foreground text-xs">({asset.symbol})</span>
            </Label>
            <div className="relative">
              <Input
                id="mint-amount"
                type="text"
                placeholder="输入铸造数量"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                className={cn(errors.amount && "border-destructive")}
              />
              <div className="absolute right-3 top-2.5 text-sm text-muted-foreground">
                {asset.symbol}
              </div>
            </div>
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount}</p>
            )}
            {mintAmount && !isNaN(parseFloat(mintAmount)) && (
              <div className="text-sm text-muted-foreground">
                ≈ ${(parseFloat(mintAmount) * asset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </div>
            )}
          </div>
          
          {/* 抵押品类型选择 */}
          <div className="space-y-2">
            <Label htmlFor="collateral-type">抵押品类型</Label>
            <Select value={collateralType} onValueChange={setCollateralType}>
              <SelectTrigger id="collateral-type">
                <SelectValue placeholder="选择抵押品类型" />
              </SelectTrigger>
              <SelectContent>
                {COLLATERAL_TYPES.map(collateral => (
                  <SelectItem key={collateral.id} value={collateral.id}>
                    <div className="flex items-center">
                      <span className="mr-2">{collateral.icon}</span>
                      {collateral.name}
                      <span className="ml-2 text-muted-foreground text-xs">
                        (${collateral.rate.toFixed(2)})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* 抵押率设置 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="collateral-ratio">抵押率</Label>
              <div className={cn("text-sm font-medium", getRatioColor())}>
                {collateralRatio}% ({getRatioStatus()})
              </div>
            </div>
            
            <Slider
              min={130}
              max={300}
              step={5}
              value={sliderValues}
              onValueChange={handleSliderChange}
              className={cn(
                "cursor-pointer",
                collateralRatio < 150 && "text-destructive"
              )}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>130%</span>
              <span>150%</span>
              <span>200%</span>
              <span>250%</span>
              <span>300%</span>
            </div>
            
            {collateralRatio < 150 && (
              <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded-md">
                <AlertCircle className="h-4 w-4" />
                抵押率必须至少为150%才能铸造资产
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">清算价格：</span>
              <span className="font-medium">${getLiquidationPrice().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          
          {/* 抵押品和铸造资产信息摘要 */}
          <div className="rounded-md border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">需要抵押品：</span>
              <div className="font-medium">
                {getRequiredCollateral().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {COLLATERAL_TYPES.find(c => c.id === collateralType)?.name}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">铸造费用(0.3%)：</span>
              <div className="font-medium">
                ${estimatedFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">预估Gas费用：</span>
              <div className="font-medium">
                ${estimatedGas.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
              </div>
            </div>
            <div className="h-px bg-border my-2"></div>
            <div className="flex justify-between items-center font-medium">
              <span>总成本：</span>
              <div>
                ${(getCollateralValue() + estimatedFee + estimatedGas).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          
          {/* 高级选项 */}
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced">
              <AccordionTrigger className="py-2">
                <span className="text-sm">高级选项</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 py-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 p-2 rounded-md">
                    <Info className="h-4 w-4 text-primary" />
                    高级选项允许您设置更多铸造参数，适合有经验的用户
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slippage">滑点容忍度</Label>
                    <Select defaultValue="0.5">
                      <SelectTrigger id="slippage">
                        <SelectValue placeholder="选择滑点容忍度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.1">0.1%</SelectItem>
                        <SelectItem value="0.5">0.5%</SelectItem>
                        <SelectItem value="1.0">1.0%</SelectItem>
                        <SelectItem value="2.0">2.0%</SelectItem>
                        <SelectItem value="custom">自定义</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deadline">交易截止时间</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="deadline">
                        <SelectValue placeholder="选择交易截止时间" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10分钟</SelectItem>
                        <SelectItem value="20">20分钟</SelectItem>
                        <SelectItem value="30">30分钟</SelectItem>
                        <SelectItem value="60">60分钟</SelectItem>
                        <SelectItem value="custom">自定义</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {errors.submit && (
          <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded-md mb-4">
            <AlertCircle className="h-4 w-4" />
            {errors.submit}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            取消
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || collateralRatio < 150 || !mintAmount || isNaN(parseFloat(mintAmount)) || parseFloat(mintAmount) <= 0}
            className="min-w-24"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : (
              '确认铸造'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 