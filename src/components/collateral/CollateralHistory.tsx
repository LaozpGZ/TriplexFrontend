'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ArrowDown, ArrowUp, Download } from 'lucide-react'

interface Transaction {
  id: string
  date: string
  type: 'add' | 'withdraw' | 'liquidation' | 'swap'
  asset: {
    symbol: string
    icon: string
    id: string
  }
  amount: number
  valueUSD: number
  status: 'completed' | 'pending' | 'failed'
}

interface CollateralHistoryProps {
  searchQuery?: string
  activeFilters?: string[]
}

export default function CollateralHistory({ searchQuery = '', activeFilters = [] }: CollateralHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [sortColumn, setSortColumn] = useState<string>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  // 初始化模拟数据
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: '2023-05-15 14:23',
        type: 'add',
        asset: {
          symbol: 'APT',
          icon: '/icons/apt.svg',
          id: 'apt'
        },
        amount: 125.5,
        valueUSD: 1047.93,
        status: 'completed'
      },
      {
        id: '2',
        date: '2023-05-12 09:45',
        type: 'withdraw',
        asset: {
          symbol: 'WBTC',
          icon: '/icons/btc.svg',
          id: 'btc'
        },
        amount: 0.05,
        valueUSD: 2140,
        status: 'completed'
      },
      {
        id: '3',
        date: '2023-05-10 23:12',
        type: 'liquidation',
        asset: {
          symbol: 'SOL',
          icon: '/icons/sol.svg',
          id: 'sol'
        },
        amount: 12.8,
        valueUSD: 1260.8,
        status: 'completed'
      },
      {
        id: '4',
        date: '2023-05-08 17:39',
        type: 'add',
        asset: {
          symbol: 'ETH',
          icon: '/icons/eth.svg',
          id: 'eth'
        },
        amount: 0.75,
        valueUSD: 1725,
        status: 'completed'
      },
      {
        id: '5',
        date: '2023-05-05 11:05',
        type: 'swap',
        asset: {
          symbol: 'stAPT',
          icon: '/icons/stapt.svg',
          id: 'stapt'
        },
        amount: 250,
        valueUSD: 2130,
        status: 'completed'
      }
    ]
    
    setTransactions(mockTransactions)
  }, [])
  
  // 应用搜索和过滤
  useEffect(() => {
    let filtered = [...transactions]
    
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(tx => 
        tx.asset.symbol.toLowerCase().includes(query) || 
        tx.type.toLowerCase().includes(query) ||
        tx.status.toLowerCase().includes(query)
      )
    }
    
    // 应用筛选器
    if (activeFilters.length > 0) {
      filtered = filtered.filter(tx => {
        // 资产类型过滤
        const assetFilter = activeFilters.some(filter => 
          filter === tx.asset.id
        )
        
        // 状态过滤
        const statusFilter = activeFilters.some(filter => {
          if (filter === 'active' || filter === 'inactive') return false
          return tx.status.includes(filter)
        })
        
        // 风险等级过滤不适用于交易历史
        
        return assetFilter || statusFilter || activeFilters.length === 0
      })
    }
    
    // 排序
    filtered = sortData(filtered, sortColumn, sortDirection)
    
    setFilteredTransactions(filtered)
  }, [transactions, searchQuery, activeFilters, sortColumn, sortDirection])
  
  // 交易类型样式和文本
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'add': return 'text-green-500'
      case 'withdraw': return 'text-amber-500'
      case 'liquidation': return 'text-red-500'
      case 'swap': return 'text-blue-500'
      default: return 'text-muted-foreground'
    }
  }
  
  const getTypeText = (type: string) => {
    switch (type) {
      case 'add': return '增加'
      case 'withdraw': return '提取'
      case 'liquidation': return '清算'
      case 'swap': return '交换'
      default: return type
    }
  }
  
  // 状态样式和文本
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500'
      case 'pending': return 'text-amber-500'
      case 'failed': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'pending': return '处理中'
      case 'failed': return '失败'
      default: return status
    }
  }
  
  // 导出交易历史
  const exportTransactions = () => {
    // 在真实应用中，这应该将数据导出为CSV/Excel
    console.log('导出交易历史', filteredTransactions)
    
    const csvData = [
      ['ID', '日期', '类型', '资产', '数量', '价值(USD)', '状态'],
      ...filteredTransactions.map(tx => [
        tx.id,
        tx.date,
        getTypeText(tx.type),
        tx.asset.symbol,
        tx.amount.toString(),
        tx.valueUSD.toString(),
        getStatusText(tx.status)
      ])
    ]
    
    // 创建CSV内容
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    // 创建下载链接
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `抵押品交易历史_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // 排序处理
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }
  
  // 排序图标
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }
  
  // 排序函数
  const sortData = (data: Transaction[], column: string, direction: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      let compareA, compareB
      
      // 根据列选择比较值
      switch (column) {
        case 'date':
          compareA = new Date(a.date).getTime()
          compareB = new Date(b.date).getTime()
          break
        case 'type':
          compareA = a.type
          compareB = b.type
          break
        case 'asset':
          compareA = a.asset.symbol
          compareB = b.asset.symbol
          break
        case 'amount':
          compareA = a.amount
          compareB = b.amount
          break
        case 'valueUSD':
          compareA = a.valueUSD
          compareB = b.valueUSD
          break
        case 'status':
          compareA = a.status
          compareB = b.status
          break
        default:
          compareA = a.date
          compareB = b.date
      }
      
      // 比较
      if (compareA < compareB) return direction === 'asc' ? -1 : 1
      if (compareA > compareB) return direction === 'asc' ? 1 : -1
      return 0
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>抵押品历史记录</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportTransactions}
          disabled={filteredTransactions.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          导出
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[180px] cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    日期和时间
                    {getSortIcon('date')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    类型
                    {getSortIcon('type')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('asset')}
                >
                  <div className="flex items-center">
                    资产
                    {getSortIcon('asset')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end">
                    数量
                    {getSortIcon('amount')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort('valueUSD')}
                >
                  <div className="flex items-center justify-end">
                    价值 (USD)
                    {getSortIcon('valueUSD')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center justify-end">
                    状态
                    {getSortIcon('status')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.date}</TableCell>
                    <TableCell>
                      <span className={getTypeStyle(transaction.type)}>
                        {getTypeText(transaction.type)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-background flex items-center justify-center overflow-hidden">
                          <img 
                            src={transaction.asset.icon} 
                            alt={transaction.asset.symbol}
                            className="h-4 w-4"
                          />
                        </div>
                        <span>{transaction.asset.symbol}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 4
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      ${transaction.valueUSD.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={getStatusStyle(transaction.status)}>
                        {getStatusText(transaction.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {activeFilters.length > 0 || searchQuery 
                      ? '没有找到匹配的交易记录' 
                      : '暂无交易记录'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 