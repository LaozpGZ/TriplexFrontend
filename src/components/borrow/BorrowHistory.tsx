'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, ArrowDownLeft, ArrowUpRight, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'

// 交易状态类型
type TransactionStatus = 'success' | 'pending' | 'failed'

// 借贷历史交易
interface BorrowTransaction {
  id: string
  type: '借款' | '还款' | '添加抵押' | '撤回抵押' | '清算'
  asset: string
  amount: string
  time: string
  txHash: string
  status: TransactionStatus
}

export default function BorrowHistory() {
  // 过滤状态
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  
  // 示例交易历史数据
  const transactions: BorrowTransaction[] = [
    {
      id: 'tx1',
      type: '借款',
      asset: 'USDC',
      amount: '1,500',
      time: '2023-12-05 14:32',
      txHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      status: 'success'
    },
    {
      id: 'tx2',
      type: '添加抵押',
      asset: 'ETH',
      amount: '0.85',
      time: '2023-12-05 12:15',
      txHash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a',
      status: 'success'
    },
    {
      id: 'tx3',
      type: '还款',
      asset: 'USDC',
      amount: '500',
      time: '2023-12-04 18:45',
      txHash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b',
      status: 'success'
    },
    {
      id: 'tx4',
      type: '借款',
      asset: 'USDT',
      amount: '2,000',
      time: '2023-12-03 09:22',
      txHash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c',
      status: 'success'
    },
    {
      id: 'tx5',
      type: '撤回抵押',
      asset: 'BTC',
      amount: '0.05',
      time: '2023-12-01 11:08',
      txHash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d',
      status: 'success'
    },
    {
      id: 'tx6',
      type: '清算',
      asset: 'SOL',
      amount: '12.5',
      time: '2023-11-28 03:17',
      txHash: '0x6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e',
      status: 'success'
    },
    {
      id: 'tx7',
      type: '借款',
      asset: 'DAI',
      amount: '750',
      time: '2023-11-25 15:50',
      txHash: '0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d5e6f',
      status: 'pending'
    },
  ]
  
  // 过滤交易
  const filteredTransactions = transactions.filter(tx => {
    // 搜索过滤
    const matchesSearch = 
      tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase())
    
    // 类型过滤
    const matchesType = selectedType ? tx.type === selectedType : true
    
    return matchesSearch && matchesType
  })
  
  // 获取交易状态样式
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">成功</Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">处理中</Badge>
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">失败</Badge>
    }
  }
  
  // 获取交易类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case '借款':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case '还款':
        return <ArrowUpRight className="h-4 w-4 text-amber-500" />
      case '添加抵押':
        return <ArrowDownLeft className="h-4 w-4 text-blue-500" />
      case '撤回抵押':
        return <ArrowUpRight className="h-4 w-4 text-purple-500" />
      case '清算':
        return <Clock className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }
  
  // 交易类型过滤器选项
  const transactionTypes = ['借款', '还款', '添加抵押', '撤回抵押', '清算']
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">借贷历史</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9 w-[200px]"
              placeholder="搜索资产、金额..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative inline-block">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-md shadow-lg z-10 hidden group-hover:block">
              {transactionTypes.map(type => (
                <button
                  key={type}
                  className="w-full text-left px-4 py-2 hover:bg-accent text-sm"
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 font-medium text-muted-foreground">类型</th>
              <th className="text-left py-3 font-medium text-muted-foreground">资产</th>
              <th className="text-left py-3 font-medium text-muted-foreground">金额</th>
              <th className="text-left py-3 font-medium text-muted-foreground">时间</th>
              <th className="text-left py-3 font-medium text-muted-foreground">交易哈希</th>
              <th className="text-left py-3 font-medium text-muted-foreground">状态</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(tx => (
                <tr key={tx.id} className="border-b border-border hover:bg-card/50">
                  <td className="py-4 flex items-center gap-2">
                    {getTypeIcon(tx.type)}
                    <span>{tx.type}</span>
                  </td>
                  <td className="py-4">{tx.asset}</td>
                  <td className="py-4">{tx.amount}</td>
                  <td className="py-4">{tx.time}</td>
                  <td className="py-4">
                    <a
                      href={`https://explorer.aptoslabs.com/txn/${tx.txHash}?network=mainnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {tx.txHash.substring(0, 8)}...{tx.txHash.substring(tx.txHash.length - 6)}
                    </a>
                  </td>
                  <td className="py-4">{getStatusBadge(tx.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  未找到匹配的交易记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button variant="outline" className="text-primary">
          查看更多交易
        </Button>
      </div>
    </Card>
  )
} 