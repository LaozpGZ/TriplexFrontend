'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Info, Lock, ChevronDown, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface RateOption {
  id: string
  name: string
  apy: string
  stability: string
  recommended?: boolean
}

export default function LoanParameters() {
  // 贷款期限状态
  const [loanDuration, setLoanDuration] = useState(90) // 默认90天
  const [isOpenDuration, setIsOpenDuration] = useState(false)
  
  // 贷款利率类型
  const [selectedRateType, setSelectedRateType] = useState('variable')
  
  // 自动还款设置
  const [enableAutoRepay, setEnableAutoRepay] = useState(false)
  const [repaymentThreshold, setRepaymentThreshold] = useState(80) // 默认80%
  const [isOpenAutoRepay, setIsOpenAutoRepay] = useState(false)
  
  // 风险偏好设置
  const [riskLevel, setRiskLevel] = useState(50) // 默认中等风险
  
  // 利率选项
  const variableRateOptions: RateOption[] = [
    {
      id: 'var-aave',
      name: 'Aave V3',
      apy: '3.5%',
      stability: '高',
      recommended: true
    },
    {
      id: 'var-compound',
      name: 'Compound',
      apy: '4.2%',
      stability: '中'
    },
    {
      id: 'var-venus',
      name: 'Venus',
      apy: '4.8%',
      stability: '低'
    }
  ]
  
  const fixedRateOptions: RateOption[] = [
    {
      id: 'fix-90d',
      name: '90天锁定',
      apy: '5.2%',
      stability: '高',
      recommended: true
    },
    {
      id: 'fix-180d',
      name: '180天锁定',
      apy: '4.8%',
      stability: '高'
    },
    {
      id: 'fix-365d',
      name: '365天锁定',
      apy: '4.5%',
      stability: '高'
    }
  ]
  
  // 当前利率选项
  const [selectedVariableRate, setSelectedVariableRate] = useState(variableRateOptions[0].id)
  const [selectedFixedRate, setSelectedFixedRate] = useState(fixedRateOptions[0].id)
  
  // 获取当前选择的利率
  const getCurrentRate = () => {
    if (selectedRateType === 'variable') {
      return variableRateOptions.find(option => option.id === selectedVariableRate)?.apy || '0%'
    } else {
      return fixedRateOptions.find(option => option.id === selectedFixedRate)?.apy || '0%'
    }
  }
  
  // 获取风险评级
  const getRiskRating = () => {
    if (riskLevel < 30) return { level: '低风险', color: 'text-green-500' }
    if (riskLevel < 70) return { level: '中等风险', color: 'text-amber-500' }
    return { level: '高风险', color: 'text-red-500' }
  }
  
  const riskRating = getRiskRating()
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">贷款参数设置</h2>
      
      {/* 贷款期限设置 */}
      <Collapsible
        open={isOpenDuration}
        onOpenChange={setIsOpenDuration}
        className="mb-6 border border-border rounded-lg p-4"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <h3 className="font-medium">贷款期限</h3>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpenDuration ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-muted-foreground">当前期限</span>
          <span className="font-semibold">{loanDuration} 天</span>
        </div>
        
        <CollapsibleContent className="mt-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">期限长度</span>
                <span className="text-sm">{loanDuration} 天</span>
              </div>
              <Slider
                value={[loanDuration]}
                min={7}
                max={365}
                step={1}
                onValueChange={(value) => setLoanDuration(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>7天</span>
                <span>180天</span>
                <span>365天</span>
              </div>
            </div>
            
            <div className="bg-primary/5 p-3 rounded-lg flex items-start gap-2">
              <Info className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-sm">
                <p>贷款期限影响您的利率和清算风险。</p>
                <p className="mt-1">较短的期限通常有更高的利率，但提供更大的灵活性。</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className={loanDuration === 30 ? 'border-primary text-primary' : ''}
                onClick={() => setLoanDuration(30)}
              >
                30天
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={loanDuration === 90 ? 'border-primary text-primary' : ''}
                onClick={() => setLoanDuration(90)}
              >
                90天
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={loanDuration === 180 ? 'border-primary text-primary' : ''}
                onClick={() => setLoanDuration(180)}
              >
                180天
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* 利率类型设置 */}
      <div className="mb-6 border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-4 w-4 text-primary" />
          <h3 className="font-medium">利率类型</h3>
        </div>
        
        <Tabs value={selectedRateType} onValueChange={setSelectedRateType}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="variable">浮动利率</TabsTrigger>
            <TabsTrigger value="fixed">固定利率</TabsTrigger>
          </TabsList>
          
          <TabsContent value="variable">
            <div className="space-y-3">
              {variableRateOptions.map(option => (
                <div
                  key={option.id}
                  className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer hover:bg-accent/50 ${selectedVariableRate === option.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                  onClick={() => setSelectedVariableRate(option.id)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{option.name}</span>
                      {option.recommended && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">推荐</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">波动性: {option.stability}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{option.apy}</div>
                    <div className="text-xs text-muted-foreground">当前APY</div>
                  </div>
                </div>
              ))}
              
              <div className="bg-amber-500/10 p-3 rounded-lg flex items-start gap-2 mt-4">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                <div className="text-sm">
                  <p>浮动利率会随市场条件变化。市场波动时，您的利率可能会上升。</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="fixed">
            <div className="space-y-3">
              {fixedRateOptions.map(option => (
                <div
                  key={option.id}
                  className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer hover:bg-accent/50 ${selectedFixedRate === option.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                  onClick={() => setSelectedFixedRate(option.id)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{option.name}</span>
                      {option.recommended && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">推荐</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">提前还款费: 1.5%</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{option.apy}</div>
                    <div className="text-xs text-muted-foreground">锁定APY</div>
                  </div>
                </div>
              ))}
              
              <div className="bg-primary/5 p-3 rounded-lg flex items-start gap-2 mt-4">
                <Info className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-sm">
                  <p>固定利率在贷款期限内保持不变，提供稳定的还款计划，但通常比浮动利率高。</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* 自动还款设置 */}
      <Collapsible
        open={isOpenAutoRepay}
        onOpenChange={setIsOpenAutoRepay}
        className="mb-6 border border-border rounded-lg p-4"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <h3 className="font-medium">自动还款设置</h3>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpenAutoRepay ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-muted-foreground">自动还款</span>
          <Switch
            checked={enableAutoRepay}
            onCheckedChange={setEnableAutoRepay}
          />
        </div>
        
        <CollapsibleContent className="mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block text-muted-foreground">触发阈值</Label>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">当健康因子低于</span>
                  <span className="text-sm font-medium">{repaymentThreshold}%</span>
                </div>
                <Slider
                  value={[repaymentThreshold]}
                  min={10}
                  max={100}
                  step={5}
                  onValueChange={(value) => setRepaymentThreshold(value[0])}
                  className="w-full"
                  disabled={!enableAutoRepay}
                />
              </div>
              
              <div>
                <Label className="mb-2 block text-muted-foreground">还款来源</Label>
                <div className="flex gap-2">
                  <div className={`flex-1 border p-2 rounded-md ${enableAutoRepay ? 'cursor-pointer' : 'opacity-50'}`}>
                    <div className="text-sm font-medium">钱包余额</div>
                    <div className="text-xs text-muted-foreground">优先使用稳定币</div>
                  </div>
                  <div className={`flex-1 border p-2 rounded-md ${enableAutoRepay ? 'cursor-pointer' : 'opacity-50'}`}>
                    <div className="text-sm font-medium">储蓄账户</div>
                    <div className="text-xs text-muted-foreground">自动提取</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-500/10 p-3 rounded-lg flex items-start gap-2">
              <Info className="h-4 w-4 text-green-500 mt-0.5" />
              <div className="text-sm">
                <p>启用自动还款功能可以在健康因子下降时自动偿还部分贷款，降低清算风险。</p>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* 风险承受能力设置 */}
      <div className="mb-6 border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h3 className="font-medium">风险承受能力</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm">当前风险评级</span>
            <span className={`text-sm font-medium ${riskRating.color}`}>{riskRating.level}</span>
          </div>
          
          <Slider
            value={[riskLevel]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setRiskLevel(value[0])}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs">
            <span className="text-green-500">保守型</span>
            <span className="text-amber-500">平衡型</span>
            <span className="text-red-500">激进型</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 rounded-lg bg-card/50">
              <div className="text-sm font-medium mb-1">建议抵押率</div>
              <div className="text-lg font-semibold">
                {riskLevel < 30 ? '250%' : riskLevel < 70 ? '200%' : '150%'}
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-card/50">
              <div className="text-sm font-medium mb-1">清算缓冲区</div>
              <div className="text-lg font-semibold">
                {riskLevel < 30 ? '100%' : riskLevel < 70 ? '50%' : '20%'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 总结 */}
      <div className="bg-card/50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">贷款摘要</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">贷款期限</span>
            <span className="font-medium">{loanDuration} 天</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">利率类型</span>
            <span className="font-medium">{selectedRateType === 'variable' ? '浮动' : '固定'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">当前利率</span>
            <span className="font-medium">{getCurrentRate()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">自动还款</span>
            <span className="font-medium">{enableAutoRepay ? '已启用' : '已禁用'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">风险评级</span>
            <span className={`font-medium ${riskRating.color}`}>{riskRating.level}</span>
          </div>
        </div>
      </div>
    </Card>
  )
} 