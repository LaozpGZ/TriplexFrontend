'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, ArrowUpDown, Minus } from 'lucide-react'
import AddCollateralModal from './AddCollateralModal'
import WithdrawCollateralModal from './WithdrawCollateralModal'

// 资产类型
interface Asset {
  id: string
  symbol: string
  name: string
  type: string
  price: number
  icon: string
  minRatio: number
  liquidationThreshold: number
}

// 抵押品
interface Collateral {
  id: string
  asset: Asset
  amount: number
  valueUSD: number
  borrowed: number
  ratio: number
  health: number
}

// 界面属性
interface ActiveCollateralsProps {
  searchQuery?: string
  activeFilters?: string[]
}

export default function ActiveCollaterals({ searchQuery = '', activeFilters = [] }: ActiveCollateralsProps) {
  const [collaterals, setCollaterals] = useState<Collateral[]>([])
  const [selectedCollateral, setSelectedCollateral] = useState<Collateral | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [filteredCollaterals, setFilteredCollaterals] = useState<Collateral[]>([])

  // 初始化模拟数据
  useEffect(() => {
    const mockCollaterals: Collateral[] = [
      {
        id: '1',
        asset: {
          id: 'apt',
          symbol: 'APT',
          name: 'Aptos',
          type: 'native',
          price: 8.35,
          icon: '/icons/apt.svg',
          minRatio: 120,
          liquidationThreshold: 115
        },
        amount: 350,
        valueUSD: 2922.5,
        borrowed: 1200,
        ratio: 243.5,
        health: 95
      },
      {
        id: '2',
        asset: {
          id: 'btc',
          symbol: 'WBTC',
          name: 'Wrapped Bitcoin',
          type: 'wrapped',
          price: 42800,
          icon: '/icons/btc.svg',
          minRatio: 140,
          liquidationThreshold: 130
        },
        amount: 0.15,
        valueUSD: 6420,
        borrowed: 3500,
        ratio: 183.4,
        health: 76
      },
      {
        id: '3',
        asset: {
          id: 'stapt',
          symbol: 'stAPT',
          name: 'Staked Aptos',
          type: 'staked',
          price: 8.52,
          icon: '/icons/stapt.svg',
          minRatio: 125,
          liquidationThreshold: 120
        },
        amount: 500,
        valueUSD: 4260,
        borrowed: 2100,
        ratio: 202.9,
        health: 85
      },
      {
        id: '4',
        asset: {
          id: 'eth',
          symbol: 'ETH',
          name: 'Ethereum',
          type: 'wrapped',
          price: 2300,
          icon: '/icons/eth.svg',
          minRatio: 130,
          liquidationThreshold: 125
        },
        amount: 1.2,
        valueUSD: 2760,
        borrowed: 1800,
        ratio: 153.3,
        health: 55
      },
      {
        id: '5',
        asset: {
          id: 'sol',
          symbol: 'SOL',
          name: 'Solana',
          type: 'wrapped',
          price: 98.50,
          icon: '/icons/sol.svg',
          minRatio: 150,
          liquidationThreshold: 140
        },
        amount: 25,
        valueUSD: 2462.5,
        borrowed: 1100,
        ratio: 223.9,
        health: 89
      }
    ]
    
    setCollaterals(mockCollaterals)
  }, [])
  
  // 应用搜索和过滤
  useEffect(() => {
    let filtered = [...collaterals]
    
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c => 
        c.asset.name.toLowerCase().includes(query) || 
        c.asset.symbol.toLowerCase().includes(query) ||
        c.asset.type.toLowerCase().includes(query)
      )
    }
    
    // 应用筛选器
    if (activeFilters.length > 0) {
      filtered = filtered.filter(c => {
        // 资产类型过滤
        const assetFilter = activeFilters.some(filter => 
          filter === c.asset.id || 
          (filter === 'stapt' && c.asset.type === 'staked')
        )
        
        // 风险等级过滤
        const riskFilter = activeFilters.some(filter => {
          if (filter === 'high-risk') return c.health < 60
          if (filter === 'medium-risk') return c.health >= 60 && c.health < 80
          if (filter === 'low-risk') return c.health >= 80
          return false
        })
        
        // 状态过滤
        const statusFilter = activeFilters.some(filter => {
          if (filter === 'active') return c.borrowed > 0
          if (filter === 'inactive') return c.borrowed === 0
          return false
        })
        
        return assetFilter || riskFilter || statusFilter || activeFilters.length === 0
      })
    }
    
    setFilteredCollaterals(filtered)
  }, [collaterals, searchQuery, activeFilters])

  // 健康度颜色
  const getHealthColor = (health: number) => {
    if (health < 60) return 'text-red-500'
    if (health < 80) return 'text-yellow-500'
    return 'text-green-500'
  }

  // 健康度文本
  const getHealthText = (health: number) => {
    if (health < 60) return '高风险'
    if (health < 80) return '中风险'
    return '安全'
  }

  // 模拟获取钱包余额
  const getWalletBalance = (assetId: string): number => {
    const balances: Record<string, number> = {
      'apt': 150,
      'btc': 0.05,
      'stapt': 200,
      'eth': 0.8,
      'sol': 10
    }
    return balances[assetId] || 0
  }

  // 模拟获取可提取余额
  const getWithdrawableAmount = (collateral: Collateral): number => {
    // 简单计算：当前金额 - 最小抵押率所需金额
    const minRequired = (collateral.borrowed * collateral.asset.minRatio / 100) / collateral.asset.price
    return Math.max(0, collateral.amount - minRequired)
  }

  // 添加抵押品处理
  const handleAddCollateral = (collateral: Collateral, amount: number) => {
    const updatedCollaterals = collaterals.map(c => {
      if (c.id === collateral.id) {
        const newAmount = c.amount + amount
        const newValueUSD = newAmount * c.asset.price
        const newRatio = c.borrowed > 0 ? (newValueUSD / c.borrowed) * 100 : c.ratio
        const healthDiff = newRatio - c.asset.liquidationThreshold
        const newHealth = Math.min(100, Math.max(0, (healthDiff / (c.asset.minRatio - c.asset.liquidationThreshold)) * 100))
        
        return {
          ...c,
          amount: newAmount,
          valueUSD: newValueUSD,
          ratio: newRatio,
          health: newHealth
        }
      }
      return c
    })
    
    setCollaterals(updatedCollaterals)
    setIsAddModalOpen(false)
    console.log(`已添加 ${amount} ${collateral.asset.symbol} 作为抵押品`)
  }

  // 提取抵押品处理
  const handleWithdrawCollateral = (collateral: Collateral, amount: number) => {
    const updatedCollaterals = collaterals.map(c => {
      if (c.id === collateral.id) {
        const newAmount = c.amount - amount
        const newValueUSD = newAmount * c.asset.price
        const newRatio = c.borrowed > 0 ? (newValueUSD / c.borrowed) * 100 : c.ratio
        const healthDiff = newRatio - c.asset.liquidationThreshold
        const newHealth = Math.min(100, Math.max(0, (healthDiff / (c.asset.minRatio - c.asset.liquidationThreshold)) * 100))
        
        return {
          ...c,
          amount: newAmount,
          valueUSD: newValueUSD,
          ratio: newRatio,
          health: newHealth
        }
      }
      return c
    })
    
    setCollaterals(updatedCollaterals)
    setIsWithdrawModalOpen(false)
    console.log(`已提取 ${amount} ${collateral.asset.symbol} 从抵押品`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>活跃抵押品</CardTitle>
        <div className="text-sm text-muted-foreground">
          {filteredCollaterals.length} 个抵押品
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>资产</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>价值 (USD)</TableHead>
                <TableHead>已借款 (USD)</TableHead>
                <TableHead>抵押率</TableHead>
                <TableHead>健康度</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollaterals.length > 0 ? (
                filteredCollaterals.map((collateral) => (
                  <TableRow key={collateral.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center overflow-hidden">
                          <img 
                            src={collateral.asset.icon} 
                            alt={collateral.asset.symbol}
                            className="h-6 w-6"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{collateral.asset.symbol}</div>
                          <div className="text-xs text-muted-foreground">{collateral.asset.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {collateral.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 4
                      })}
                    </TableCell>
                    <TableCell>
                      ${collateral.valueUSD.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell>
                      ${collateral.borrowed.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell>
                      {collateral.ratio.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-12 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full ${getHealthColor(collateral.health).replace('text-', 'bg-')}`}
                            style={{ width: `${collateral.health}%` }}
                          />
                        </div>
                        <span className={getHealthColor(collateral.health)}>
                          {getHealthText(collateral.health)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedCollateral(collateral)
                            setIsAddModalOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          增加
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedCollateral(collateral)
                            setIsWithdrawModalOpen(true)
                          }}
                          disabled={getWithdrawableAmount(collateral) <= 0}
                        >
                          <Minus className="h-4 w-4 mr-1" />
                          提取
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    {activeFilters.length > 0 || searchQuery 
                      ? '没有找到匹配的抵押品' 
                      : '暂无活跃抵押品'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* 添加抵押品模态框 */}
      {selectedCollateral && (
        <AddCollateralModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          asset={{
            symbol: selectedCollateral.asset.symbol,
            balance: getWalletBalance(selectedCollateral.asset.id),
            currentRatio: selectedCollateral.ratio,
            liquidationThreshold: selectedCollateral.asset.liquidationThreshold
          }}
          onConfirm={(amount) => handleAddCollateral(selectedCollateral, Number(amount))}
        />
      )}

      {/* 提取抵押品模态框 */}
      {selectedCollateral && (
        <WithdrawCollateralModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          asset={{
            symbol: selectedCollateral.asset.symbol,
            availableToWithdraw: getWithdrawableAmount(selectedCollateral),
            currentRatio: selectedCollateral.ratio,
            liquidationThreshold: selectedCollateral.asset.liquidationThreshold
          }}
          onConfirm={(amount) => handleWithdrawCollateral(selectedCollateral, Number(amount))}
        />
      )}
    </Card>
  )
} 