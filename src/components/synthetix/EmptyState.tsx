'use client'

import { Button } from '@/components/ui/button'
import { 
  AlertCircle, 
  SearchX, 
  FilterX, 
  RefreshCw, 
  ServerOff, 
  CheckCircle, 
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

type StateType = 
  | 'empty' 
  | 'noResults' 
  | 'error' 
  | 'serverError' 
  | 'filtered' 
  | 'success' 
  | 'info'

interface EmptyStateProps {
  type?: StateType
  title?: string
  message?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  type = 'empty',
  title,
  message,
  icon,
  action,
  secondaryAction,
  className
}: EmptyStateProps) {
  // 默认状态配置
  const stateConfig = {
    empty: {
      icon: <SearchX className="h-10 w-10 text-muted-foreground" />,
      title: '没有可用数据',
      message: '当前没有可显示的数据，请稍后再试或尝试其他筛选条件。',
      actionLabel: '刷新数据'
    },
    noResults: {
      icon: <SearchX className="h-10 w-10 text-muted-foreground" />,
      title: '没有找到结果',
      message: '没有找到符合您搜索条件的结果，请尝试其他关键词。',
      actionLabel: '清除搜索'
    },
    error: {
      icon: <AlertCircle className="h-10 w-10 text-destructive" />,
      title: '发生错误',
      message: '加载数据时发生错误，请重试或联系支持团队。',
      actionLabel: '重试'
    },
    serverError: {
      icon: <ServerOff className="h-10 w-10 text-destructive" />,
      title: '服务器错误',
      message: '无法连接到服务器，请检查您的网络连接或稍后再试。',
      actionLabel: '重试'
    },
    filtered: {
      icon: <FilterX className="h-10 w-10 text-muted-foreground" />,
      title: '没有匹配的结果',
      message: '当前筛选条件下没有匹配的数据，请尝试调整筛选条件。',
      actionLabel: '清除筛选'
    },
    success: {
      icon: <CheckCircle className="h-10 w-10 text-green-500" />,
      title: '操作成功',
      message: '您的操作已完成。',
      actionLabel: '继续'
    },
    info: {
      icon: <Info className="h-10 w-10 text-primary" />,
      title: '提示信息',
      message: '这里有一些您可能需要了解的信息。',
      actionLabel: '了解更多'
    }
  }
  
  const currentConfig = stateConfig[type]
  
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center px-6 py-12 text-center",
        className
      )}
    >
      {icon || currentConfig.icon}
      
      <h3 className="mt-6 text-lg font-medium">
        {title || currentConfig.title}
      </h3>
      
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        {message || currentConfig.message}
      </p>
      
      <div className="mt-6 flex gap-3">
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
        
        {!action && !secondaryAction && currentConfig.actionLabel && (
          <Button className="inline-flex items-center gap-1">
            {type === 'empty' && <RefreshCw className="h-4 w-4" />}
            {currentConfig.actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
} 