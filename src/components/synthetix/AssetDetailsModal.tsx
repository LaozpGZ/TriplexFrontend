import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarketChart } from '@/components/synthetix/MarketChart'
import { Card } from '@/components/ui/card'
import { ChevronUp, ChevronDown } from 'lucide-react'

// 合成资产接口
interface SyntheticAsset {
  id: string
  name: string
  symbol: string
  category: 'crypto' | 'commodity' | 'forex' | 'stock' | 'rwa'
  icon: string
  price: number
  change24h: number
  marketCap: number
  volume: number
  mintAmount: number
}

interface AssetDetailsModalProps {
  asset: SyntheticAsset | null
  isOpen: boolean
  onClose: () => void
  onMint: (asset: SyntheticAsset) => void
}

export function AssetDetailsModal({ asset, isOpen, onClose, onMint }: AssetDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [timeRange, setTimeRange] = useState<string>('7d')
  
  // 模拟历史数据
  const priceHistory = [
    { date: '2023-03-01', price: asset?.price ? asset.price * 0.9 : 0 },
    { date: '2023-03-02', price: asset?.price ? asset.price * 0.92 : 0 },
    { date: '2023-03-03', price: asset?.price ? asset.price * 0.95 : 0 },
    { date: '2023-03-04', price: asset?.price ? asset.price * 0.94 : 0 },
    { date: '2023-03-05', price: asset?.price ? asset.price * 0.98 : 0 },
    { date: '2023-03-06', price: asset?.price ? asset.price * 1.01 : 0 },
    { date: '2023-03-07', price: asset?.price ? asset.price * 1.0 : 0 },
  ]
  
  // 模拟市场数据
  const marketData = {
    allTimeHigh: asset?.price ? asset.price * 1.4 : 0,
    allTimeLow: asset?.price ? asset.price * 0.6 : 0,
    marketCap: asset?.marketCap || 0,
    fullyDilutedValuation: asset?.marketCap ? asset.marketCap * 1.5 : 0,
    volume24h: asset?.volume || 0,
    volumeToMarketCap: asset?.volume && asset.marketCap ? (asset.volume / asset.marketCap) : 0,
    circulatingSupply: asset?.mintAmount || 0,
    totalSupply: asset?.mintAmount ? asset.mintAmount * 1.2 : 0,
    maxSupply: asset?.mintAmount ? asset.mintAmount * 5 : 0
  }
  
  if (!asset) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border overflow-hidden">
              <img src={asset.icon} alt={asset.symbol} className="h-6 w-6" onError={(e) => {
                e.currentTarget.src = "";
                e.currentTarget.onerror = null;
                e.currentTarget.textContent = asset.symbol.slice(0, 2);
              }} />
            </div>
            {asset.name} ({asset.symbol})
          </DialogTitle>
          <DialogDescription>
            合成资产详情信息
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {/* 价格信息 */}
          <div className="col-span-1 md:col-span-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <div className="text-3xl font-bold">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`flex items-center ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {asset.change24h >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h}% (24小时)
                </div>
              </div>
              <Button onClick={() => onMint(asset)}>铸造{asset.symbol}</Button>
            </div>
          </div>
          
          {/* 标签页导航 */}
          <div className="col-span-1 md:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">市场概览</TabsTrigger>
                <TabsTrigger value="price">价格走势</TabsTrigger>
                <TabsTrigger value="metrics">指标分析</TabsTrigger>
              </TabsList>
              
              {/* 市场概览 */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-2">价格走势</h3>
                    <div className="h-[200px]">
                      <MarketChart type="line" height={200} timeRange={timeRange} />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant={timeRange === '24h' ? 'default' : 'outline'} 
                        onClick={() => setTimeRange('24h')}
                        size="sm"
                      >
                        24h
                      </Button>
                      <Button 
                        variant={timeRange === '7d' ? 'default' : 'outline'} 
                        onClick={() => setTimeRange('7d')}
                        size="sm"
                      >
                        7d
                      </Button>
                      <Button 
                        variant={timeRange === '30d' ? 'default' : 'outline'} 
                        onClick={() => setTimeRange('30d')}
                        size="sm"
                      >
                        30d
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-2">市场数据</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">市值排名</span>
                        <span>#{Math.floor(Math.random() * 100) + 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">市值</span>
                        <span>${marketData.marketCap.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">24小时交易量</span>
                        <span>${marketData.volume24h.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">流通量</span>
                        <span>{marketData.circulatingSupply.toLocaleString()} {asset.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">总供应量</span>
                        <span>{marketData.totalSupply.toLocaleString()} {asset.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">最大供应量</span>
                        <span>{marketData.maxSupply.toLocaleString()} {asset.symbol}</span>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-2">关于 {asset.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {asset.name} ({asset.symbol}) 是一种由 Triplex 协议铸造的合成资产，与实际的 
                    {asset.category === 'crypto' ? ` ${asset.name.replace('合成', '')}` : asset.category === 'commodity' ? ` ${asset.name.replace('合成', '')}商品` : ''} 
                    价格挂钩。持有者可以在不实际持有底层资产的情况下，获得其价格表现带来的收益。
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    合成资产由抵押品支持，保持最低抵押率，确保网络安全和资产价值。铸造者可以在任何时候通过支付足够的抵押品来铸造更多 {asset.symbol}，或者赎回他们的抵押品。
                  </p>
                  <h4 className="font-medium mt-4 mb-2">用例</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>无需KYC或受托账户即可获得对 {asset.name.replace('合成', '')} 价格表现的敞口</li>
                    <li>通过抵押品借贷获得更高的资本效率</li>
                    <li>在去中心化金融生态系统中使用</li>
                    <li>对冲现有持仓风险</li>
                  </ul>
                </Card>
              </TabsContent>
              
              {/* 价格走势 */}
              <TabsContent value="price">
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-4">价格历史</h3>
                  <div className="h-[400px]">
                    <MarketChart type="line" height={400} timeRange={timeRange} />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant={timeRange === '24h' ? 'default' : 'outline'} 
                      onClick={() => setTimeRange('24h')}
                      size="sm"
                    >
                      24小时
                    </Button>
                    <Button 
                      variant={timeRange === '7d' ? 'default' : 'outline'} 
                      onClick={() => setTimeRange('7d')}
                      size="sm"
                    >
                      7天
                    </Button>
                    <Button 
                      variant={timeRange === '30d' ? 'default' : 'outline'} 
                      onClick={() => setTimeRange('30d')}
                      size="sm"
                    >
                      30天
                    </Button>
                    <Button 
                      variant={timeRange === 'all' ? 'default' : 'outline'} 
                      onClick={() => setTimeRange('all')}
                      size="sm"
                    >
                      全部
                    </Button>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-md bg-accent/50 p-4 text-center">
                      <div className="text-sm text-muted-foreground">最高价 (全部)</div>
                      <div className="text-xl font-bold mt-1">
                        ${marketData.allTimeHigh.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="rounded-md bg-accent/50 p-4 text-center">
                      <div className="text-sm text-muted-foreground">最低价 (全部)</div>
                      <div className="text-xl font-bold mt-1">
                        ${marketData.allTimeLow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="rounded-md bg-accent/50 p-4 text-center">
                      <div className="text-sm text-muted-foreground">24小时最高</div>
                      <div className="text-xl font-bold mt-1">
                        ${(asset.price * 1.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="rounded-md bg-accent/50 p-4 text-center">
                      <div className="text-sm text-muted-foreground">24小时最低</div>
                      <div className="text-xl font-bold mt-1">
                        ${(asset.price * 0.98).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              {/* 指标分析 */}
              <TabsContent value="metrics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-2">铸造与赎回分析</h3>
                    <div className="h-[200px]">
                      <MarketChart type="bar" height={200} />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">铸造总量</span>
                        <span>{marketData.circulatingSupply.toLocaleString()} {asset.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">赎回总量</span>
                        <span>{(marketData.totalSupply - marketData.circulatingSupply).toLocaleString()} {asset.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">铸造/赎回比率</span>
                        <span>1.2</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-2">抵押分析</h3>
                    <div className="h-[200px]">
                      <MarketChart type="pie" height={200} />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">平均抵押率</span>
                        <span>175%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">总抵押品价值</span>
                        <span>${(marketData.circulatingSupply * asset.price * 1.75).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">健康指数</span>
                        <span className="text-green-500">健康</span>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <Card className="p-4 mt-4">
                  <h3 className="text-lg font-medium mb-2">市场指标</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <h4 className="text-sm text-muted-foreground">市值</h4>
                      <p className="font-medium">${marketData.marketCap.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-muted-foreground">完全稀释估值</h4>
                      <p className="font-medium">${marketData.fullyDilutedValuation.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-muted-foreground">交易量/市值</h4>
                      <p className="font-medium">{(marketData.volumeToMarketCap * 100).toFixed(2)}%</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-muted-foreground">流通量/总供应量</h4>
                      <p className="font-medium">{((marketData.circulatingSupply / marketData.totalSupply) * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>关闭</Button>
          <Button onClick={() => onMint(asset)}>铸造{asset.symbol}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 