'use client'

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Bell, HelpCircle, AlertTriangle, RefreshCw, MenuIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

import CollateralOverview from "@/components/collateral/CollateralOverview"
import CollateralSidebar from "@/components/collateral/CollateralSidebar"
import ActiveCollaterals from "@/components/collateral/ActiveCollaterals"
import CollateralHistory from "@/components/collateral/CollateralHistory"
import RiskManagement from "@/components/collateral/RiskManagement"
import MarketTrends from "@/components/collateral/MarketTrends"
import HelpWidget from "@/components/collateral/HelpWidget"
import CollateralCompare from "@/components/collateral/CollateralCompare"
import CollateralForecast from "@/components/collateral/CollateralForecast"
import SearchFilter, { FilterOption } from "@/components/collateral/SearchFilter"
import PriceAlertModal from '@/components/collateral/PriceAlertModal'

// 简单的骨架屏组件
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`h-5 w-full animate-pulse rounded-md bg-muted ${className}`}
    {...props}
  />
)

export default function CollateralPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<{ symbol: string; price: number } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  
  // 模拟数据
  const stats = {
    totalCollateralValue: 18825.5,
    totalDebt: 9700,
    avgCollateralRatio: 194.1,
    availableBorrow: 5250.7,
    healthStatus: "安全",
    healthPercentage: 85,
    liquidationThreshold: 130,
    assetDistribution: [
      { name: "Aptos", symbol: "APT", value: 2922.5, color: "#1DE9B6", id: "apt" },
      { name: "Wrapped Bitcoin", symbol: "WBTC", value: 6420, color: "#F7931A", id: "btc" },
      { name: "Staked Aptos", symbol: "stAPT", value: 4260, color: "#27AE60", id: "stapt" },
      { name: "Ethereum", symbol: "ETH", value: 2760, color: "#627EEA", id: "eth" },
      { name: "Solana", symbol: "SOL", value: 2462.5, color: "#00FFA3", id: "sol" }
    ]
  }

  // 模拟加载
  setTimeout(() => {
    setIsLoading(false)
  }, 1500)
  
  // 模拟数据刷新
  const handleRefreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }
  
  // 处理打开价格预警设置
  const handleOpenPriceAlert = (asset: { symbol: string; price: number }) => {
    setSelectedAsset(asset)
    setIsPriceAlertModalOpen(true)
  }
  
  // 处理保存价格预警
  const handleSavePriceAlert = (data: any) => {
    console.log('Saved price alert:', data)
    // 这里可以调用API保存预警设置
  }
  
  // 过滤选项
  const filterOptions: FilterOption[] = [
    { value: "apt", label: "APT", group: "资产类型" },
    { value: "btc", label: "BTC", group: "资产类型" },
    { value: "eth", label: "ETH", group: "资产类型" },
    { value: "sol", label: "SOL", group: "资产类型" },
    { value: "stapt", label: "stAPT", group: "资产类型" },
    { value: "high-risk", label: "高风险", group: "风险等级" },
    { value: "medium-risk", label: "中等风险", group: "风险等级" },
    { value: "low-risk", label: "低风险", group: "风险等级" },
    { value: "active", label: "活跃", group: "状态" },
    { value: "inactive", label: "非活跃", group: "状态" },
  ]
  
  // 处理搜索和过滤
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    console.log("搜索:", value)
  }

  const handleFiltersChange = (filters: string[]) => {
    setActiveFilters(filters)
    console.log("应用过滤:", filters)
  }
  
  // 处理标签切换
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    // 关闭移动端侧边栏
    if (isSidebarOpen) {
      setIsSidebarOpen(false)
    }
    // 滚动到内容顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* 移动端侧边栏切换按钮 */}
      <button 
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MenuIcon className="h-6 w-6" />
      </button>
      
      {/* 侧边栏 - 移动端时使用绝对定位 */}
      <div className={cn(
        "lg:w-64 lg:min-h-screen lg:border-r lg:border-border bg-background",
        "fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out",
        "w-64 h-full shadow-lg",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <CollateralSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
      </div>
      
      {/* 主内容区 */}
      <div className="flex-1 p-4 md:p-6 lg:ml-0 w-full">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">抵押品管理</h1>
            <div className="flex mt-4 sm:mt-0 space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshData}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                {isRefreshing ? '更新中...' : '刷新数据'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleOpenPriceAlert({ symbol: 'APT', price: 8.75 })}>
                <Bell className="h-4 w-4 mr-2" />
                价格预警
              </Button>
              <Button 
                variant={isHelpOpen ? "default" : "outline"}
                size="sm" 
                onClick={() => setIsHelpOpen(!isHelpOpen)}
                className="relative"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                帮助
                {isHelpOpen && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></span>
                )}
              </Button>
            </div>
          </div>
          
          {/* 搜索和过滤 */}
          <div className="mb-6">
            <SearchFilter 
              onSearchChange={handleSearch}
              onFiltersChange={handleFiltersChange}
              filterOptions={filterOptions}
              placeholder="搜索抵押品、交易..."
            />
          </div>
          
          {/* 抵押品总览 - 加载状态 */}
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[200px]" />
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-[250px]" />
                <Skeleton className="h-[250px]" />
              </div>
            </div>
          ) : (
            <>
              {/* 抵押品总览 */}
              {activeTab === 'overview' && (
                <CollateralOverview stats={stats} searchQuery={searchQuery} activeFilters={activeFilters} />
              )}
              
              {stats.healthPercentage < 50 && (
                <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg p-4 flex items-center mt-6">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-3 flex-shrink-0" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    您的抵押率正在接近清算阈值。建议增加抵押品或偿还部分债务以提高您的抵押品健康度。
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* 标签内容区 */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
            <TabsList className="mb-0 py-2 bg-transparent overflow-x-auto flex whitespace-nowrap">
              <TabsTrigger value="overview">总览</TabsTrigger>
              <TabsTrigger value="active">活跃抵押品</TabsTrigger>
              <TabsTrigger value="history">历史记录</TabsTrigger>
              <TabsTrigger value="risk">风险管理</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="pt-6">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <>
                <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h2 className="text-xl font-semibold">抵押品总览</h2>
                    <div className="text-sm text-muted-foreground">
                      最后更新: {new Date().toLocaleString('zh-CN')}
                    </div>
                  </div>
                  <ActiveCollaterals searchQuery={searchQuery} activeFilters={activeFilters} />
                  
                  {/* 市场趋势 */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">市场趋势</h3>
                    <MarketTrends />
                  </div>
                </TabsContent>
                
                <TabsContent value="active" className="space-y-6 animate-in fade-in-50 duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h2 className="text-xl font-semibold">活跃抵押品</h2>
                    <div className="text-sm text-muted-foreground">
                      最后更新: {new Date().toLocaleString('zh-CN')}
                    </div>
                  </div>
                  <ActiveCollaterals searchQuery={searchQuery} activeFilters={activeFilters} />
                  
                  {/* 抵押品比较工具 */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">抵押品比较工具</h3>
                    <CollateralCompare />
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="space-y-6 animate-in fade-in-50 duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h2 className="text-xl font-semibold">抵押品历史</h2>
                    <div className="text-sm text-muted-foreground">
                      显示最近30天的操作记录
                    </div>
                  </div>
                  <CollateralHistory searchQuery={searchQuery} activeFilters={activeFilters} />
                </TabsContent>
                
                <TabsContent value="risk" className="space-y-6 animate-in fade-in-50 duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h2 className="text-xl font-semibold">风险管理</h2>
                    <div className="text-sm text-muted-foreground">
                      风险指标和预测分析
                    </div>
                  </div>
                  <RiskManagement />
                  
                  {/* 抵押品预测分析 */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">抵押品预测分析</h3>
                    <CollateralForecast />
                  </div>
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </div>
      
      {/* 帮助组件 */}
      <HelpWidget 
        externalControl={true}
        isOpenExternal={isHelpOpen}
        onOpenChange={setIsHelpOpen}
      />
      
      {/* 价格预警模态框 */}
      <PriceAlertModal
        isOpen={isPriceAlertModalOpen}
        onClose={() => setIsPriceAlertModalOpen(false)}
        onSave={handleSavePriceAlert}
        asset={selectedAsset}
      />
      
      {/* 移动端侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
} 