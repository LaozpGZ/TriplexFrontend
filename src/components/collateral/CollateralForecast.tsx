'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AlertTriangle, TrendingUp, TrendingDown, PieChart, FileDown } from 'lucide-react'

// 如果recharts库不存在，我们创建一个模拟的图表组件
const MockChart = ({ className }: { className?: string }) => (
  <div className={`w-full h-64 border border-dashed border-muted-foreground rounded-md flex items-center justify-center p-4 ${className}`}>
    <div className="text-center">
      <PieChart className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">图表加载中或不可用</p>
      <p className="text-xs text-muted-foreground mt-2">请安装recharts库: npm install recharts</p>
    </div>
  </div>
)

const ChartComponent = typeof LineChart !== 'undefined' ? (
  ({ data, className }: { data: any[]; className?: string }) => (
    <ResponsiveContainer width="100%" height={300} className={className}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="健康率" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="right" type="monotone" dataKey="清算风险" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
) : MockChart

interface CollateralPredictionParams {
  aptPrice: number
  btcPrice: number
  ethPrice: number
  marketVolatility: number
  interestRate: number
  timeHorizon: number
}

export default function CollateralForecast() {
  const [params, setParams] = useState<CollateralPredictionParams>({
    aptPrice: 8.75,
    btcPrice: 67250.28,
    ethPrice: 3485.75,
    marketVolatility: 5,
    interestRate: 2.5,
    timeHorizon: 30
  })
  
  const [forecasts, setForecasts] = useState<any[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  
  // 更新单个参数
  const updateParam = (key: keyof CollateralPredictionParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }
  
  // 生成预测数据
  const generateForecast = () => {
    setIsCalculating(true)
    
    // 模拟计算延迟
    setTimeout(() => {
      const data = []
      
      // 基于当前参数生成模拟数据
      const initialHealthRatio = 236.65 // 当前健康率
      const liquidationThreshold = 150 // 清算阈值
      
      for (let i = 0; i <= params.timeHorizon; i += 5) {
        // 市场波动随时间增加而波动性增大
        const volatilityFactor = 1 + (params.marketVolatility / 10) * (i / params.timeHorizon)
        
        // 计算价格变化
        const priceChange = Math.sin(i / 10) * volatilityFactor * params.marketVolatility
        
        // 计算健康率变化
        const healthChange = priceChange * (1 - params.interestRate / 100)
        
        // 新的健康率
        const newHealthRatio = initialHealthRatio + healthChange
        
        // 清算风险
        const liquidationRisk = Math.max(0, Math.min(100, 100 - ((newHealthRatio - liquidationThreshold) / liquidationThreshold) * 100))
        
        data.push({
          name: `第${i}天`,
          健康率: newHealthRatio.toFixed(1),
          清算风险: liquidationRisk.toFixed(1),
          aptPrice: (params.aptPrice * (1 + priceChange / 100)).toFixed(2),
          btcPrice: (params.btcPrice * (1 + priceChange / 100)).toFixed(2),
          ethPrice: (params.ethPrice * (1 + priceChange / 100)).toFixed(2),
        })
      }
      
      setForecasts(data)
      setIsCalculating(false)
    }, 1000)
  }
  
  // 默认生成一次预测
  useEffect(() => {
    generateForecast()
  }, [])
  
  // 导出数据功能
  const exportData = () => {
    const dataStr = JSON.stringify(forecasts, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    
    const exportFileDefaultName = `抵押品预测_${new Date().toLocaleDateString('zh-CN')}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }
  
  // 计算当前风险状态
  const getCurrentRiskStatus = () => {
    const lastForecast = forecasts[forecasts.length - 1]
    if (!lastForecast) return { level: 'unknown', color: 'text-muted-foreground' }
    
    const liquidationRisk = parseFloat(lastForecast.清算风险)
    
    if (liquidationRisk > 70) {
      return { level: '高风险', color: 'text-red-500' }
    } else if (liquidationRisk > 30) {
      return { level: '中等风险', color: 'text-yellow-500' }
    } else {
      return { level: '低风险', color: 'text-green-500' }
    }
  }
  
  const riskStatus = getCurrentRiskStatus()
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle className="text-xl">抵押品预测分析</CardTitle>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateForecast}
              disabled={isCalculating}
            >
              {isCalculating ? '计算中...' : '重新计算'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportData}
              disabled={isCalculating || forecasts.length === 0}
            >
              <FileDown className="h-4 w-4 mr-1" />
              导出数据
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div>
              <Label className="mb-2 block">时间范围 (天)</Label>
              <div className="flex items-center">
                <Slider 
                  value={[params.timeHorizon]} 
                  min={7} 
                  max={90} 
                  step={1}
                  onValueChange={(values) => updateParam('timeHorizon', values[0])}
                  className="flex-1 mr-4" 
                />
                <Input 
                  type="number" 
                  value={params.timeHorizon} 
                  onChange={(e) => updateParam('timeHorizon', parseInt(e.target.value) || 30)}
                  className="w-16" 
                />
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">APT 价格预期 ($)</Label>
              <Input 
                type="number" 
                value={params.aptPrice} 
                onChange={(e) => updateParam('aptPrice', parseFloat(e.target.value) || 8.75)}
              />
            </div>
            
            <div>
              <Label className="mb-2 block">BTC 价格预期 ($)</Label>
              <Input 
                type="number" 
                value={params.btcPrice} 
                onChange={(e) => updateParam('btcPrice', parseFloat(e.target.value) || 67250.28)}
              />
            </div>
            
            <div>
              <Label className="mb-2 block">ETH 价格预期 ($)</Label>
              <Input 
                type="number" 
                value={params.ethPrice} 
                onChange={(e) => updateParam('ethPrice', parseFloat(e.target.value) || 3485.75)}
              />
            </div>
            
            <div>
              <Label className="mb-2 block">市场波动性 (1-10)</Label>
              <div className="flex items-center">
                <Slider 
                  value={[params.marketVolatility]} 
                  min={1} 
                  max={10} 
                  step={1}
                  onValueChange={(values) => updateParam('marketVolatility', values[0])}
                  className="flex-1 mr-4" 
                />
                <Input 
                  type="number" 
                  value={params.marketVolatility} 
                  onChange={(e) => updateParam('marketVolatility', parseInt(e.target.value) || 5)}
                  className="w-16" 
                />
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">借款利率 (%)</Label>
              <Input 
                type="number" 
                value={params.interestRate} 
                onChange={(e) => updateParam('interestRate', parseFloat(e.target.value) || 2.5)}
              />
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">预测结果</h3>
                <div className={`text-sm font-medium ${riskStatus.color}`}>
                  预测风险: {riskStatus.level}
                </div>
              </div>
              
              {forecasts.length > 0 ? (
                <ChartComponent data={forecasts} className="mt-4" />
              ) : (
                <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
                  <p className="text-muted-foreground">数据生成中...</p>
                </div>
              )}
            </div>
            
            {forecasts.length > 0 && (
              <div className="bg-muted/50 p-4 rounded-md">
                <h4 className="font-medium mb-2">预测分析结果</h4>
                <div className="text-sm space-y-2">
                  <p>
                    <span className="font-medium">预测期限:</span> {params.timeHorizon}天
                  </p>
                  <p>
                    <span className="font-medium">初始健康率:</span> {forecasts[0]?.健康率}%
                  </p>
                  <p>
                    <span className="font-medium">预测最终健康率:</span> {forecasts[forecasts.length - 1]?.健康率}%
                  </p>
                  <p>
                    <span className="font-medium">清算风险变化:</span> {forecasts[0]?.清算风险}% → {forecasts[forecasts.length - 1]?.清算风险}%
                    {parseFloat(forecasts[forecasts.length - 1]?.清算风险) > parseFloat(forecasts[0]?.清算风险) ? (
                      <TrendingUp className="inline h-4 w-4 ml-1 text-red-500" />
                    ) : (
                      <TrendingDown className="inline h-4 w-4 ml-1 text-green-500" />
                    )}
                  </p>
                </div>
                
                {parseFloat(forecasts[forecasts.length - 1]?.清算风险) > 50 && (
                  <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-md flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-700 dark:text-yellow-400">
                      <p className="font-medium">风险提示</p>
                      <p className="mt-1">根据您设置的参数，未来清算风险可能增加。建议考虑增加抵押品或减少借款，以降低潜在风险。</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 