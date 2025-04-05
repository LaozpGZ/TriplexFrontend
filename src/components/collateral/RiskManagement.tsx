'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { AlertTriangle, Info, TrendingDown, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function RiskManagement() {
  const [priceChange, setPriceChange] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState('all')
  
  // 风险参数
  const riskParams = {
    initialRatio: 173.1,
    currentRatio: 173.1 + (priceChange * 1.05), // 价格变动对抵押率的影响
    liquidationThreshold: 140,
    safetyBuffer: 33.1 + (priceChange * 1.05), // 安全缓冲区
    recommendedAction: priceChange < -15 ? '添加抵押品' : 
                       priceChange < -5 ? '观察市场' : 
                       '无需操作'
  }
  
  // 获取风险等级颜色
  const getRiskColor = (ratio: number, threshold: number) => {
    const buffer = ratio - threshold
    if (buffer > 30) return 'text-green-500'
    if (buffer > 15) return 'text-blue-500'
    if (buffer > 5) return 'text-amber-500'
    return 'text-red-500'
  }
  
  // 获取风险等级文本
  const getRiskLevelText = (ratio: number, threshold: number) => {
    const buffer = ratio - threshold
    if (buffer > 30) return '低风险'
    if (buffer > 15) return '中等风险'
    if (buffer > 5) return '高风险'
    return '极高风险'
  }
  
  return (
    <div className="space-y-6">
      <Card className="p-5 border-amber-500/20 bg-amber-500/5">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">风险提示</h3>
            <p className="text-sm text-muted-foreground">
              当您的抵押率低于清算阈值时，您的抵押品将面临被清算的风险。请密切关注市场波动，并及时调整您的抵押品或债务，以维持健康的抵押率。
            </p>
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="simulator">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="simulator">市场模拟器</TabsTrigger>
          <TabsTrigger value="params">风险参数</TabsTrigger>
          <TabsTrigger value="alerts">预警设置</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simulator" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">市场价格波动模拟</h3>
                <p className="text-sm text-muted-foreground">模拟市场价格变动对您抵押品的影响</p>
              </div>
              <div className="flex items-center gap-2">
                {priceChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : priceChange < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <Info className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={`font-medium ${
                  priceChange > 0 ? 'text-green-500' : 
                  priceChange < 0 ? 'text-red-500' : 
                  'text-muted-foreground'
                }`}>
                  {priceChange > 0 ? '+' : ''}{priceChange}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">-50%</span>
              <Slider
                value={[priceChange]}
                min={-50}
                max={50}
                step={1}
                onValueChange={(value) => setPriceChange(value[0])}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">+50%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border">
              <div className="text-sm text-muted-foreground mb-1">模拟后抵押率</div>
              <div className={`text-xl font-semibold ${getRiskColor(riskParams.currentRatio, riskParams.liquidationThreshold)}`}>
                {riskParams.currentRatio.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                当前: {riskParams.initialRatio.toFixed(1)}% | 阈值: {riskParams.liquidationThreshold}%
              </div>
            </Card>
            
            <Card className="p-4 border">
              <div className="text-sm text-muted-foreground mb-1">安全缓冲区</div>
              <div className={`text-xl font-semibold ${getRiskColor(riskParams.currentRatio, riskParams.liquidationThreshold)}`}>
                {riskParams.safetyBuffer.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {getRiskLevelText(riskParams.currentRatio, riskParams.liquidationThreshold)}
              </div>
            </Card>
            
            <Card className="p-4 border">
              <div className="text-sm text-muted-foreground mb-1">建议操作</div>
              <div className={`text-xl font-semibold ${
                riskParams.recommendedAction === '添加抵押品' ? 'text-red-500' :
                riskParams.recommendedAction === '观察市场' ? 'text-amber-500' :
                'text-green-500'
              }`}>
                {riskParams.recommendedAction}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                基于当前模拟场景
              </div>
            </Card>
          </div>
          
          <Card className="p-4 border bg-secondary/40">
            <h3 className="font-medium mb-2">避免清算的风险管理建议</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>保持抵押率在{riskParams.liquidationThreshold + 30}%以上，以应对市场波动</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>设置抵押率预警，在接近清算阈值时及时获得通知</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>分散抵押品种类，减少单一资产价格波动带来的风险</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>定期监控市场趋势，及时调整抵押品和债务</span>
              </li>
            </ul>
          </Card>
          
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setPriceChange(0)}
            >
              重置模拟
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="params" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border">
              <h3 className="font-medium mb-3">资产风险参数</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>APT</span>
                  <span className="text-muted-foreground">140% 清算阈值</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>WBTC</span>
                  <span className="text-muted-foreground">135% 清算阈值</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>stAPT</span>
                  <span className="text-muted-foreground">145% 清算阈值</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>SOL</span>
                  <span className="text-muted-foreground">150% 清算阈值</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 border">
              <h3 className="font-medium mb-3">借贷上限</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>APT</span>
                  <span className="text-muted-foreground">最大抵押率 75%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>WBTC</span>
                  <span className="text-muted-foreground">最大抵押率 80%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>stAPT</span>
                  <span className="text-muted-foreground">最大抵押率 70%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>SOL</span>
                  <span className="text-muted-foreground">最大抵押率 65%</span>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-4 border">
            <h3 className="font-medium mb-3">清算惩罚</h3>
            <p className="text-sm text-muted-foreground mb-4">
              当抵押率低于清算阈值时，清算者可以偿还部分贷款并获得一定比例的额外抵押品作为奖励。
            </p>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>清算奖励</span>
                <span className="text-muted-foreground">5-10%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>清算费用</span>
                <span className="text-muted-foreground">0.5-2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>最大清算比例</span>
                <span className="text-muted-foreground">50%</span>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-6 pt-4">
          <Card className="p-4 border">
            <h3 className="font-medium mb-3">预警设置</h3>
            <p className="text-sm text-muted-foreground mb-4">
              设置抵押率预警阈值，当抵押率低于设定值时，系统将通过邮件或短信通知您。
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">预警抵押率</Label>
                <div className="flex gap-2">
                  <Input type="number" defaultValue="150" className="w-24" />
                  <span className="flex items-center text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">建议设置为清算阈值上方10-20%</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">通知方式</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="email" className="rounded border-muted" defaultChecked />
                    <label htmlFor="email" className="text-sm">电子邮件</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="sms" className="rounded border-muted" />
                    <label htmlFor="sms" className="text-sm">短信</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="push" className="rounded border-muted" defaultChecked />
                    <label htmlFor="push" className="text-sm">APP推送</label>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">保存预警设置</Button>
            </div>
          </Card>
          
          <Card className="p-4 border">
            <h3 className="font-medium mb-3">当前预警状态</h3>
            <div className="flex items-center gap-3 text-green-500 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>所有抵押头寸安全</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              您当前没有触发预警的抵押头寸。继续保持良好的风险管理习惯。
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 