'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Bell, Info, CheckCircle, X, ChevronRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type BannerType = 'info' | 'warning' | 'success' | 'error' | 'announcement'
type BannerPosition = 'top' | 'bottom'

interface NotificationBannerProps {
  type?: BannerType
  title?: string
  message: string
  dismissible?: boolean
  autoHideDuration?: number
  position?: BannerPosition
  action?: {
    label: string
    onClick: () => void
  }
  linkText?: string
  linkUrl?: string
  className?: string
  onDismiss?: () => void
  compact?: boolean
  icon?: React.ReactNode
}

export function NotificationBanner({
  type = 'info',
  title,
  message,
  dismissible = true,
  autoHideDuration,
  position = 'top',
  action,
  linkText,
  linkUrl,
  className,
  onDismiss,
  compact = false,
  icon
}: NotificationBannerProps) {
  const [visible, setVisible] = useState(true)
  
  // 自动隐藏
  useEffect(() => {
    if (autoHideDuration && visible) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, autoHideDuration)
      
      return () => clearTimeout(timer)
    }
  }, [autoHideDuration, visible])
  
  // 处理关闭
  const handleDismiss = () => {
    setVisible(false)
    if (onDismiss) onDismiss()
  }
  
  // 如果不可见则不渲染
  if (!visible) return null
  
  // 不同类型的图标和样式
  const icons = {
    info: <Info className={cn("h-5 w-5", compact && "h-4 w-4")} />,
    warning: <AlertCircle className={cn("h-5 w-5", compact && "h-4 w-4")} />,
    success: <CheckCircle className={cn("h-5 w-5", compact && "h-4 w-4")} />,
    error: <AlertCircle className={cn("h-5 w-5", compact && "h-4 w-4")} />,
    announcement: <Bell className={cn("h-5 w-5", compact && "h-4 w-4")} />
  }
  
  const styles = {
    info: 'bg-primary/10 text-primary border-primary/30',
    warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
    success: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
    error: 'bg-destructive/10 text-destructive border-destructive/30',
    announcement: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
  }
  
  return (
    <div
      className={cn(
        'border rounded-lg p-4 animate-fadeIn',
        compact && 'py-2.5 px-3',
        styles[type],
        position === 'bottom' ? 'mb-4' : 'mt-4',
        className
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 self-start pt-0.5">
          {icon || icons[type]}
        </div>
        
        <div className="flex-1 min-w-0">
          {title && (
            <div className={cn(
              "font-medium",
              compact ? "text-sm" : "text-base"
            )}>
              {title}
            </div>
          )}
          
          <div className={cn(
            compact ? "text-xs" : "text-sm",
            title ? "mt-1" : ""
          )}>
            {message}
          </div>
          
          {(action || linkText) && (
            <div className={cn(
              "flex items-center gap-4 flex-wrap",
              compact ? "mt-1.5" : "mt-3"
            )}>
              {action && (
                <Button 
                  size={compact ? "sm" : "default"} 
                  variant="secondary" 
                  className={cn("h-auto", compact && "text-xs py-1")}
                  onClick={action.onClick}
                >
                  {action.label}
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              )}
              
              {linkText && linkUrl && (
                <Link
                  href={linkUrl}
                  className={cn(
                    "inline-flex items-center text-primary underline-offset-4 hover:underline",
                    compact ? "text-xs" : "text-sm"
                  )}
                >
                  {linkText}
                  <ExternalLink className={cn(
                    "ml-1",
                    compact ? "h-3 w-3" : "h-3.5 w-3.5"
                  )} />
                </Link>
              )}
            </div>
          )}
        </div>
        
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              "flex-shrink-0 self-start rounded-full p-1 hover:bg-background/80 transition-colors",
              compact ? "text-xs" : "text-sm"
            )}
            aria-label="关闭通知"
          >
            <X className={cn(
              compact ? "h-3.5 w-3.5" : "h-4 w-4"
            )} />
          </button>
        )}
      </div>
    </div>
  )
} 