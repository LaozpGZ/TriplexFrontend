'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SyntheticAsset } from '@/types/synthetix'
import { CheckCircle2, Copy, ExternalLink, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge'

interface MintSuccessCardProps {
  asset: SyntheticAsset
  amount: number
  txHash: string
  timestamp: Date
  className?: string
  onViewAssets: () => void
  onMintMore: () => void
}

export function MintSuccessCard({
  asset,
  amount,
  txHash,
  timestamp,
  className,
  onViewAssets,
  onMintMore
}: MintSuccessCardProps) {
  const [copied, setCopied] = useState(false)
  
  // 复制交易哈希
  const copyTxHash = () => {
    navigator.clipboard.writeText(txHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  // 格式化交易哈希
  const formatTxHash = (hash: string) => {
    if (hash.length <= 16) return hash
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`
  }
  
  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleString('zh-CN', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  // 分享链接
  const shareTransaction = () => {
    if (navigator.share) {
      navigator.share({
        title: `铸造${asset.symbol}成功`,
        text: `我刚刚在Triplex平台铸造了${amount} ${asset.symbol}`,
        url: `https://triplex.fi/tx/${txHash}`,
      })
    } else {
      // 回退方案 - 复制分享文本
      navigator.clipboard.writeText(
        `我刚刚在Triplex平台铸造了${amount} ${asset.symbol}，交易哈希: ${txHash}`
      )
      alert('分享链接已复制到剪贴板')
    }
  }
  
  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="flex flex-col items-center text-center pb-2">
        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-xl">铸造成功！</CardTitle>
        <p className="text-sm text-muted-foreground">
          您已成功铸造合成资产
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 资产信息 */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-background overflow-hidden border flex items-center justify-center">
                <img 
                  src={asset.icon} 
                  alt={asset.symbol} 
                  className="h-6 w-6" 
                  onError={(e) => {
                    e.currentTarget.src = "";
                    e.currentTarget.textContent = asset.symbol.slice(0, 2);
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{asset.symbol}</span>
                <Badge variant="outline" className="text-[10px] h-4 px-1">
                  合成资产
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">{asset.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">{amount}</div>
            <div className="text-xs text-muted-foreground">${(amount * asset.price).toLocaleString()}</div>
          </div>
        </div>
        
        {/* 交易详情 */}
        <div className="rounded-lg border p-3 space-y-3">
          <h4 className="text-sm font-medium mb-1">交易详情</h4>
          
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">交易类型:</span>
            <span>铸造合成资产</span>
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">交易哈希:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono">{formatTxHash(txHash)}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={copyTxHash}>
                      {copied ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{copied ? '已复制' : '复制交易哈希'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">状态:</span>
            <span className="text-green-500 font-medium">已确认</span>
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">时间:</span>
            <span>{formatTime(timestamp)}</span>
          </div>
        </div>
        
        {/* 提示信息 */}
        <div className="rounded-lg bg-primary/10 p-3 text-xs text-primary">
          <p>您的合成资产已经添加到您的钱包中。您可以在"资产管理"页面查看和管理您的所有合成资产。</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-3 pt-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onMintMore}>
          继续铸造
        </Button>
        <Button size="sm" className="flex-1" onClick={onViewAssets}>
          查看资产
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={shareTransaction}>
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">分享</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`https://explorer.aptoslabs.com/txn/${txHash}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">在区块浏览器中查看</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  )
} 