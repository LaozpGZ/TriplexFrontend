'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, ChevronRight, ExternalLink, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HelpTopic {
  id: string
  title: string
  description: string
  link: string
}

interface HelpWidgetProps {
  externalControl?: boolean
  isOpenExternal?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export default function HelpWidget({ 
  externalControl = false, 
  isOpenExternal = false, 
  onOpenChange 
}: HelpWidgetProps) {
  const helpTopics: HelpTopic[] = [
    {
      id: 'collateral-ratio',
      title: '什么是抵押率？',
      description: '抵押率是抵押品价值与借款价值的比率，它决定了您的头寸健康度和清算风险。',
      link: '/help-center/collateral-ratio'
    },
    {
      id: 'liquidation',
      title: '如何避免清算？',
      description: '了解清算机制和预防措施，保持健康的抵押率，设置价格预警。',
      link: '/help-center/liquidation-prevention'
    },
    {
      id: 'add-collateral',
      title: '如何添加抵押品？',
      description: '学习如何向您的头寸添加更多抵押品，增加安全边际，降低清算风险。',
      link: '/help-center/add-collateral'
    },
    {
      id: 'withdraw',
      title: '什么时候可以撤回抵押品？',
      description: '了解安全撤回抵押品的条件和最佳实践，以优化资本效率。',
      link: '/help-center/withdraw-collateral'
    }
  ]
  
  const [expanded, setExpanded] = useState(false)
  const [isOpenInternal, setIsOpenInternal] = useState(false)
  
  // 使用外部或内部控制的状态
  const isOpen = externalControl ? isOpenExternal : isOpenInternal
  const setIsOpen = (open: boolean) => {
    if (externalControl && onOpenChange) {
      onOpenChange(open)
    } else {
      setIsOpenInternal(open)
    }
  }
  
  const displayTopics = expanded ? helpTopics : helpTopics.slice(0, 2)
  
  return (
    <>
      {/* 悬浮帮助按钮 - 仅在非外部控制时显示 */}
      {!externalControl && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "fixed bottom-20 left-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg",
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
                帮助中心
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
              {displayTopics.map(topic => (
                <div key={topic.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <Link href={topic.link} className="block">
                    <h4 className="font-medium flex items-center justify-between">
                      {topic.title}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                  </Link>
                </div>
              ))}
              
              {!expanded && helpTopics.length > 2 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-primary"
                  onClick={() => setExpanded(true)}
                >
                  查看更多帮助主题
                </Button>
              )}
              
              <Link href="/help-center" className="flex items-center justify-center text-sm text-primary mt-2">
                访问完整帮助中心
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
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