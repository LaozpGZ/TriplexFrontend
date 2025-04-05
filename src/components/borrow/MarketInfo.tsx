'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Info } from 'lucide-react'

interface MarketStat {
  label: string
  value: string
  change?: {
    value: string
    isPositive: boolean
  }
  info?: string
}

interface AssetData {
  symbol: string
  name: string
  price: string
  change: string
  isPositive: boolean
  totalSupply?: string
  totalBorrow?: string
  utilizationRate?: string
  depositAPY?: string
  borrowAPY?: string
}

export default function MarketInfo() {
  const marketStats: MarketStat[] = [
    {
      label: '总锁仓价值',
      value: '$127,458,901',
      change: {
        value: '5.2%',
        isPositive: true
      },
      info: '过去24小时内存入的资产总价值'
    },
    {
      label: '总借款价值',
      value: '$48,734,201',
      change: {
        value: '3.8%',
        isPositive: true
      },
      info: '过去24小时内借出的资产总价值'
    },
    {
      label: '平均抵押率',
      value: '210%',
      change: {
        value: '1.2%',
        isPositive: false
      },
      info: '所有借贷头寸的平均抵押率'
    },
    {
      label: '活跃借贷头寸',
      value: '12,354',
      change: {
        value: '8.5%',
        isPositive: true
      },
      info: '当前活跃的借贷头寸数量'
    }
  ]
  
  const popularAssets: AssetData[] = [
    {
      symbol: 'BTC',
      name: '比特币',
      price: '$44,280.50',
      change: '+2.4%',
      isPositive: true,
      depositAPY: '2.1%',
      borrowAPY: '4.5%',
      utilizationRate: '68%'
    },
    {
      symbol: 'ETH',
      name: '以太坊',
      price: '$1,950.75',
      change: '+3.6%',
      isPositive: true,
      depositAPY: '2.8%',
      borrowAPY: '5.2%',
      utilizationRate: '72%'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      price: '$1.00',
      change: '0.0%',
      isPositive: true,
      depositAPY: '3.2%',
      borrowAPY: '6.5%',
      utilizationRate: '85%'
    },
    {
      symbol: 'SOL',
      name: '索拉纳',
      price: '$98.35',
      change: '-1.2%',
      isPositive: false,
      depositAPY: '1.8%',
      borrowAPY: '4.2%',
      utilizationRate: '62%'
    }
  ]
  
  return (
    <>
      {/* 市场统计 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {marketStats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start">
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              {stat.info && (
                <div className="group relative">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="absolute right-0 w-48 p-2 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
                    {stat.info}
                  </div>
                </div>
              )}
            </div>
            <div className="text-xl font-semibold mt-1">{stat.value}</div>
            {stat.change && (
              <div className={`text-sm flex items-center mt-1 ${stat.change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stat.change.isPositive ? '+' : ''}{stat.change.value} (24h)
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* 热门资产 */}
      <Card className="mb-8">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">热门资产</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">资产</th>
                <th className="text-left p-4 font-medium text-muted-foreground">价格</th>
                <th className="text-left p-4 font-medium text-muted-foreground">24h变化</th>
                <th className="text-left p-4 font-medium text-muted-foreground">存款APY</th>
                <th className="text-left p-4 font-medium text-muted-foreground">借款APY</th>
                <th className="text-left p-4 font-medium text-muted-foreground">使用率</th>
              </tr>
            </thead>
            <tbody>
              {popularAssets.map((asset, index) => (
                <tr key={index} className="border-b hover:bg-accent/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {asset.symbol.substring(0, 1)}
                      </div>
                      <div>
                        <div className="font-medium">{asset.symbol}</div>
                        <div className="text-xs text-muted-foreground">{asset.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{asset.price}</td>
                  <td className={`p-4 ${asset.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {asset.change}
                  </td>
                  <td className="p-4">{asset.depositAPY}</td>
                  <td className="p-4">{asset.borrowAPY}</td>
                  <td className="p-4">
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          parseInt(asset.utilizationRate!) > 80 
                            ? 'bg-amber-500' 
                            : parseInt(asset.utilizationRate!) > 60 
                            ? 'bg-green-500' 
                            : 'bg-blue-500'
                        }`}
                        style={{ width: asset.utilizationRate }}
                      ></div>
                    </div>
                    <div className="text-xs text-right mt-1">{asset.utilizationRate}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
} 