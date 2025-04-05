'use client'

import { Card } from "@/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart, 
  Clock, 
  Users 
} from "lucide-react"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { AssetAllocation } from "@/components/dashboard/AssetAllocation"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { ActivePositions } from "@/components/dashboard/ActivePositions"

// 模拟数据
const mockAssets = [
  { name: "以太坊", symbol: "ETH", value: 5432.10, color: "#627EEA", percentage: 45.3 },
  { name: "比特币", symbol: "BTC", value: 3210.50, color: "#F7931A", percentage: 26.8 },
  { name: "USDC", symbol: "USDC", value: 2500.00, color: "#2775CA", percentage: 20.9 },
  { name: "Solana", symbol: "SOL", value: 845.75, color: "#14F195", percentage: 7.0 },
]

const mockTransactions = [
  { 
    id: "tx1", 
    type: "deposit", 
    amount: "1.5", 
    symbol: "ETH", 
    timestamp: "2小时前", 
    status: "success" as const, 
    txHash: "0x1234567890abcdef1234567890abcdef12345678" 
  },
  { 
    id: "tx2", 
    type: "mint", 
    amount: "2,500", 
    symbol: "trxUSD", 
    timestamp: "5小时前", 
    status: "success" as const, 
    txHash: "0xabcdef1234567890abcdef1234567890abcdef12" 
  },
  { 
    id: "tx3", 
    type: "borrow", 
    amount: "0.5", 
    symbol: "BTC", 
    timestamp: "1天前", 
    status: "pending" as const, 
    txHash: "0x7890abcdef1234567890abcdef1234567890abcd" 
  },
  { 
    id: "tx4", 
    type: "repay", 
    amount: "1,000", 
    symbol: "trxUSD", 
    timestamp: "2天前", 
    status: "success" as const, 
    txHash: "0xdef1234567890abcdef1234567890abcdef12345" 
  },
]

const mockPositions = [
  {
    id: "pos1",
    type: "long" as const,
    asset: "比特币",
    symbol: "BTC",
    amount: "0.25",
    entryPrice: "$43,500.00",
    currentPrice: "$45,678.90",
    pnl: 544.73,
    pnlPercentage: 5.01,
    collateralAmount: "2",
    collateralSymbol: "ETH",
    healthFactor: 2.35,
    liquidationPrice: "$36,240.00"
  },
  {
    id: "pos2",
    type: "short" as const,
    asset: "以太坊",
    symbol: "ETH",
    amount: "2.5",
    entryPrice: "$2,450.00",
    currentPrice: "$2,345.67",
    pnl: 260.83,
    pnlPercentage: 4.26,
    collateralAmount: "5,000",
    collateralSymbol: "USDC",
    healthFactor: 1.42,
    liquidationPrice: "$2,689.00"
  },
]

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      
      {/* 用户资产概览 */}
      <div className="mb-8">
        <DashboardOverview 
          totalValue="$12,000.00"
          collateralValue="$8,500.00"
          syntheticValue="$3,500.00"
          healthFactor={2.1}
          collateralRatio={175}
        />
      </div>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="总锁仓价值 (TVL)" 
          value="$1,234,567.89" 
          change="+5.67%" 
          isPositive={true}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard 
          title="总借贷价值" 
          value="$789,012.34" 
          change="-2.34%" 
          isPositive={false}
          icon={<BarChart className="h-5 w-5" />}
        />
        <StatCard 
          title="总交易量" 
          value="$9,876,543.21" 
          change="+12.45%" 
          isPositive={true}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard 
          title="活跃用户数" 
          value="3,456" 
          change="+8.90%" 
          isPositive={true}
          icon={<Users className="h-5 w-5" />}
        />
      </div>
      
      {/* 活跃头寸和资产配置 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ActivePositions positions={mockPositions} />
        <AssetAllocation assets={mockAssets} totalValue="$11,988.35" />
      </div>
      
      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="锁仓价值趋势" />
        <ChartCard title="借贷量趋势" />
      </div>
      
      {/* 最近交易 */}
      <div className="mb-8">
        <RecentTransactions transactions={mockTransactions} />
      </div>
      
      {/* 信息卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-medium mb-4">资产分布</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-text-secondary">资产</th>
                  <th className="pb-3 text-left font-medium text-text-secondary">价格</th>
                  <th className="pb-3 text-left font-medium text-text-secondary">24h 变化</th>
                  <th className="pb-3 text-left font-medium text-text-secondary">总锁仓量</th>
                </tr>
              </thead>
              <tbody>
                <AssetRow 
                  symbol="BTC" 
                  price="$45,678.90" 
                  change="+2.34%" 
                  isPositive={true} 
                  volume="123.45 BTC" 
                />
                <AssetRow 
                  symbol="ETH" 
                  price="$2,345.67" 
                  change="-1.23%" 
                  isPositive={false} 
                  volume="789.01 ETH" 
                />
                <AssetRow 
                  symbol="USDC" 
                  price="$1.00" 
                  change="+0.01%" 
                  isPositive={true} 
                  volume="1,234,567.89 USDC" 
                />
                <AssetRow 
                  symbol="SOL" 
                  price="$123.45" 
                  change="+5.67%" 
                  isPositive={true} 
                  volume="5,678.90 SOL" 
                />
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-xl font-medium mb-4">市场概况</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-text-secondary mb-1">比特币支配地位</div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">45.3%</span>
                <span className="text-success">+0.8%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-[#F7931A]"
                  style={{ width: "45.3%" }}
                />
              </div>
            </div>
            <div>
              <div className="text-sm text-text-secondary mb-1">全球加密市场总值</div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">$2.47万亿</span>
                <span className="text-success">+3.2%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-primary"
                  style={{ width: "73.2%" }}
                />
              </div>
            </div>
            <div>
              <div className="text-sm text-text-secondary mb-1">24小时交易量</div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">$1,430亿</span>
                <span className="text-success">+5.7%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-primary"
                  style={{ width: "58.9%" }}
                />
              </div>
            </div>
            <div>
              <div className="text-sm text-text-secondary mb-1">DeFi总锁仓价值</div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">$570亿</span>
                <span className="text-error">-2.1%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-primary"
                  style={{ width: "43.5%" }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: React.ReactNode
}

function StatCard({ title, value, change, isPositive, icon }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-full">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className={`flex items-center ${isPositive ? 'text-success' : 'text-error'}`}>
        {isPositive ? (
          <TrendingUp className="h-4 w-4 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 mr-1" />
        )}
        <span>{change}</span>
      </div>
    </Card>
  )
}

interface ChartCardProps {
  title: string
}

function ChartCard({ title }: ChartCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      <div className="h-[300px] flex items-center justify-center bg-card/50 rounded-md text-text-secondary">
        图表将在实际部署中显示
      </div>
    </Card>
  )
}

interface AssetRowProps {
  symbol: string
  price: string
  change: string
  isPositive: boolean
  volume: string
}

function AssetRow({ symbol, price, change, isPositive, volume }: AssetRowProps) {
  return (
    <tr className="border-b border-border">
      <td className="py-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium mr-2">
            {symbol.charAt(0)}
          </div>
          <span>{symbol}</span>
        </div>
      </td>
      <td className="py-4">{price}</td>
      <td className={`py-4 ${isPositive ? 'text-success' : 'text-error'}`}>{change}</td>
      <td className="py-4">{volume}</td>
    </tr>
  )
} 