"use client";

import { useEffect, useState, useCallback } from "react";
import { useAutoConnect } from "@/components/AutoConnectProvider";
import { DisplayValue, LabelValueGrid } from "@/components/LabelValueGrid";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WalletSelector as ShadcnWalletSelector } from "@/components/WalletSelector";
import { SingleSigner } from "@/components/transactionFlows/SingleSigner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { isMainnet } from "@/utils";
import { Network } from "@aptos-labs/ts-sdk";
import {
  AccountInfo,
  AdapterWallet,
  AptosChangeNetworkOutput,
  NetworkInfo,
  OriginWalletDetails,
  isAptosNetwork,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { init as initTelegram } from "@telegram-apps/sdk";
import { AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";
// Imports for registering a browser extension wallet plugin on page load
import { MyWallet } from "@/utils/standardWallet";
import { registerWallet } from "@aptos-labs/wallet-standard";
import { CCTPTransfer } from "@/components/CCTPTransfer";
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Shield, 
  Database, 
  CreditCard, 
  Sliders, 
  Menu, 
  ChevronRight, 
  X, 
  RefreshCw, 
  HelpCircle,
  Loader2,
  DollarSign,
  Users,
  ExternalLink
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MintAssetModal } from '@/components/synthetix/MintAssetModal'
import { MarketChart } from '@/components/synthetix/MarketChart'
import { AssetDetailsModal } from '@/components/synthetix/AssetDetailsModal'
import SynthetixHelpWidget from "@/components/synthetix/HelpWidget"
import { EmptyState } from "@/components/synthetix/EmptyState"
import { NotificationBanner } from "@/components/synthetix/NotificationBanner"
import { MintSuccessCard } from '@/components/synthetix/MintSuccessCard'
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// Example of how to register a browser extension wallet plugin.
// Browser extension wallets should call registerWallet once on page load.
// When you click "Connect Wallet", you should see "Example Wallet"
(function () {
  if (typeof window === "undefined") return;
  const myWallet = new MyWallet();
  registerWallet(myWallet);
})();

const isTelegramMiniApp =
  typeof window !== "undefined" &&
  (window as any).TelegramWebviewProxy !== undefined;
if (isTelegramMiniApp) {
  initTelegram();
}

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
  liquidity?: number
  description?: string
  oracleSource?: string
  fee?: number
  lastUpdated?: string
}

// 错误状态接口
interface ErrorState {
  hasError: boolean
  message: string
  type: 'network' | 'data' | 'permission' | 'unknown'
}

// 临时图标组件
const AssetIcon = ({ symbol, name, src }: { symbol: string; name: string; src?: string }) => (
  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background border text-xs font-medium overflow-hidden">
    {src ? (
      <img 
        src={src} 
        alt={name} 
        className="h-6 w-6" 
        onError={(e) => {
          e.currentTarget.src = "";
          e.currentTarget.parentElement!.textContent = symbol.slice(0, 2);
        }}
      />
    ) : (
      symbol.slice(0, 2)
    )}
  </div>
)

// 浮动通知组件
const FloatingNotification = ({ 
  asset, 
  amount, 
  show, 
  onClose
}: { 
  asset: SyntheticAsset | null, 
  amount: number, 
  show: boolean, 
  onClose: () => void 
}) => {
  if (!show || !asset) return null
  
  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-sm bg-card shadow-lg rounded-lg border p-4 bounce-in",
        "flex items-start gap-3"
      )}
    >
      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      </div>
      <div className="flex-1">
        <div className="font-medium mb-1">铸造成功！</div>
        <div className="text-sm text-muted-foreground mb-2">
          您已成功铸造 {amount} {asset.symbol}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs px-2"
            onClick={onClose}
          >
            关闭
          </Button>
          <Button 
            size="sm" 
            className="h-7 text-xs px-2" 
            onClick={() => window.location.href="/assets"}
          >
            查看资产
          </Button>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 absolute top-2 right-2" 
        onClick={onClose}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}

export default function SynthetixPage() {
  const {
    account,
    connected,
    network,
    wallet,
    changeNetwork,
    getOriginWalletDetails,
  } = useWallet();

  const [originWalletDetails, setOriginWalletDetails] = useState<
    OriginWalletDetails | undefined
  >(undefined);

  // 基础界面状态
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('market')
  const [activeCategory, setActiveCategory] = useState('all')
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedAsset, setSelectedAsset] = useState<SyntheticAsset | null>(null)
  const [isMintModalOpen, setIsMintModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  
  // 增强状态管理
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<ErrorState | null>(null)
  const [hasLoadedData, setHasLoadedData] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'info' | 'warning' | 'success' | 'error';
    message: string;
    title?: string;
  } | null>(null)
  
  // 添加排序功能
  const [sortConfig, setSortConfig] = useState<{ 
    key: keyof SyntheticAsset, 
    direction: 'asc' | 'desc' 
  }>({ key: 'marketCap', direction: 'desc' })
  
  // 状态增加铸造成功相关
  const [mintSuccess, setMintSuccess] = useState(false)
  const [mintedAmount, setMintedAmount] = useState(0)
  const [mintTxHash, setMintTxHash] = useState('')
  const [mintTimestamp, setMintTimestamp] = useState<Date | null>(null)
  
  // 添加最近铸造记录
  const [recentlyMinted, setRecentlyMinted] = useState<Array<{
    asset: SyntheticAsset;
    amount: number;
    txHash: string;
    timestamp: Date;
  }>>([])
  
  // 浮动通知状态
  const [showFloatingNotification, setShowFloatingNotification] = useState(false)
  
  // 模拟数据加载
  const fetchAssetData = useCallback(async () => {
    try {
      setIsRefreshing(true)
      
      // 模拟网络请求
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟随机错误 (1/10概率)
      if (Math.random() < 0.1 && !isInitialLoad) {
        throw new Error('网络连接失败，请检查您的网络设置并重试。')
      }
      
      setHasLoadedData(true)
      setError(null)
      setIsInitialLoad(false)
      
      // 模拟成功通知 (非首次加载时)
      if (!isInitialLoad) {
        setNotification({
          show: true,
          type: 'success',
          message: '数据已成功更新',
          title: '更新成功'
        })
        
        // 3秒后自动关闭通知
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      }
    } catch (err) {
      console.error('获取数据失败', err)
      setError({
        hasError: true,
        message: err instanceof Error ? err.message : '获取数据失败，请重试',
        type: 'network'
      })
      
      // 显示错误通知
      setNotification({
        show: true,
        type: 'error',
        message: err instanceof Error ? err.message : '获取数据失败，请重试',
        title: '加载错误'
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [isInitialLoad])
  
  // 初始加载
  useEffect(() => {
    fetchAssetData()
  }, [fetchAssetData])
  
  // 处理数据刷新
  const handleRefreshData = () => {
    if (isRefreshing) return
    fetchAssetData()
  }
  
  // 清除错误
  const handleClearError = () => {
    setError(null)
    
    // 如果之前没有成功加载数据，则尝试重新加载
    if (!hasLoadedData) {
      setIsLoading(true)
      fetchAssetData()
    }
  }
  
  // 关闭通知
  const handleDismissNotification = () => {
    setNotification(null)
  }
  
  // 合成资产数据
  const syntheticAssets: SyntheticAsset[] = [
    {
      id: '1',
      name: '合成比特币',
      symbol: 'tpxBTC',
      category: 'crypto',
      icon: '/icons/btc.svg',
      price: 35842.12,
      change24h: 1.85,
      marketCap: 3942633,
      volume: 358421,
      mintAmount: 110,
      liquidity: 2850000,
      fee: 0.3,
      oracleSource: 'Chainlink, Pyth',
      lastUpdated: '1分钟前',
      description: '跟踪比特币（BTC）价格的合成资产，由Triplex协议支持。'
    },
    {
      id: '2',
      name: '合成以太坊',
      symbol: 'tpxETH',
      category: 'crypto',
      icon: '/icons/eth.svg',
      price: 2113.20,
      change24h: 0.92,
      marketCap: 4226400,
      volume: 296848,
      mintAmount: 2000,
      liquidity: 2150000,
      fee: 0.3,
      oracleSource: 'Chainlink, Pyth',
      lastUpdated: '3分钟前',
      description: '跟踪以太坊（ETH）价格的合成资产，由Triplex协议支持。'
    },
    {
      id: '3',
      name: '合成Aptos代币',
      symbol: 'tpxAPT',
      category: 'crypto',
      icon: '/icons/apt.svg',
      price: 8.24,
      change24h: 2.34,
      marketCap: 423516,
      volume: 93112,
      mintAmount: 51398,
      liquidity: 350000,
      fee: 0.3,
      oracleSource: 'Pyth',
      lastUpdated: '2分钟前',
      description: '跟踪Aptos（APT）价格的合成资产，由Triplex协议支持。'
    },
    {
      id: '4',
      name: '合成Solana',
      symbol: 'tpxSOL',
      category: 'crypto',
      icon: '/icons/sol.svg',
      price: 79.20,
      change24h: -1.23,
      marketCap: 1267200,
      volume: 101376,
      mintAmount: 16000,
      liquidity: 950000,
      fee: 0.3,
      oracleSource: 'Chainlink, Pyth',
      lastUpdated: '4分钟前',
      description: '跟踪Solana（SOL）价格的合成资产，由Triplex协议支持。'
    },
    {
      id: '5',
      name: '合成黄金',
      symbol: 'tpxGOLD',
      category: 'commodity',
      icon: '/icons/gold.svg',
      price: 1970.00,
      change24h: -0.37,
      marketCap: 2955000,
      volume: 78800,
      mintAmount: 1500,
      liquidity: 1420000,
      fee: 0.35,
      oracleSource: 'Chainlink',
      lastUpdated: '15分钟前',
      description: '跟踪黄金市场价格的合成资产，由Triplex协议支持。'
    },
    {
      id: '6',
      name: '合成白银',
      symbol: 'tpxSILVER',
      category: 'commodity',
      icon: '/icons/silver.svg',
      price: 24.35,
      change24h: 0.62,
      marketCap: 1217500,
      volume: 36525,
      mintAmount: 50000,
      liquidity: 675000,
      fee: 0.35,
      oracleSource: 'Chainlink',
      lastUpdated: '15分钟前',
      description: '跟踪白银市场价格的合成资产，由Triplex协议支持。'
    },
    {
      id: '7',
      name: '合成原油',
      symbol: 'tpxCRUDE',
      category: 'commodity',
      icon: '/icons/oil.svg',
      price: 74.88,
      change24h: 1.05,
      marketCap: 494604,
      volume: 17223,
      mintAmount: 6605,
      liquidity: 320000,
      fee: 0.4,
      oracleSource: 'Chainlink',
      lastUpdated: '30分钟前',
      description: '跟踪原油（WTI）市场价格的合成资产，由Triplex协议支持。'
    },
    // 外汇资产
    {
      id: '8',
      name: '合成美元/欧元',
      symbol: 'tpxEUR/USD',
      category: 'forex',
      icon: '/icons/eur.svg',
      price: 1.078,
      change24h: -0.32,
      marketCap: 862400,
      volume: 43350,
      mintAmount: 800000,
      liquidity: 580000,
      fee: 0.25,
      oracleSource: 'Chainlink, Pyth',
      lastUpdated: '5分钟前',
      description: '跟踪欧元兑美元汇率的合成资产，由Triplex协议支持。'
    },
    {
      id: '9',
      name: '合成美元/日元',
      symbol: 'tpxJPY/USD',
      category: 'forex',
      icon: '/icons/jpy.svg',
      price: 0.0064,
      change24h: 0.41,
      marketCap: 640000,
      volume: 38640,
      mintAmount: 10000000,
      liquidity: 420000,
      fee: 0.25,
      oracleSource: 'Chainlink',
      lastUpdated: '8分钟前',
      description: '跟踪日元兑美元汇率的合成资产，由Triplex协议支持。'
    },
    {
      id: '10',
      name: '合成英镑/美元',
      symbol: 'tpxGBP/USD',
      category: 'forex',
      icon: '/icons/gbp.svg',
      price: 1.262,
      change24h: -0.18,
      marketCap: 757200,
      volume: 32780,
      mintAmount: 600000,
      liquidity: 510000,
      fee: 0.25,
      oracleSource: 'Chainlink, Pyth',
      lastUpdated: '10分钟前',
      description: '跟踪英镑兑美元汇率的合成资产，由Triplex协议支持。'
    },
    {
      id: '11',
      name: '合成澳元/美元',
      symbol: 'tpxAUD/USD',
      category: 'forex',
      icon: '/icons/aud.svg',
      price: 0.661,
      change24h: 0.23,
      marketCap: 528800,
      volume: 21152,
      mintAmount: 800000,
      liquidity: 350000,
      fee: 0.25,
      oracleSource: 'Chainlink',
      lastUpdated: '12分钟前',
      description: '跟踪澳元兑美元汇率的合成资产，由Triplex协议支持。'
    },
    {
      id: '12',
      name: '合成人民币/美元',
      symbol: 'tpxCNY/USD',
      category: 'forex',
      icon: '/icons/cny.svg',
      price: 0.137,
      change24h: -0.04,
      marketCap: 685000,
      volume: 27400,
      mintAmount: 5000000,
      liquidity: 460000,
      fee: 0.25,
      oracleSource: 'Chainlink, Pyth',
      lastUpdated: '15分钟前',
      description: '跟踪人民币兑美元汇率的合成资产，由Triplex协议支持。'
    },
    // 股票资产
    {
      id: '13',
      name: '合成苹果股票',
      symbol: 'tpxAAPL',
      category: 'stock',
      icon: '/icons/aapl.svg',
      price: 212.47,
      change24h: 1.72,
      marketCap: 1062350,
      volume: 53118,
      mintAmount: 5000,
      liquidity: 720000,
      fee: 0.35,
      oracleSource: 'Chainlink, Pyth',
      lastUpdated: '5分钟前',
      description: '跟踪苹果公司股票价格的合成资产，由Triplex协议支持。'
    },
    {
      id: '14',
      name: '合成特斯拉股票',
      symbol: 'tpxTSLA',
      category: 'stock',
      icon: '/icons/tsla.svg',
      price: 239.35,
      change24h: -2.14,
      marketCap: 957400,
      volume: 59838,
      mintAmount: 4000,
      liquidity: 650000,
      fee: 0.35,
      oracleSource: 'Chainlink, Pyth',
      lastUpdated: '8分钟前',
      description: '跟踪特斯拉公司股票价格的合成资产，由Triplex协议支持。'
    },
    {
      id: '15',
      name: '合成亚马逊股票',
      symbol: 'tpxAMZN',
      category: 'stock',
      icon: '/icons/amzn.svg',
      price: 196.24,
      change24h: 0.86,
      marketCap: 981200,
      volume: 49060,
      mintAmount: 5000,
      liquidity: 680000,
      fee: 0.35,
      oracleSource: 'Chainlink',
      lastUpdated: '10分钟前',
      description: '跟踪亚马逊公司股票价格的合成资产，由Triplex协议支持。'
    },
    {
      id: '16',
      name: '合成微软股票',
      symbol: 'tpxMSFT',
      category: 'stock',
      icon: '/icons/msft.svg',
      price: 410.32,
      change24h: 0.34,
      marketCap: 1025800,
      volume: 41032,
      mintAmount: 2500,
      liquidity: 700000,
      fee: 0.35,
      oracleSource: 'Chainlink',
      lastUpdated: '12分钟前',
      description: '跟踪微软公司股票价格的合成资产，由Triplex协议支持。'
    },
    {
      id: '17',
      name: '合成阿里巴巴股票',
      symbol: 'tpxBABA',
      category: 'stock',
      icon: '/icons/baba.svg',
      price: 82.17,
      change24h: -0.63,
      marketCap: 574190,
      volume: 24651,
      mintAmount: 7000,
      liquidity: 380000,
      fee: 0.35,
      oracleSource: 'Chainlink, Pyth',
      lastUpdated: '15分钟前',
      description: '跟踪阿里巴巴公司股票价格的合成资产，由Triplex协议支持。'
    }
  ]
  
  // 过滤资产
  const filteredAssets = syntheticAssets.filter(asset => {
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!asset.name.toLowerCase().includes(query) && 
          !asset.symbol.toLowerCase().includes(query)) {
        return false
      }
    }
    
    // 类别过滤
    if (activeCategory !== 'all' && asset.category !== activeCategory) {
      return false
    }
    
    return true
  })
  
  // 排序函数
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];
    
    if (valueA === undefined || valueB === undefined) return 0;
    
    if (valueA < valueB) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // 排序请求处理
  const requestSort = (key: keyof SyntheticAsset) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }
  
  // 市场统计数据
  const marketStats = {
    totalMarketCap: syntheticAssets.reduce((sum, asset) => sum + asset.marketCap, 0),
    totalVolume: syntheticAssets.reduce((sum, asset) => sum + asset.volume, 0),
    totalTransactions: 15631,
    activeHolders: 2845
  }
  
  // 处理铸造操作
  const handleMint = (asset: SyntheticAsset) => {
    setSelectedAsset(asset)
    setIsMintModalOpen(true)
    setMintSuccess(false)
  }
  
  // 显示资产详情
  const handleShowDetails = (asset: SyntheticAsset) => {
    setSelectedAsset(asset)
    setIsDetailsModalOpen(true)
  }
  
  // 完成铸造
  const handleCompleteMint = (asset: SyntheticAsset, amount: number) => {
    console.log(`铸造 ${amount} ${asset.symbol}，价值 $${(amount * asset.price).toFixed(2)}`)
    
    // 生成模拟的交易哈希
    const randomTxHash = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    
    // 更新铸造成功状态
    setMintSuccess(true)
    setMintedAmount(amount)
    setMintTxHash(randomTxHash)
    setMintTimestamp(new Date())
    
    // 添加到最近铸造的资产列表
    const newRecentlyMinted = [
      { 
        asset, 
        amount, 
        txHash: randomTxHash, 
        timestamp: new Date() 
      },
      ...recentlyMinted.slice(0, 4) // 只保留最新的5个
    ];
    setRecentlyMinted(newRecentlyMinted);
    
    // 显示成功通知
    setNotification({
      show: true,
      type: 'success',
      message: `成功铸造 ${amount} ${asset.symbol}`,
      title: '铸造成功'
    })
    
    // 显示浮动通知
    setShowFloatingNotification(true)
    
    // 3秒后关闭普通通知，5秒后关闭浮动通知
    setTimeout(() => {
      setNotification(null)
    }, 3000)
    
    setTimeout(() => {
      setShowFloatingNotification(false)
    }, 5000)
    
    // 触发成功动画
    playSuccessAnimation();
  }
  
  // 播放成功动画
  const playSuccessAnimation = () => {
    // 这里可以添加一些动画效果
    // 例如：使用DOM操作或第三方库
    
    // 模拟添加临时类然后移除
    if (typeof document !== 'undefined') {
      const body = document.body;
      body.classList.add('mint-success-flash');
      
      setTimeout(() => {
        body.classList.remove('mint-success-flash');
      }, 1500);
    }
  }
  
  // 继续铸造
  const handleMintMore = () => {
    setMintSuccess(false)
    setIsMintModalOpen(true)
  }
  
  // 查看资产
  const handleViewAssets = () => {
    // 跳转至资产页面
    window.location.href = '/assets'
  }

  useEffect(() => {
    if (!wallet) return;
    const fetchOriginWalletDetails = async () => {
      const details = await getOriginWalletDetails(wallet);
      setOriginWalletDetails(details);
    };
    fetchOriginWalletDetails();
  }, [wallet]);

  // 导航项配置
  const navItems = [
    { 
      name: '抵押借贷', 
      href: '/borrow',
      icon: <CreditCard className="h-4 w-4 mr-2" />
    },
    { 
      name: '合成资产', 
      href: '/synthetix',
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      active: true
    },
    { 
      name: '资产管理', 
      href: '/assets',
      icon: <PieChart className="h-4 w-4 mr-2" />
    },
    { 
      name: '清算监控', 
      href: '/liquidation',
      icon: <Shield className="h-4 w-4 mr-2" />
    },
    { 
      name: '预言机数据', 
      href: '/oracle',
      icon: <Database className="h-4 w-4 mr-2" />
    },
    { 
      name: '风险参数', 
      href: '/risk',
      icon: <Sliders className="h-4 w-4 mr-2" />
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container grid flex-1 gap-12 md:grid-cols-[250px_1fr] px-4 py-6">
        {/* 移动端导航按钮 */}
        <div className="mb-6 flex md:hidden justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">合成资产市场</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="relative"
            >
              {isRefreshing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCw className="h-5 w-5" />
              )}
              <span className="sr-only">刷新数据</span>
            </Button>
            <Button 
              variant={isHelpOpen ? "default" : "outline"}
              size="icon"
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              className="relative"
            >
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">帮助</span>
              {isHelpOpen && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></span>
              )}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">打开菜单</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[320px]">
                <DialogHeader className="pb-6">
                  <DialogTitle>合成资产导航</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-1 py-2">
                  {navItems.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      className={`flex items-center justify-between rounded-md px-3 py-3 hover:bg-accent ${
                        item.active ? 'bg-accent/50 font-medium text-primary' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        {item.name}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
                <div className="rounded-lg border bg-card p-4 mt-6">
                  <h3 className="mb-2 text-base font-medium">热门合成资产</h3>
                  <div className="space-y-2">
                    {syntheticAssets.slice(0, 3).map(asset => (
                      <div key={asset.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background border overflow-hidden text-xs font-medium">
                            <img 
                              src={asset.icon} 
                              alt={asset.symbol} 
                              className="h-5 w-5" 
                              onError={(e) => {
                                e.currentTarget.src = "";
                                e.currentTarget.textContent = asset.symbol.slice(0, 2);
                              }}
                            />
                          </div>
                          <span>{asset.symbol}</span>
                        </div>
                        <div className="text-sm">
                          ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="hidden md:block space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">合成资产导航</h3>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="sr-only">刷新数据</span>
                </Button>
                <Button 
                  variant={isHelpOpen ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setIsHelpOpen(!isHelpOpen)}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span className="sr-only">帮助</span>
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`flex items-center rounded-md px-3 py-2 hover:bg-accent ${
                    item.active ? 'bg-accent/50 font-medium text-primary' : ''
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-4 text-lg font-medium">热门合成资产</h3>
            <div className="space-y-3">
              {isLoading ? (
                // 加载骨架屏
                Array(5).fill(0).map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-7 w-7 rounded-full" />
                      <Skeleton className="h-4 w-14" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))
              ) : (
                syntheticAssets.slice(0, 5).map(asset => (
                  <button 
                    key={asset.id} 
                    className="flex items-center justify-between w-full text-left hover:bg-accent/50 p-1.5 rounded-md transition-colors"
                    onClick={() => handleShowDetails(asset)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background border overflow-hidden text-xs font-medium">
                        <img 
                          src={asset.icon} 
                          alt={asset.symbol} 
                          className="h-5 w-5" 
                          onError={(e) => {
                            e.currentTarget.src = "";
                            e.currentTarget.textContent = asset.symbol.slice(0, 2);
                          }}
                        />
                      </div>
                      <span>{asset.symbol}</span>
                    </div>
                    <div className="text-sm">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
          
          {/* 统计卡片 */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-3 text-lg font-medium">市场统计</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">总市值：</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span>${marketStats.totalMarketCap.toLocaleString()}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">24小时交易量：</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span>${marketStats.totalVolume.toLocaleString()}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">活跃持有者：</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>{marketStats.activeHolders.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 主内容区 */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="hidden md:block text-3xl font-bold tracking-tight">合成资产市场</h1>
            <div className="hidden md:flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.location.href="/borrow"}>
                抵押借贷
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href="/assets"}>
                资产管理
              </Button>
            </div>
          </div>
          
          {/* 通知横幅 */}
          {notification && notification.show && (
            <NotificationBanner
              type={notification.type}
              title={notification.title}
              message={notification.message}
              dismissible={true}
              onDismiss={handleDismissNotification}
            />
          )}
          
          {/* 加载状态 */}
          {isLoading ? (
            <div className="space-y-6">
              <div className="h-[200px] animate-pulse bg-muted rounded-lg"></div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="h-[80px] animate-pulse bg-muted rounded-lg"></div>
                <div className="h-[80px] animate-pulse bg-muted rounded-lg"></div>
                <div className="h-[80px] animate-pulse bg-muted rounded-lg"></div>
                <div className="h-[80px] animate-pulse bg-muted rounded-lg"></div>
              </div>
              <div className="h-[400px] animate-pulse bg-muted rounded-lg"></div>
            </div>
          ) : error && error.hasError ? (
            // 错误状态
            <EmptyState
              type="error"
              title={error.type === 'network' ? '网络错误' : '数据加载失败'}
              message={error.message}
              action={{
                label: '重试',
                onClick: handleClearError
              }}
              secondaryAction={{
                label: '查看帮助',
                onClick: () => setIsHelpOpen(true)
              }}
            />
          ) : (
            <>
              {/* 市场概览卡片 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>市场概览</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleRefreshData}
                      disabled={isRefreshing}
                    >
                      {isRefreshing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      {isRefreshing ? '更新中...' : '刷新数据'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-accent/50 p-4 text-center">
                      <div className="text-2xl font-bold">${marketStats.totalMarketCap.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">总市值</div>
                    </div>
                    <div className="rounded-lg bg-accent/50 p-4 text-center">
                      <div className="text-2xl font-bold">${marketStats.totalVolume.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">24小时交易量</div>
                    </div>
                    <div className="rounded-lg bg-accent/50 p-4 text-center">
                      <div className="text-2xl font-bold">{marketStats.totalTransactions.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">铸造交易数</div>
                    </div>
                    <div className="rounded-lg bg-accent/50 p-4 text-center">
                      <div className="text-2xl font-bold">{marketStats.activeHolders.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">活跃持有者</div>
                    </div>
                  </div>
                  
                  {/* 市值走势图 */}
                  <div className="mt-6 w-full">
                    <MarketChart 
                      type="line" 
                      height={300} 
                      timeRange={timeRange}
                      title="合成资产市场总市值走势"
                    />
                  </div>
                  
                  <div className="mt-4 flex gap-2">
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
                  
                  {/* 最近铸造记录 */}
                  {recentlyMinted.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-sm font-medium mb-3">您最近的铸造记录</h3>
                      <div className="space-y-3">
                        {recentlyMinted.map((item, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between rounded-lg border p-3 bg-card hover:bg-accent/50 cursor-pointer"
                            onClick={() => handleShowDetails(item.asset)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border overflow-hidden">
                                <img 
                                  src={item.asset.icon} 
                                  alt={item.asset.symbol} 
                                  className="h-5 w-5" 
                                  onError={(e) => {
                                    e.currentTarget.src = "";
                                    e.currentTarget.textContent = item.asset.symbol.slice(0, 2);
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium">{item.amount} {item.asset.symbol}</div>
                                <div className="text-xs text-muted-foreground">
                                  {item.timestamp.toLocaleString('zh-CN', { 
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="h-6 whitespace-nowrap">
                                已确认
                              </Badge>
                              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                <Link 
                                  href={`https://explorer.aptoslabs.com/txn/${item.txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* 合成资产列表 */}
              <Card>
                <CardHeader>
                  <CardTitle>合成资产列表</CardTitle>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="搜索资产名称或代号..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant={activeCategory === 'all' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setActiveCategory('all')}
                      >
                        全部
                      </Badge>
                      <Badge 
                        variant={activeCategory === 'crypto' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setActiveCategory('crypto')}
                      >
                        加密货币
                      </Badge>
                      <Badge 
                        variant={activeCategory === 'commodity' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setActiveCategory('commodity')}
                      >
                        实物资产
                      </Badge>
                      <Badge 
                        variant={activeCategory === 'forex' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setActiveCategory('forex')}
                      >
                        外汇
                      </Badge>
                      <Badge 
                        variant={activeCategory === 'stock' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setActiveCategory('stock')}
                      >
                        股票
                      </Badge>
                      <Badge 
                        variant={activeCategory === 'rwa' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setActiveCategory('rwa')}
                      >
                        实物资产
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="market">市场概况</TabsTrigger>
                      <TabsTrigger value="trading">交易数据</TabsTrigger>
                      <TabsTrigger value="holders">持有分布</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="market" className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>资产</TableHead>
                              <TableHead>最新价格</TableHead>
                              <TableHead>24小时变化</TableHead>
                              <TableHead>市值</TableHead>
                              <TableHead>交易量</TableHead>
                              <TableHead>铸造数量</TableHead>
                              <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortedAssets.map(asset => (
                              <TableRow key={asset.id} className="cursor-pointer" onClick={() => handleShowDetails(asset)}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border overflow-hidden text-xs font-medium">
                                      <img 
                                        src={asset.icon} 
                                        alt={asset.symbol} 
                                        className="h-6 w-6" 
                                        onError={(e) => {
                                          e.currentTarget.src = "";
                                          e.currentTarget.textContent = asset.symbol.slice(0, 2);
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <button 
                                        className="font-medium hover:text-primary hover:underline"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleShowDetails(asset);
                                        }}
                                      >
                                        {asset.symbol}
                                      </button>
                                      <div className="text-xs text-muted-foreground">{asset.name}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  ${asset.price.toLocaleString(undefined, { 
                                    minimumFractionDigits: 2, 
                                    maximumFractionDigits: 2 
                                  })}
                                </TableCell>
                                <TableCell>
                                  <div className={`flex items-center ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {asset.change24h >= 0 ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                                  </div>
                                </TableCell>
                                <TableCell>${asset.marketCap.toLocaleString()}</TableCell>
                                <TableCell>${asset.volume.toLocaleString()}</TableCell>
                                <TableCell>{asset.mintAmount.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    size="sm" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMint(asset);
                                    }}
                                  >
                                    铸造
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                            
                            {sortedAssets.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                  没有找到匹配的合成资产
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="trading" className="p-0">
                      <div className="space-y-6">
                        <Card className="p-4">
                          <h3 className="text-lg font-medium mb-2">24小时交易量 (按资产)</h3>
                          <div className="h-[300px]">
                            <MarketChart type="bar" height={300} />
                          </div>
                        </Card>
                        
                        <Card className="p-4">
                          <h3 className="text-lg font-medium mb-2">交易活跃度 (小时分布)</h3>
                          <div className="h-[200px]">
                            <MarketChart type="line" height={200} />
                          </div>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="holders" className="p-0">
                      <div className="space-y-6">
                        <Card className="p-4">
                          <h3 className="text-lg font-medium mb-2">持有者分布</h3>
                          <div className="h-[300px]">
                            <MarketChart type="pie" height={300} />
                          </div>
                        </Card>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="p-4">
                            <h3 className="text-lg font-medium mb-2">持有时长分布</h3>
                            <div className="h-[200px]">
                              <MarketChart type="pie" height={200} />
                            </div>
                          </Card>
                          <Card className="p-4">
                            <h3 className="text-lg font-medium mb-2">持有者类型</h3>
                            <div className="h-[200px]">
                              <MarketChart type="pie" height={200} />
                            </div>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* 市场分析 */}
              <Card>
                <CardHeader>
                  <CardTitle>市场分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 text-sm font-medium text-muted-foreground">资产类别分布</div>
                      <div className="h-[200px]">
                        <MarketChart type="pie" height={200} title="" />
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 text-sm font-medium text-muted-foreground">24小时交易量分布</div>
                      <div className="h-[200px]">
                        <MarketChart type="pie" height={200} title="" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="mb-3 text-lg font-medium">每日交易量趋势</h3>
                    <MarketChart type="bar" height={200} timeRange={timeRange} title="" />
                  </div>
                  
                  <div className="mt-6 rounded-lg bg-primary/10 p-4">
                    <h3 className="mb-2 font-medium text-primary">市场趋势分析</h3>
                    <p className="text-sm">近30天合成资产市场总体呈上升趋势，加密货币类合成资产铸造量增长20.5%，实物资产类增长15.2%。tpxBTC和tpxETH继续占据最大市场份额，tpxGOLD在实物资产类中表现突出。</p>
                    <p className="mt-2 text-sm">值得注意的是，合成原油tpxCRUDE近期价格波动较大，反映了全球原油市场的不确定性。建议投资者关注相关资产的价格风险。</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* 铸造与赎回数据 */}
              <Card>
                <CardHeader>
                  <CardTitle>铸造与赎回数据</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 text-sm font-medium text-muted-foreground">铸造与赎回对比</div>
                      <div className="h-[200px]">
                        <MarketChart type="bar" height={200} title="" />
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 text-sm font-medium text-muted-foreground">用户增长趋势</div>
                      <div className="h-[200px]">
                        <MarketChart type="line" height={200} title="" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="mb-3 text-lg font-medium">热门合成资产TOP 5 (30天铸造量)</h3>
                    <MarketChart type="bar" height={200} title="" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      
      {/* 铸造模态框 */}
      <MintAssetModal
        asset={selectedAsset}
        isOpen={isMintModalOpen && !mintSuccess}
        onClose={() => setIsMintModalOpen(false)}
        onMint={handleCompleteMint}
      />
      
      {/* 铸造成功卡片 */}
      {mintSuccess && selectedAsset && mintTimestamp && (
        <Dialog open={isMintModalOpen} onOpenChange={(open) => !open && setIsMintModalOpen(false)}>
          <DialogContent className="sm:max-w-[500px]">
            <MintSuccessCard
              asset={selectedAsset}
              amount={mintedAmount}
              txHash={mintTxHash}
              timestamp={mintTimestamp}
              onViewAssets={handleViewAssets}
              onMintMore={handleMintMore}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* 资产详情模态框 */}
      <AssetDetailsModal
        asset={selectedAsset}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onMint={handleMint}
      />
      
      {/* 帮助组件 */}
      <SynthetixHelpWidget 
        externalControl={true}
        isOpenExternal={isHelpOpen}
        onOpenChange={setIsHelpOpen}
      />
      
      {/* 浮动通知组件 */}
      <FloatingNotification
        asset={selectedAsset}
        amount={mintedAmount}
        show={showFloatingNotification}
        onClose={() => setShowFloatingNotification(false)}
      />
    </div>
  )
}

function WalletSelection() {
  const { autoConnect, setAutoConnect } = useAutoConnect();

  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap gap-6 pt-6 pb-12 justify-between items-center">
          <div className="flex flex-col gap-4 items-center">
            <ShadcnWalletSelector />
          </div>
        </div>
        <label className="flex items-center gap-4 cursor-pointer">
          <Switch
            id="auto-connect-switch"
            checked={autoConnect}
            onCheckedChange={setAutoConnect}
          />
          <Label htmlFor="auto-connect-switch">
            Auto reconnect on page load
          </Label>
        </label>
      </CardContent>
    </Card>
  );
}

interface WalletConnectionProps {
  account: AccountInfo | null;
  network: NetworkInfo | null;
  wallet: AdapterWallet | null;
  originWalletDetails: OriginWalletDetails | undefined;
  changeNetwork: (network: Network) => Promise<AptosChangeNetworkOutput>;
}

function WalletConnection({
  account,
  network,
  wallet,
  changeNetwork,
  originWalletDetails,
}: WalletConnectionProps) {
  const { isSolanaDerivedWallet, isEIP1193DerivedWallet } = useWallet();

  const isValidNetworkName = () => {
    if (isAptosNetwork(network)) {
      return Object.values<string | undefined>(Network).includes(network?.name);
    }
    // If the configured network is not an Aptos network, i.e is a custom network
    // we resolve it as a valid network name
    return true;
  };

  const isNetworkChangeSupported =
    wallet?.features["aptos:changeNetwork"] !== undefined;

  const aptosAccountInfoLabels = [
    {
      label: "Address",
      value: (
        <DisplayValue
          value={account?.address?.toString() ?? "Not Present"}
          isCorrect={!!account?.address}
        />
      ),
    },
    {
      label: "Public key",
      value: (
        <DisplayValue
          value={account?.publicKey?.toString() ?? "Not Present"}
          isCorrect={!!account?.publicKey}
        />
      ),
    },
    {
      label: "ANS name",
      subLabel: "(only if attached)",
      value: <p>{account?.ansName ?? "Not Present"}</p>,
    },
  ];
  if (
    wallet &&
    (isSolanaDerivedWallet(wallet) || isEIP1193DerivedWallet(wallet))
  ) {
    aptosAccountInfoLabels.push({
      label: "Origin Wallet Address",
      value: (
        <DisplayValue
          value={originWalletDetails?.address.toString() ?? "Not Present"}
          isCorrect={!!originWalletDetails?.address}
        />
      ),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Connection</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-10 pt-6">
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-medium">Wallet Details</h4>
          <LabelValueGrid
            items={[
              {
                label: "Icon",
                value: wallet?.icon ? (
                  <Image
                    src={wallet.icon}
                    alt={wallet.name}
                    width={24}
                    height={24}
                  />
                ) : (
                  "Not Present"
                ),
              },
              {
                label: "Name",
                value: <p>{wallet?.name ?? "Not Present"}</p>,
              },
              {
                label: "URL",
                value: wallet?.url ? (
                  <a
                    href={wallet.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-300"
                  >
                    {wallet.url}
                  </a>
                ) : (
                  "Not Present"
                ),
              },
            ]}
          />
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-medium">Aptos Account Info</h4>
          <LabelValueGrid items={aptosAccountInfoLabels} />
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-medium">Network Info</h4>
          <LabelValueGrid
            items={[
              {
                label: "Network name",
                value: (
                  <DisplayValue
                    value={network?.name ?? "Not Present"}
                    isCorrect={isValidNetworkName()}
                    expected={Object.values<string>(Network).join(", ")}
                  />
                ),
              },
              {
                label: "URL",
                value: network?.url ? (
                  <a
                    href={network.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-300"
                  >
                    {network.url}
                  </a>
                ) : (
                  "Not Present"
                ),
              },
              {
                label: "Chain ID",
                value: <p>{network?.chainId ?? "Not Present"}</p>,
              },
            ]}
          />
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-medium">Change Network</h4>
          <RadioGroup
            value={network?.name}
            orientation="horizontal"
            className="flex gap-6"
            onValueChange={(value: Network) => changeNetwork(value)}
            disabled={!isNetworkChangeSupported}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Network.DEVNET} id="devnet-radio" />
              <Label htmlFor="devnet-radio">Devnet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Network.TESTNET} id="testnet-radio" />
              <Label htmlFor="testnet-radio">Testnet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Network.MAINNET} id="mainnet-radio" />
              <Label htmlFor="mainnet-radio">Mainnet</Label>
            </div>
          </RadioGroup>
          {!isNetworkChangeSupported && (
            <div className="text-sm text-red-600 dark:text-red-400">
              * {wallet?.name ?? "This wallet"} does not support network change
              requests
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
