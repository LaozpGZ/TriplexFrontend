'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface Transaction {
  id: string
  type: string
  amount: string
  symbol: string
  timestamp: string
  status: 'pending' | 'success' | 'failed'
  txHash: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions = [] }: RecentTransactionsProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'success':
        return "bg-success/10 text-success"
      case 'pending':
        return "bg-warning/10 text-warning"
      case 'failed':
        return "bg-error/10 text-error"
      default:
        return "bg-primary/10 text-primary"
    }
  }
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'success':
        return "成功"
      case 'pending':
        return "处理中"
      case 'failed':
        return "失败"
      default:
        return status
    }
  }
  
  const getTypeText = (type: string) => {
    switch(type) {
      case 'deposit':
        return "存入"
      case 'withdraw':
        return "提取"
      case 'borrow':
        return "借贷"
      case 'repay':
        return "还款"
      case 'mint':
        return "铸造"
      case 'burn':
        return "销毁"
      case 'liquidate':
        return "清算"
      default:
        return type
    }
  }
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">最近交易</h3>
        <Button variant="ghost" size="sm" asChild>
          <a href="/transaction-history">查看全部</a>
        </Button>
      </div>
      
      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 font-medium text-text-secondary">类型</th>
                <th className="text-left py-3 font-medium text-text-secondary">数量</th>
                <th className="text-left py-3 font-medium text-text-secondary hidden md:table-cell">时间</th>
                <th className="text-left py-3 font-medium text-text-secondary">状态</th>
                <th className="text-left py-3 font-medium text-text-secondary hidden md:table-cell">交易哈希</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border">
                  <td className="py-4">{getTypeText(tx.type)}</td>
                  <td className="py-4">
                    {tx.amount} {tx.symbol}
                  </td>
                  <td className="py-4 hidden md:table-cell">{tx.timestamp}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(tx.status)}`}>
                      {getStatusText(tx.status)}
                    </span>
                  </td>
                  <td className="py-4 hidden md:table-cell">
                    <a 
                      href={`https://etherscan.io/tx/${tx.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-text-secondary hover:text-primary"
                    >
                      {tx.txHash.substring(0, 6)}...{tx.txHash.substring(tx.txHash.length - 4)}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary">
          暂无交易记录
        </div>
      )}
    </Card>
  )
} 