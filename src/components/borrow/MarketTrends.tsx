'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TrendItem {
  title: string
  change: string
  isPositive: boolean
  description: string
}

export default function MarketTrends() {
  const trends: TrendItem[] = [
    {
      title: '借贷需求上升',
      change: '+18.5%',
      isPositive: true,
      description: '过去一周的借贷量持续增加，表明市场对流动性的需求正在增强。稳定币的借贷需求尤为突出，USDC和USDT的借款利用率已达到历史高点。'
    },
    {
      title: '抵押偏好变化',
      change: '+12.3%',
      isPositive: true,
      description: '更多用户选择多元化抵押策略，ETH和BTC仍然是主要抵押品，但SOL和其他Layer-1代币的抵押比例已增加12.3%。'
    },
    {
      title: '清算风险下降',
      change: '-8.7%',
      isPositive: true,
      description: '平均健康因子已从1.65上升至1.8，表明借款人正积极管理其头寸风险，清算事件数量已减少8.7%。'
    },
    {
      title: '借贷利率波动',
      change: '+2.4%',
      isPositive: false,
      description: '由于市场流动性变化，借贷利率略有上升。稳定币借款年化利率平均上涨2.4%，预计未来一周将保持在此水平。'
    }
  ]
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">市场趋势</h2>
        <Button variant="outline" size="sm" className="text-xs h-8">
          查看完整报告 <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-5">
        {trends.map((trend, index) => (
          <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{trend.title}</h3>
              <div className={`flex items-center ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {trend.change}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {trend.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
} 