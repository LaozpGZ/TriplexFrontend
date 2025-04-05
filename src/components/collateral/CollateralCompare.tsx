'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, X, Info } from 'lucide-react'

interface CollateralAsset {
  symbol: string
  name: string
  liquidityScore: number
  volatilityScore: number
  maxLTV: number
  liquidationThreshold: number
  interestRate: number
  borrowLimit: number
  isPaused: boolean
  features: {
    flash: boolean
    delegation: boolean
    staking: boolean
    swap: boolean
  }
}

export default function CollateralCompare() {
  const assets: CollateralAsset[] = [
    {
      symbol: 'APT',
      name: 'Aptos',
      liquidityScore: 9.2,
      volatilityScore: 7.5,
      maxLTV: 80,
      liquidationThreshold: 85,
      interestRate: 2.5,
      borrowLimit: 10000000,
      isPaused: false,
      features: {
        flash: true,
        delegation: true,
        staking: true,
        swap: true
      }
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      liquidityScore: 9.8,
      volatilityScore: 6.8,
      maxLTV: 75,
      liquidationThreshold: 80,
      interestRate: 1.8,
      borrowLimit: 50000000,
      isPaused: false,
      features: {
        flash: true,
        delegation: false,
        staking: false,
        swap: true
      }
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      liquidityScore: 9.7,
      volatilityScore: 6.5,
      maxLTV: 82.5,
      liquidationThreshold: 87.5,
      interestRate: 2.0,
      borrowLimit: 30000000,
      isPaused: false,
      features: {
        flash: true,
        delegation: true,
        staking: true,
        swap: true
      }
    },
    {
      symbol: 'stAPT',
      name: 'Staked Aptos',
      liquidityScore: 8.5,
      volatilityScore: 5.8,
      maxLTV: 70,
      liquidationThreshold: 75,
      interestRate: 1.2,
      borrowLimit: 5000000,
      isPaused: false,
      features: {
        flash: false,
        delegation: false,
        staking: true,
        swap: true
      }
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      liquidityScore: 9.0,
      volatilityScore: 8.2,
      maxLTV: 75,
      liquidationThreshold: 80,
      interestRate: 2.2,
      borrowLimit: 15000000,
      isPaused: false,
      features: {
        flash: true,
        delegation: true,
        staking: true,
        swap: true
      }
    }
  ]
  
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['APT', 'BTC', 'ETH'])
  const [viewMode, setViewMode] = useState<'compare' | 'table'>('compare')
  
  const toggleAssetSelection = (symbol: string) => {
    if (selectedAssets.includes(symbol)) {
      // 至少保留一个选择的资产
      if (selectedAssets.length > 1) {
        setSelectedAssets(selectedAssets.filter(s => s !== symbol))
      }
    } else {
      // 最多选择3个进行比较
      if (selectedAssets.length < 3) {
        setSelectedAssets([...selectedAssets, symbol])
      }
    }
  }
  
  const filteredAssets = assets.filter(asset => selectedAssets.includes(asset.symbol))
  
  // 计算评分（1-10分）
  const getScoreClass = (score: number) => {
    if (score >= 8) return 'text-green-500'
    if (score >= 6) return 'text-yellow-500'
    return 'text-red-500'
  }
  
  // 格式化百分比
  const formatPercent = (value: number) => `${value}%`
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-xl">抵押品比较</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'compare' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('compare')}
              className="text-xs"
            >
              比较视图
            </Button>
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="text-xs"
            >
              表格视图
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">选择资产进行比较(最多3个):</p>
          <div className="flex flex-wrap gap-2">
            {assets.map(asset => (
              <Button
                key={asset.symbol}
                variant={selectedAssets.includes(asset.symbol) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleAssetSelection(asset.symbol)}
                className="text-xs"
              >
                {asset.symbol}
              </Button>
            ))}
          </div>
        </div>
        
        {viewMode === 'compare' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <div className="h-24 flex items-end pb-2">
                <span className="text-sm text-muted-foreground">资产特性</span>
              </div>
              <div className="space-y-4 text-sm mt-2">
                <div className="h-8">流动性评分</div>
                <div className="h-8">波动性评分</div>
                <div className="h-8">最大贷款价值比(LTV)</div>
                <div className="h-8">清算阈值</div>
                <div className="h-8">借款利率</div>
                <div className="h-8">借款限额</div>
                <div className="h-8">闪电贷</div>
                <div className="h-8">权益代理</div>
                <div className="h-8">质押支持</div>
                <div className="h-8">快速交换</div>
              </div>
            </div>
            
            {filteredAssets.map(asset => (
              <div key={asset.symbol} className="md:col-span-1">
                <div className="h-24 flex flex-col justify-end pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                    {asset.symbol.charAt(0)}
                  </div>
                  <h3 className="font-medium text-center">{asset.symbol}</h3>
                  <p className="text-xs text-muted-foreground text-center">{asset.name}</p>
                </div>
                
                <div className="space-y-4 text-sm mt-2">
                  <div className="h-8 flex items-center justify-center">
                    <span className={getScoreClass(asset.liquidityScore)}>{asset.liquidityScore}</span>
                  </div>
                  <div className="h-8 flex items-center justify-center">
                    <span className={getScoreClass(10 - asset.volatilityScore)}>{asset.volatilityScore}</span>
                  </div>
                  <div className="h-8 flex items-center justify-center">
                    {formatPercent(asset.maxLTV)}
                  </div>
                  <div className="h-8 flex items-center justify-center">
                    {formatPercent(asset.liquidationThreshold)}
                  </div>
                  <div className="h-8 flex items-center justify-center">
                    {formatPercent(asset.interestRate)}
                  </div>
                  <div className="h-8 flex items-center justify-center">
                    ${(asset.borrowLimit / 1000000).toFixed(1)}M
                  </div>
                  <div className="h-8 flex items-center justify-center">
                    {asset.features.flash ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="h-8 flex items-center justify-center">
                    {asset.features.delegation ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="h-8 flex items-center justify-center">
                    {asset.features.staking ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="h-8 flex items-center justify-center">
                    {asset.features.swap ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">资产</th>
                  <th className="text-center py-2">流动性</th>
                  <th className="text-center py-2">波动性</th>
                  <th className="text-center py-2">贷款比(LTV)</th>
                  <th className="text-center py-2">清算阈值</th>
                  <th className="text-center py-2">借款利率</th>
                  <th className="text-center py-2">借款限额</th>
                  <th className="text-center py-2">特性</th>
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => (
                  <tr key={asset.symbol} className="border-b hover:bg-muted/50">
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2">
                          {asset.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{asset.symbol}</div>
                          <div className="text-xs text-muted-foreground">{asset.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3">
                      <span className={getScoreClass(asset.liquidityScore)}>{asset.liquidityScore}</span>
                    </td>
                    <td className="text-center py-3">
                      <span className={getScoreClass(10 - asset.volatilityScore)}>{asset.volatilityScore}</span>
                    </td>
                    <td className="text-center py-3">
                      {formatPercent(asset.maxLTV)}
                    </td>
                    <td className="text-center py-3">
                      {formatPercent(asset.liquidationThreshold)}
                    </td>
                    <td className="text-center py-3">
                      {formatPercent(asset.interestRate)}
                    </td>
                    <td className="text-center py-3">
                      ${(asset.borrowLimit / 1000000).toFixed(1)}M
                    </td>
                    <td className="text-center py-3">
                      <div className="flex items-center justify-center space-x-1">
                        {asset.features.flash && <div className="w-2 h-2 rounded-full bg-green-500" title="闪电贷"></div>}
                        {asset.features.delegation && <div className="w-2 h-2 rounded-full bg-blue-500" title="权益代理"></div>}
                        {asset.features.staking && <div className="w-2 h-2 rounded-full bg-purple-500" title="质押支持"></div>}
                        {asset.features.swap && <div className="w-2 h-2 rounded-full bg-yellow-500" title="快速交换"></div>}
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>* 流动性和波动性评分从1到10，分数越高表示流动性越强或波动性越高</p>
          <p>* 贷款比(LTV)和清算阈值以百分比表示，数值越高表示您可以借更多</p>
        </div>
      </CardContent>
    </Card>
  )
} 