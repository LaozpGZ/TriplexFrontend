'use client'

import { Button } from '@/components/ui/button'
import { LayoutDashboard, Wallet, History, BarChart3, HelpCircle, Settings } from 'lucide-react'

interface CollateralSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function CollateralSidebar({ activeTab, onTabChange }: CollateralSidebarProps) {
  const menuItems = [
    { id: 'overview', label: '总览', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'active', label: '活跃抵押品', icon: <Wallet className="h-5 w-5" /> },
    { id: 'history', label: '历史记录', icon: <History className="h-5 w-5" /> },
    { id: 'risk', label: '风险管理', icon: <BarChart3 className="h-5 w-5" /> }
  ]

  return (
    <div className="p-4">
      <div className="flex items-center mb-6 p-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3">
          <Wallet className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-semibold">Triplex</h2>
          <p className="text-xs text-muted-foreground">抵押品管理</p>
        </div>
      </div>

      <div className="space-y-1">
        {menuItems.map(item => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange(item.id)}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Button>
        ))}
      </div>

      <div className="absolute bottom-8 left-4 right-4 space-y-1">
        <Button variant="ghost" className="w-full justify-start">
          <HelpCircle className="h-5 w-5 mr-3" />
          帮助中心
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="h-5 w-5 mr-3" />
          账户设置
        </Button>
      </div>
    </div>
  )
} 