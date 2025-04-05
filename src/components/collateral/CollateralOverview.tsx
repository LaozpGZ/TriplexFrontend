'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export interface AssetDistribution {
  name: string
  symbol: string
  value: number
  color: string
  id: string
}

export interface CollateralStats {
  totalCollateralValue: number
  totalDebt: number
  avgCollateralRatio: number
  availableBorrow: number
  healthStatus: string
  healthPercentage: number
  liquidationThreshold: number
  assetDistribution: AssetDistribution[]
}

interface CollateralOverviewProps {
  stats: CollateralStats
  searchQuery?: string
  activeFilters?: string[]
}

export default function CollateralOverview({ stats, searchQuery = '', activeFilters = [] }: CollateralOverviewProps) {
  // 过滤资产分布数据
  const filteredAssets = stats.assetDistribution.filter(asset => {
    // 应用搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!asset.name.toLowerCase().includes(query) && 
          !asset.symbol.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // 应用过滤器
    if (activeFilters.length > 0) {
      // 只保留匹配的资产类型
      if (activeFilters.some(filter => ['apt', 'btc', 'eth', 'sol', 'stapt'].includes(filter))) {
        return activeFilters.includes(asset.id);
      }
    }
    
    return true;
  });
  
  // 重新计算过滤后的总价值
  const filteredTotal = filteredAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  // 健康度颜色
  const getHealthColor = (percentage: number) => {
    if (percentage < 60) return 'text-red-500'
    if (percentage < 80) return 'text-yellow-500'
    return 'text-green-500'
  }
  
  const getHealthBgColor = (percentage: number) => {
    if (percentage < 60) return 'bg-red-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const healthColorClass = getHealthColor(stats.healthPercentage)
  const healthBgColorClass = getHealthBgColor(stats.healthPercentage)

  // 自定义图表工具提示
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip bg-background border rounded-md shadow-md p-2 text-xs">
          <p className="font-medium">{data.symbol}</p>
          <p className="text-muted-foreground">{data.name}</p>
          <p>${data.value.toLocaleString()}</p>
          <p>{((data.value / filteredTotal) * 100).toFixed(1)}%</p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>抵押品概览</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">总抵押价值</div>
                <div className="text-right">
                  ${filteredTotal.toLocaleString()}
                  {filteredTotal !== stats.totalCollateralValue && (
                    <span className="text-xs text-muted-foreground ml-1">
                      (已过滤，总计: ${stats.totalCollateralValue.toLocaleString()})
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">已借出金额</div>
                <div>${stats.totalDebt.toLocaleString()}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">平均抵押率</div>
                <div>{stats.avgCollateralRatio.toFixed(1)}%</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">可借金额</div>
                <div>${stats.availableBorrow.toLocaleString()}</div>
              </div>
              
              <Separator className="my-2" />
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">健康状态</div>
                  <div className={healthColorClass}>{stats.healthStatus}</div>
                </div>
                <Progress 
                  value={stats.healthPercentage} 
                  className="h-2"
                  indicatorClassName={healthBgColorClass}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>危险</span>
                  <span>清算阈值: {stats.liquidationThreshold}%</span>
                  <span>安全</span>
                </div>
              </div>
            </div>
            
            {stats.healthPercentage < 60 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>抵押率过低</AlertTitle>
                <AlertDescription>
                  您的抵押率接近清算阈值。为避免清算，请增加抵押品或减少借款金额。
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex flex-col items-center justify-center py-2">
            <div className="text-sm font-medium mb-2">抵押品分布</div>
            <div className="w-full h-[180px]">
              {filteredAssets.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredAssets}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {filteredAssets.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {searchQuery || activeFilters.length > 0 
                    ? "没有匹配的抵押品数据" 
                    : "暂无抵押品数据"}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 w-full">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: asset.color }}
                  />
                  <div className="text-xs">
                    {asset.symbol} - {((asset.value / filteredTotal) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 