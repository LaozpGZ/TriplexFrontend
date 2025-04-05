'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MarketData {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  totalCollateral: number
  totalBorrowed: number
  utilizationRate: number
}

export default function MarketTrends() {
  const [activeTab, setActiveTab] = useState('all')
  const [timeRange, setTimeRange] = useState('24h')
  const [marketData, setMarketData] = useState<MarketData[]>([])
  
  useEffect(() => {
    // 模拟加载市场数据
    const dummyData: MarketData[] = [
      {
        symbol: 'APT',
        name: 'Aptos',
        price: 8.75,
        change24h: 2.35,
        marketCap: 2950000000,
        totalCollateral: 125000000,
        totalBorrowed: 75000000,
        utilizationRate: 60
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 67250.28,
        change24h: -1.25,
        marketCap: 1320000000000,
        totalCollateral: 450000000,
        totalBorrowed: 220000000,
        utilizationRate: 49
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3485.75,
        change24h: 0.82,
        marketCap: 418000000000,
        totalCollateral: 220000000,
        totalBorrowed: 140000000,
        utilizationRate: 64
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        price: 172.45,
        change24h: 5.38,
        marketCap: 78000000000,
        totalCollateral: 85000000,
        totalBorrowed: 45000000,
        utilizationRate: 53
      },
      {
        symbol: 'stAPT',
        name: 'Staked Aptos',
        price: 9.12,
        change24h: 2.85,
        marketCap: 850000000,
        totalCollateral: 65000000,
        totalBorrowed: 32000000,
        utilizationRate: 49
      }
    ]
    
    setMarketData(dummyData)
  }, [])
  
  const filteredData = marketData.filter(item => {
    if (activeTab === 'all') return true
    if (activeTab === 'positive') return item.change24h > 0
    if (activeTab === 'negative') return item.change24h < 0
    return true
  })
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">市场趋势</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant={timeRange === '24h' ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setTimeRange('24h')}
              className="text-xs h-7 px-2"
            >
              24小时
            </Button>
            <Button 
              variant={timeRange === '7d' ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setTimeRange('7d')}
              className="text-xs h-7 px-2"
            >
              7天
            </Button>
            <Button 
              variant={timeRange === '30d' ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setTimeRange('30d')}
              className="text-xs h-7 px-2"
            >
              30天
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="positive">上涨</TabsTrigger>
            <TabsTrigger value="negative">下跌</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="space-y-1">
              <div className="grid grid-cols-5 text-xs text-muted-foreground py-2 border-b">
                <div>资产</div>
                <div className="text-right">价格</div>
                <div className="text-right">变动</div>
                <div className="text-right">抵押总额</div>
                <div className="text-right">使用率</div>
              </div>
              
              {filteredData.map((item) => (
                <div 
                  key={item.symbol} 
                  className="grid grid-cols-5 py-3 text-sm hover:bg-muted/50 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2">
                      {item.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{item.symbol}</div>
                      <div className="text-xs text-muted-foreground">{item.name}</div>
                    </div>
                  </div>
                  
                  <div className="text-right font-medium self-center">
                    ${item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  
                  <div className={`text-right self-center flex items-center justify-end ${item.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(item.change24h).toFixed(2)}%
                  </div>
                  
                  <div className="text-right self-center">
                    ${(item.totalCollateral / 1000000).toFixed(1)}M
                  </div>
                  
                  <div className="text-right self-center">
                    <div className="flex items-center justify-end">
                      <div className="h-2 w-16 bg-muted rounded-full overflow-hidden mr-2">
                        <div 
                          className={`h-full ${item.utilizationRate > 80 ? 'bg-red-500' : item.utilizationRate > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${item.utilizationRate}%` }}
                        />
                      </div>
                      {item.utilizationRate}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 