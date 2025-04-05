'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, ChevronRight, ExternalLink, X, Layers, BarChart3, Shield, DollarSign, RefreshCw, TrendingUp, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { HelpContent } from './HelpContent'
import { Badge } from '@/components/ui/badge'

interface HelpTopic {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

interface SynthetixHelpWidgetProps {
  externalControl?: boolean
  isOpenExternal?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export default function SynthetixHelpWidget({ 
  externalControl = false, 
  isOpenExternal = false, 
  onOpenChange 
}: SynthetixHelpWidgetProps) {
  const helpTopics: HelpTopic[] = [
    {
      id: 'introduction',
      title: '什么是合成资产？',
      description: '了解合成资产的基础知识，及其如何在Triplex平台上运作。',
      icon: <Layers className="h-4 w-4" />
    },
    {
      id: 'minting',
      title: '如何铸造合成资产？',
      description: '学习铸造合成资产的步骤、所需抵押品和费用情况。',
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      id: 'liquidation',
      title: '了解清算风险',
      description: '掌握清算机制和预防措施，保持健康的抵押率，设置价格预警。',
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: 'pricing',
      title: '价格如何确定？',
      description: '了解预言机如何为合成资产提供价格，以及价格更新频率。',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      id: 'redemption',
      title: '赎回合成资产',
      description: '学习如何赎回合成资产，收回抵押品，及相关费用情况。',
      icon: <RefreshCw className="h-4 w-4" />
    },
    {
      id: 'trading',
      title: '交易和转账',
      description: '了解如何交易合成资产，包括DEX交易和点对点转账。',
      icon: <TrendingUp className="h-4 w-4" />
    }
  ]
  
  const [expanded, setExpanded] = useState(false)
  const [isOpenInternal, setIsOpenInternal] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  
  // 使用外部或内部控制的状态
  const isOpen = externalControl ? isOpenExternal : isOpenInternal
  const setIsOpen = (open: boolean) => {
    if (externalControl && onOpenChange) {
      onOpenChange(open)
    } else {
      setIsOpenInternal(open)
    }
  }
  
  // 打开主题详情
  const openTopicDetail = (topicId: string) => {
    setSelectedTopic(topicId)
    setIsDetailOpen(true)
  }
  
  const displayTopics = expanded ? helpTopics : helpTopics.slice(0, 3)
  
  return (
    <>
      {/* 悬浮帮助按钮 - 仅在非外部控制时显示 */}
      {!externalControl && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg",
            "hover:bg-primary/90 transition-all duration-200",
            "lg:bottom-4"
          )}
        >
          {isOpen ? <X className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
        </button>
      )}
      
      {/* 帮助面板 */}
      <div className={cn(
        "fixed right-4 bottom-36 z-40 w-80 transform transition-transform duration-300 ease-in-out",
        "lg:bottom-20",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                合成资产帮助
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className="bg-primary/20 text-primary text-[10px] px-1.5 py-0">新手指南</Badge>
                  <h4 className="text-sm font-medium">合成资产基础知识</h4>
                </div>
                <p className="text-xs">合成资产是数字形式的传统资产，如股票、商品或其他加密货币。通过铸造合成资产，您可以在区块链上获得对这些资产价格的敞口。</p>
                <Button
                  variant="link"
                  size="sm"
                  className="h-6 px-0 text-xs text-primary"
                  onClick={() => openTopicDetail('introduction')}
                >
                  了解更多 <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              
              {displayTopics.map(topic => (
                <div key={topic.id} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <button 
                    className="block w-full text-left"
                    onClick={() => openTopicDetail(topic.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {topic.icon}
                        <h4 className="font-medium text-sm">{topic.title}</h4>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{topic.description}</p>
                  </button>
                </div>
              ))}
              
              {!expanded && helpTopics.length > 3 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-primary text-sm"
                  onClick={() => setExpanded(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-1.5" />
                  查看更多帮助主题
                </Button>
              )}
              
              <Link 
                href="/help-center/synthetix" 
                className="flex items-center justify-center text-xs text-primary mt-2"
                onClick={() => setIsOpen(false)}
              >
                访问合成资产完整帮助中心
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 详细帮助内容对话框 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedTopic && helpTopics.find(t => t.id === selectedTopic)?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-1 mt-2">
            {selectedTopic && <HelpContent topic={selectedTopic} />}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 点击背景关闭帮助面板 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 