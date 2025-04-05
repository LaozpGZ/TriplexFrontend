'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, ReferenceLine, TooltipProps
} from 'recharts'
import { Lightbulb, RefreshCw } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// 模拟数据类型
interface SimulationData {
  days: number
  collateralValue: number
  borrowValue: number
  healthFactor: number
}

export default function BorrowSimulator() {
  // 模拟参数
  const [selectedScenario, setSelectedScenario] = useState('bull')
  const [collateralAmount, setCollateralAmount] = useState('1')
  const [borrowAmount, setBorrowAmount] = useState('1000')
  const [marketVariation, setMarketVariation] = useState(20)
  const [simulationPeriod, setSimulationPeriod] = useState(30)
  
  // 生成模拟数据
  const generateSimulationData = (): SimulationData[] => {
    const data: SimulationData[] = []
    
    // 基本参数
    const startCollateralValue = parseFloat(collateralAmount) * 1950 // 假设是ETH
    const startBorrowValue = parseFloat(borrowAmount)
    const startHealthFactor = startCollateralValue * 0.8 / startBorrowValue
    
    // 场景参数 - 每日价格变动百分比
    let dailyChange: number
    switch(selectedScenario) {
      case 'bull':
        dailyChange = 0.7 + (Math.random() * 0.2)
        break
      case 'bear':
        dailyChange = -0.5 - (Math.random() * 0.3)
        break
      case 'volatile':
        dailyChange = 0 // 将在每天单独计算
        break
      default:
        dailyChange = 0.1
    }
    
    // 生成每日数据
    let currentCollateralValue = startCollateralValue
    const borrowValue = startBorrowValue // 借款值保持不变
    
    for (let day = 0; day <= simulationPeriod; day++) {
      // 考虑波动性
      let todayChange = dailyChange
      if (selectedScenario === 'volatile') {
        // 高波动性模式：每天随机上下波动
        todayChange = (Math.random() * 2 - 1) * (marketVariation / 100)
      }
      
      // 计算健康因子
      const healthFactor = currentCollateralValue * 0.8 / borrowValue
      
      data.push({
        days: day,
        collateralValue: currentCollateralValue,
        borrowValue,
        healthFactor
      })
      
      // 更新抵押品价值
      currentCollateralValue = currentCollateralValue * (1 + todayChange / 100)
    }
    
    return data
  }
  
  const [simulationData, setSimulationData] = useState<SimulationData[]>(generateSimulationData())
  
  // 处理模拟运行
  const handleRunSimulation = () => {
    setSimulationData(generateSimulationData())
  }
  
  // 重置模拟器
  const handleResetSimulation = () => {
    setSelectedScenario('bull')
    setCollateralAmount('1')
    setBorrowAmount('1000')
    setMarketVariation(20)
    setSimulationPeriod(30)
    setSimulationData(generateSimulationData())
  }
  
  // 找到最低健康因子
  const lowestHealthFactor = Math.min(...simulationData.map(d => d.healthFactor))
  
  // 判断清算风险
  const getLiquidationRisk = () => {
    if (lowestHealthFactor < 1) {
      return { status: '极高', color: 'text-red-500' }
    } else if (lowestHealthFactor < 1.2) {
      return { status: '高', color: 'text-orange-500' }
    } else if (lowestHealthFactor < 1.5) {
      return { status: '中等', color: 'text-amber-500' }
    } else {
      return { status: '低', color: 'text-green-500' }
    }
  }
  
  const liquidationRisk = getLiquidationRisk()
  
  // 计算最佳借款金额
  const calculateOptimalBorrow = () => {
    const collateralValue = parseFloat(collateralAmount) * 1950
    return (collateralValue * 0.5).toFixed(2) // 保守的50%抵押率
  }
  
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">借贷模拟器</h2>
        <p className="text-sm text-muted-foreground mt-1">模拟不同市场条件下的借贷状况，评估潜在风险</p>
      </div>
      
      <Tabs defaultValue="parameters" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="parameters">参数设置</TabsTrigger>
          <TabsTrigger value="results">模拟结果</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parameters" className="space-y-6 pt-4">
          <div className="space-y-4">
            <Label>市场情景</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={selectedScenario === 'bull' ? 'default' : 'outline'} 
                onClick={() => setSelectedScenario('bull')}
                className="w-full"
              >
                牛市
              </Button>
              <Button 
                variant={selectedScenario === 'bear' ? 'default' : 'outline'} 
                onClick={() => setSelectedScenario('bear')}
                className="w-full"
              >
                熊市
              </Button>
              <Button 
                variant={selectedScenario === 'volatile' ? 'default' : 'outline'} 
                onClick={() => setSelectedScenario('volatile')}
                className="w-full"
              >
                高波动
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>抵押品金额 (ETH)</Label>
              <Input 
                type="number" 
                value={collateralAmount} 
                onChange={(e) => setCollateralAmount(e.target.value)}
                min="0.1"
                step="0.1"
              />
              <div className="text-xs text-muted-foreground">
                价值 ≈ ${(parseFloat(collateralAmount) * 1950).toFixed(2)}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>借款金额 (USDC)</Label>
              <Input 
                type="number" 
                value={borrowAmount} 
                onChange={(e) => setBorrowAmount(e.target.value)}
                min="100"
                step="100"
              />
              <div className="text-xs text-right">
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-xs" 
                  onClick={() => setBorrowAmount(calculateOptimalBorrow())}
                >
                  使用推荐金额
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>市场波动幅度 ({marketVariation}%)</Label>
            </div>
            <Slider
              value={[marketVariation]}
              min={5}
              max={50}
              step={5}
              onValueChange={(val) => setMarketVariation(val[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>平稳 (5%)</span>
              <span>中等 (25%)</span>
              <span>极端 (50%)</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>模拟天数 ({simulationPeriod}天)</Label>
            </div>
            <Slider
              value={[simulationPeriod]}
              min={7}
              max={90}
              step={7}
              onValueChange={(val) => setSimulationPeriod(val[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>一周</span>
              <span>一月</span>
              <span>三月</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleRunSimulation}>
              运行模拟
            </Button>
            <Button variant="outline" onClick={handleResetSimulation}>
              <RefreshCw className="h-4 w-4 mr-1" />
              重置
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6 pt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={simulationData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="days" label={{ value: '天数', position: 'insideBottomRight', offset: -10 }} />
                <YAxis yAxisId="left" label={{ value: '价值 (USD)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: '健康因子', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="collateralValue"
                  name="抵押品价值"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="borrowValue"
                  name="借款价值"
                  stroke="#82ca9d"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="healthFactor"
                  name="健康因子"
                  stroke="#ff7300"
                  strokeDasharray="5 5"
                />
                <ReferenceLine yAxisId="right" y={1} stroke="red" strokeDasharray="3 3" label="清算阈值" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">清算风险</div>
              <div className={`text-xl font-semibold ${liquidationRisk.color}`}>
                {liquidationRisk.status}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                最低健康因子: {lowestHealthFactor.toFixed(2)}
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">最大安全借款</div>
              <div className="text-xl font-semibold">
                ${calculateOptimalBorrow()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                推荐抵押率: 200%
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg flex gap-3">
            <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">模拟洞察</h3>
              <p className="text-sm text-muted-foreground">
                {lowestHealthFactor < 1 ? 
                  `在当前${selectedScenario === 'bull' ? '牛市' : selectedScenario === 'bear' ? '熊市' : '高波动'}情境下，您的借贷头寸有较高的清算风险。建议减少借款金额或增加抵押品。` :
                lowestHealthFactor < 1.5 ?
                  `您的头寸在极端市场条件下可能面临清算风险。考虑保持更高的抵押率以增加安全边际。` :
                  `您的借贷头寸在模拟期间保持健康。当前的抵押率提供了足够的安全边际来应对市场波动。`
                }
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
} 