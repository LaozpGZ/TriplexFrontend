'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  PlusCircle, 
  ArrowUpRight, 
  AlertCircle 
} from "lucide-react"

interface DashboardOverviewProps {
  totalValue: string
  collateralValue: string
  syntheticValue: string
  healthFactor: number
  collateralRatio: number
}

export function DashboardOverview({
  totalValue = "$0.00",
  collateralValue = "$0.00",
  syntheticValue = "$0.00",
  healthFactor = 0,
  collateralRatio = 0
}: DashboardOverviewProps) {
  // 健康因子状态
  const getHealthStatus = (factor: number) => {
    if (factor >= 2) return { status: "安全", color: "text-success" }
    if (factor >= 1.5) return { status: "注意", color: "text-warning" }
    return { status: "危险", color: "text-error" }
  }
  
  const healthStatus = getHealthStatus(healthFactor)
  
  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div>
          <h2 className="text-2xl font-bold">您的资产概览</h2>
          <p className="text-text-secondary mt-1">查看您在Triplex上的资产和头寸情况</p>
        </div>
        
        {healthFactor < 1.5 && (
          <div className="flex items-center p-3 bg-error/10 text-error rounded-lg text-sm">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>您的健康因子较低，存在清算风险。请添加抵押品或偿还部分合成资产。</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <ValueCard 
          title="总资产价值" 
          value={totalValue} 
        />
        <ValueCard 
          title="抵押品价值" 
          value={collateralValue} 
          actionButton={
            <Button size="sm" variant="outline" className="mt-2">
              <PlusCircle className="h-4 w-4 mr-1" />
              添加抵押品
            </Button>
          }
        />
        <ValueCard 
          title="合成资产价值" 
          value={syntheticValue}
          actionButton={
            <Button size="sm" variant="outline" className="mt-2">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              管理资产
            </Button>
          }
        />
        <div className="bg-card-foreground/5 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-text-secondary">健康指标</h3>
              <div className="flex items-center mt-2">
                <Shield className="h-5 w-5 text-primary mr-2" />
                <span className="font-medium">健康因子</span>
              </div>
              <div className={`text-xl font-bold mt-1 ${healthStatus.color}`}>
                {healthFactor.toFixed(2)}
              </div>
              <div className={`text-sm ${healthStatus.color}`}>
                {healthStatus.status}
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-text-secondary">抵押率</span>
              <div className="text-xl font-bold mt-1">
                {collateralRatio.toFixed(2)}%
              </div>
              <div className="text-sm text-text-secondary">
                最低要求: 150%
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  collateralRatio >= 200 ? 'bg-success' : 
                  collateralRatio >= 150 ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${Math.min(100, (collateralRatio / 3))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface ValueCardProps {
  title: string
  value: string
  subtitle?: string
  actionButton?: React.ReactNode
}

function ValueCard({ title, value, subtitle, actionButton }: ValueCardProps) {
  return (
    <div className="bg-card-foreground/5 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {subtitle && <div className="text-sm text-text-secondary mt-1">{subtitle}</div>}
      {actionButton}
    </div>
  )
} 