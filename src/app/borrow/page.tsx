'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  X,
  AlertTriangle,
  ChevronDown
} from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import LoanParameters from '@/components/borrow/LoanParameters'
import BorrowHistory from '@/components/borrow/BorrowHistory'
import BorrowFAQ from '@/components/borrow/BorrowFAQ'
import MarketInfo from '@/components/borrow/MarketInfo'
import RiskManagementGuide from '@/components/borrow/RiskManagementGuide'
import MarketTrends from '@/components/borrow/MarketTrends'
import CollateralCalculator from '@/components/borrow/CollateralCalculator'
import BorrowSimulator from '@/components/borrow/BorrowSimulator'

// 资产类型
type AssetType = 'crypto' | 'stablecoin' | 'rwa'

// 代币接口
interface Token {
  symbol: string
  name: string
  type: AssetType
  balance: string
  rate: string
  icon?: string
  price?: string
  change?: string
  priceUSD?: number
  borrowAPY?: string
  debt?: string
  canBorrow?: boolean
}

// 借贷头寸接口
interface Position {
  id: string
  collateralAsset: string
  borrowedAsset: string
  collateralRatio: number
  healthFill: number
  status: '健康' | '警告' | '危险'
  statusColor: string
}

export default function BorrowPage() {
  // 选项卡状态
  const [activeTab, setActiveTab] = useState<'borrow' | 'repay'>('borrow')
  
  // 代币选择状态
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false)
  const [isBorrowTokenSelectOpen, setBorrowTokenSelectOpen] = useState(false)
  const [isRepayTokenSelectOpen, setRepayTokenSelectOpen] = useState(false)
  const [isBorrowConfirmOpen, setBorrowConfirmOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // 确认弹窗状态
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  
  // 输入值状态
  const [collateralAmount, setCollateralAmount] = useState('')
  const [borrowAmount, setBorrowAmount] = useState('')
  const [repayAmount, setRepayAmount] = useState('')
  const [availableToBorrow, setAvailableToBorrow] = useState('0.00')
  const [collateralRatio, setCollateralRatio] = useState('∞')
  const [healthFactor, setHealthFactor] = useState(0)
  const [liquidationPrice, setLiquidationPrice] = useState(0)
  const [simulatedHealthFactor, setSimulatedHealthFactor] = useState(0)
  const [canBorrow, setCanBorrow] = useState(false)
  const [canRepay, setCanRepay] = useState(false)
  
  // 选中的代币状态
  const [selectedCollateralToken, setSelectedCollateralToken] = useState<Token>({
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    balance: '2.18',
    rate: '4.2%',
    price: '$1,950.75',
    change: '+3.6%',
    priceUSD: 1950.75,
    borrowAPY: '5.2%',
    canBorrow: true
  })
  
  const [selectedBorrowToken, setSelectedBorrowToken] = useState<Token>({
    symbol: 'USDC',
    name: 'USD Coin',
    type: 'stablecoin',
    balance: '5284.65',
    rate: '6.5%',
    price: '$1.00',
    change: '0.0%',
    priceUSD: 1.00,
    borrowAPY: '6.5%',
    debt: '1000',
    canBorrow: true
  })
  
  const [selectedRepayToken, setSelectedRepayToken] = useState<Token | null>(null)
  
  // 风险模拟器状态
  const [priceChange, setPriceChange] = useState(0)
  
  // 可用代币列表
  const tokens: Token[] = [
    { 
      symbol: 'SUI', 
      name: 'SUI', 
      type: 'crypto', 
      balance: '8.45', 
      rate: '3.5%',
      price: '$10.45',
      change: '+2.4%',
      priceUSD: 10.45,
      borrowAPY: '4.5%',
      canBorrow: true
    },
    { 
      symbol: 'ETH', 
      name: 'Ethereum', 
      type: 'crypto', 
      balance: '2.18', 
      rate: '4.2%',
      price: '$1,950.75',
      change: '+3.6%',
      priceUSD: 1950.75,
      borrowAPY: '5.2%',
      canBorrow: true
    },
    { 
      symbol: 'BTC', 
      name: 'Bitcoin', 
      type: 'crypto', 
      balance: '0.32', 
      rate: '2.8%',
      price: '$44,280.50',
      change: '+2.4%',
      priceUSD: 44280.50,
      borrowAPY: '3.8%',
      canBorrow: true
    },
    { 
      symbol: 'USDC', 
      name: 'USD Coin', 
      type: 'stablecoin', 
      balance: '5284.65', 
      rate: '6.5%',
      price: '$1.00',
      change: '0.0%',
      priceUSD: 1.00,
      borrowAPY: '6.5%',
      debt: '1000',
      canBorrow: true
    },
    { 
      symbol: 'USDT', 
      name: 'Tether', 
      type: 'stablecoin', 
      balance: '3512.87', 
      rate: '7.2%',
      price: '$1.00',
      change: '0.0%',
      priceUSD: 1.00,
      borrowAPY: '7.2%',
      canBorrow: true
    },
    { 
      symbol: 'DAI', 
      name: 'DAI', 
      type: 'stablecoin', 
      balance: '1842.12', 
      rate: '5.8%',
      price: '$1.00',
      change: '0.0%',
      priceUSD: 1.00,
      borrowAPY: '5.8%',
      debt: '500',
      canBorrow: true
    },
    { 
      symbol: 'GOLD', 
      name: 'Gold Token', 
      type: 'rwa', 
      balance: '4.75', 
      rate: '2.5%',
      price: '$1,865.20',
      change: '-0.5%',
      priceUSD: 1865.20,
      borrowAPY: '3.2%',
      canBorrow: true
    }
  ]
  
  // 当前头寸列表
  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      collateralAsset: '1.5 SUI',
      borrowedAsset: '100 USDC',
      collateralRatio: 180,
      healthFill: 75,
      status: '健康',
      statusColor: 'text-green-500'
    },
    {
      id: '2',
      collateralAsset: '0.85 ETH',
      borrowedAsset: '1,200 USDT',
      collateralRatio: 165,
      healthFill: 45,
      status: '警告',
      statusColor: 'text-amber-500'
    },
    {
      id: '3',
      collateralAsset: '2.5 BTC',
      borrowedAsset: '35,000 DAI',
      collateralRatio: 210,
      healthFill: 90,
      status: '健康',
      statusColor: 'text-green-500'
    }
  ])

  // 过滤代币列表
  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // 处理代币选择
  const [activeSelector, setActiveSelector] = useState<'collateral' | 'borrow'>('collateral')

  const handleTokenSelect = (token: Token) => {
    if (activeSelector === 'collateral') {
      setSelectedCollateralToken(token)
    } else if (activeSelector === 'borrow') {
      setSelectedBorrowToken(token)
    }
    setIsTokenSelectOpen(false)
  }
  
  // 更新抵押率
  useEffect(() => {
    const cAmount = parseFloat(collateralAmount) || 0
    const bAmount = parseFloat(borrowAmount) || 0
    
    if (bAmount > 0) {
      const collateralValue = cAmount * 250 // 假设1个抵押品=250单位借贷币
      const ratio = (collateralValue / bAmount) * 100
      setCollateralRatio(ratio.toFixed(0))
    } else {
      setCollateralRatio('∞')
    }
  }, [collateralAmount, borrowAmount])
  
  // 更新可借额度
  useEffect(() => {
    const cAmount = parseFloat(collateralAmount) || 0
    const collateralValue = cAmount * 250 // 假设1个抵押品=250单位借贷币
    setAvailableToBorrow((collateralValue * 0.8).toFixed(2))
  }, [collateralAmount])
  
  // 处理确认借贷
  const handleConfirmBorrow = () => {
    const cAmount = parseFloat(collateralAmount) || 0
    const bAmount = parseFloat(borrowAmount) || 0
    
    if (cAmount <= 0 || bAmount <= 0) {
      alert('请输入有效的抵押和借款金额')
      return
    }
    
    setIsConfirmModalOpen(true)
  }
  
  // 处理提交借贷
  const handleBorrowSubmit = () => {
    // 这里实现实际的借款逻辑
    console.log('借款已确认', {
      collateralToken: selectedCollateralToken,
      collateralAmount,
      borrowToken: selectedBorrowToken,
      borrowAmount
    })
    
    setBorrowConfirmOpen(false)
    
    // 添加新的头寸
    const newPosition: Position = {
      id: `pos-${positions.length + 1}`,
      collateralAsset: `${collateralAmount} ${selectedCollateralToken.symbol}`,
      borrowedAsset: `${borrowAmount} ${selectedBorrowToken.symbol}`,
      collateralRatio: parseInt(collateralRatio === '∞' ? '999' : collateralRatio),
      healthFill: 75,
      status: healthFactor > 1.8 ? '健康' : healthFactor > 1.2 ? '警告' : '危险',
      statusColor: healthFactor > 1.8 ? 'text-green-500' : healthFactor > 1.2 ? 'text-amber-500' : 'text-red-500'
    }
    
    setPositions([...positions, newPosition])
    
    // 重置表单
    setCollateralAmount('')
    setBorrowAmount('')
  }
  
  // 模拟价格变动对头寸的影响
  const handlePriceChangeSimulation = (value: number) => {
    setPriceChange(value)
    
    // 更新头寸的健康状态
    setPositions(prevPositions => prevPositions.map(position => {
      // 计算新的抵押率
      const newRatio = position.collateralRatio * (1 + value / 100)
      
      // 更新健康状态
      let healthFill, status, statusColor
      
      if (newRatio >= 180) {
        healthFill = newRatio > 250 ? 100 : ((newRatio - 150) / 100) * 90
        status = '健康'
        statusColor = 'text-green-500'
      } else if (newRatio >= 150) {
        healthFill = ((newRatio - 150) / 30) * 45
        status = '警告'
        statusColor = 'text-amber-500'
      } else {
        healthFill = Math.max(newRatio / 150 * 30, 5)
        status = '危险'
        statusColor = 'text-red-500'
      }
      
      return {
        ...position,
        collateralRatio: Math.round(newRatio),
        healthFill,
        status: status as '健康' | '警告' | '危险',
        statusColor
      }
    }))
  }
  
  // 重置模拟器
  const resetSimulation = () => {
    setPriceChange(0)
    
    // 重置头寸数据
    setPositions([
      {
        id: '1',
        collateralAsset: '1.5 SUI',
        borrowedAsset: '100 USDC',
        collateralRatio: 180,
        healthFill: 75,
        status: '健康',
        statusColor: 'text-green-500'
      },
      {
        id: '2',
        collateralAsset: '0.85 ETH',
        borrowedAsset: '1,200 USDT',
        collateralRatio: 165,
        healthFill: 45,
        status: '警告',
        statusColor: 'text-amber-500'
      },
      {
        id: '3',
        collateralAsset: '2.5 BTC',
        borrowedAsset: '35,000 DAI',
        collateralRatio: 210,
        healthFill: 90,
        status: '健康',
        statusColor: 'text-green-500'
      }
    ])
  }
  
  // 处理借款确认
  const handleBorrowConfirm = () => {
    setBorrowConfirmOpen(true)
  }
  
  // 处理还款提交
  const handleRepaySubmit = () => {
    // 这里实现实际的还款逻辑
    console.log('还款已确认', {
      repayToken: selectedRepayToken,
      repayAmount
    })
    
    // 更新头寸或从列表中移除
    const updatedPositions = positions.filter(
      pos => !(pos.borrowedAsset === selectedRepayToken?.symbol && 
        parseFloat(repayAmount) >= parseFloat(pos.borrowedAsset.split(' ')[0]))
    )
    
    setPositions(updatedPositions)
    
    // 重置表单
    setRepayAmount('')
  }
  
  // 处理头寸操作
  const handlePositionAction = (position: any, action: 'repay' | 'addCollateral' | 'withdraw') => {
    switch (action) {
      case 'repay':
        setActiveTab('repay')
        const repayToken = tokens.find(t => t.symbol === position.borrowedAsset)
        if (repayToken) {
          setSelectedRepayToken(repayToken)
        }
        break
      case 'addCollateral':
        setActiveTab('borrow')
        const collateralToken = tokens.find(t => t.symbol === position.collateralAsset)
        if (collateralToken) {
          setSelectedCollateralToken(collateralToken)
        }
        break
      case 'withdraw':
        // 实现提取抵押品的逻辑
        console.log('提取抵押品', position)
        break
    }
    
    // 滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">合成资产借贷</h1>
      
      {/* 市场概览 */}
      <MarketInfo />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 市场趋势 */}
          <MarketTrends />
          
          {/* 借贷模拟器 - 新增部分 */}
          <BorrowSimulator />
          
          {/* 借款表单卡片 */}
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'borrow' | 'repay')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="borrow">借款</TabsTrigger>
                <TabsTrigger value="repay">还款</TabsTrigger>
              </TabsList>
              
              <TabsContent value="borrow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 左侧抵押品输入 */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>抵押品</Label>
                      <div className="text-sm text-muted-foreground">
                        余额: {selectedCollateralToken ? selectedCollateralToken.balance : '0.00'}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-grow">
                        <div className="border rounded-lg p-3">
                          <input
                            type="text"
                            className="w-full bg-transparent border-none focus:outline-none text-xl"
                            placeholder="0.00"
                            value={collateralAmount}
                            onChange={e => setCollateralAmount(e.target.value)}
                          />
                          <div className="text-sm text-muted-foreground mt-1">
                            ≈ ${collateralAmount ? parseFloat(collateralAmount) * (selectedCollateralToken?.priceUSD || 0) : 0}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 h-auto" 
                        onClick={() => setIsTokenSelectOpen(true)}
                      >
                        {selectedCollateralToken ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              {selectedCollateralToken.symbol.substring(0, 1)}
                            </div>
                            <span>{selectedCollateralToken.symbol}</span>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <span>选择</span>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-primary" 
                      onClick={() => setCollateralAmount(selectedCollateralToken?.balance || '0')}
                    >
                      最大
                    </Button>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">抵押率</span>
                      <span className={
                        collateralRatio === '∞' ? 'text-green-500' : 
                        parseFloat(collateralRatio) >= 200 ? 'text-green-500' : 
                        parseFloat(collateralRatio) >= 150 ? 'text-amber-500' : 
                        'text-red-500'
                      }>
                        {collateralRatio === '∞' ? '∞%' : `${collateralRatio}%`}
                      </span>
                    </div>
                  </div>
                  
                  {/* 右侧借款输入 */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>借款</Label>
                      <div className="text-sm text-muted-foreground">
                        可借: {availableToBorrow}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-grow">
                        <div className="border rounded-lg p-3">
                          <input
                            type="text"
                            className="w-full bg-transparent border-none focus:outline-none text-xl"
                            placeholder="0.00"
                            value={borrowAmount}
                            onChange={e => setBorrowAmount(e.target.value)}
                          />
                          <div className="text-sm text-muted-foreground mt-1">
                            ≈ ${borrowAmount ? parseFloat(borrowAmount) * (selectedBorrowToken?.priceUSD || 0) : 0}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 h-auto" 
                        onClick={() => setBorrowTokenSelectOpen(true)}
                      >
                        {selectedBorrowToken ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              {selectedBorrowToken.symbol.substring(0, 1)}
                            </div>
                            <span>{selectedBorrowToken.symbol}</span>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <span>选择</span>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-primary" 
                      onClick={() => setBorrowAmount(availableToBorrow)}
                    >
                      最大
                    </Button>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">健康因子</span>
                      <span className={
                        healthFactor >= 2 ? 'text-green-500' : 
                        healthFactor >= 1.5 ? 'text-amber-500' : 
                        'text-red-500'
                      }>
                        {healthFactor.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button 
                    className="w-full" 
                    size="lg" 
                    disabled={!canBorrow} 
                    onClick={handleBorrowConfirm}
                  >
                    {!selectedCollateralToken || !selectedBorrowToken
                      ? '选择资产'
                      : parseFloat(collateralAmount) <= 0
                      ? '输入抵押金额'
                      : parseFloat(borrowAmount) <= 0
                      ? '输入借款金额'
                      : healthFactor < 1.2
                      ? '健康因子过低'
                      : '确认借款'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="repay">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>偿还资产</Label>
                      <div className="text-sm text-muted-foreground">
                        余额: {selectedRepayToken ? selectedRepayToken.balance : '0.00'}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-grow">
                        <div className="border rounded-lg p-3">
                          <input
                            type="text"
                            className="w-full bg-transparent border-none focus:outline-none text-xl"
                            placeholder="0.00"
                            value={repayAmount}
                            onChange={e => setRepayAmount(e.target.value)}
                          />
                          <div className="text-sm text-muted-foreground mt-1">
                            ≈ ${repayAmount ? parseFloat(repayAmount) * (selectedRepayToken?.priceUSD || 0) : 0}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 h-auto" 
                        onClick={() => setRepayTokenSelectOpen(true)}
                      >
                        {selectedRepayToken ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              {selectedRepayToken.symbol.substring(0, 1)}
                            </div>
                            <span>{selectedRepayToken.symbol}</span>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <span>选择</span>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-primary" 
                        onClick={() => setRepayAmount('50')}
                      >
                        50%
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-primary" 
                        onClick={() => setRepayAmount('75')}
                      >
                        75%
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-primary" 
                        onClick={() => setRepayAmount(selectedRepayToken?.debt || '0')}
                      >
                        100%
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">贷款余额</span>
                      <span>{selectedRepayToken?.debt || '0.00'} {selectedRepayToken?.symbol || ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">剩余贷款</span>
                      <span>
                        {repayAmount && selectedRepayToken?.debt 
                          ? Math.max(0, parseFloat(selectedRepayToken.debt) - parseFloat(repayAmount)).toFixed(2) 
                          : selectedRepayToken?.debt || '0.00'} {selectedRepayToken?.symbol || ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">还款后健康因子</span>
                      <span className="text-green-500">{(healthFactor + 0.5).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" size="lg" disabled={!canRepay} onClick={handleRepaySubmit}>
                    {!selectedRepayToken
                      ? '选择资产'
                      : parseFloat(repayAmount) <= 0
                      ? '输入还款金额'
                      : '确认还款'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
          
          {/* 当前头寸 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">当前头寸</h2>
            {positions.length > 0 ? (
              <div className="space-y-4">
                {positions.map((position, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {position.borrowedAsset.substring(0, 1)}
                        </div>
                        <div>
                          <div className="font-medium">{position.borrowedAsset}</div>
                          <div className="text-xs text-muted-foreground">借入</div>
                        </div>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className={position.status === '健康' ? 'bg-green-500/10 text-green-500 border-green-500/20' : position.status === '警告' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}
                      >
                        {position.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">借款金额</div>
                        <div className="font-medium">{position.borrowedAsset}</div>
                        <div className="text-xs text-muted-foreground">
                          ≈ ${(parseFloat(position.borrowedAsset.split(' ')[0]) * (selectedBorrowToken?.priceUSD || 0)).toFixed(2)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">抵押品</div>
                        <div className="font-medium">{position.collateralAsset}</div>
                        <div className="text-xs text-muted-foreground">
                          ≈ ${(parseFloat(position.collateralAsset.split(' ')[0]) * (selectedCollateralToken?.priceUSD || 0)).toFixed(2)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">抵押率</div>
                        <div className="font-medium">{position.collateralRatio}%</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">利率</div>
                        <div className="font-medium">{selectedBorrowToken?.rate} APR</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handlePositionAction(position, 'repay')}>
                        还款
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handlePositionAction(position, 'addCollateral')}>
                        添加抵押
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handlePositionAction(position, 'withdraw')}>
                        提取抵押
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>您目前没有活跃的借贷头寸</p>
                <p className="text-sm mt-2">选择资产并输入金额以开始借贷</p>
              </div>
            )}
          </Card>
        </div>
        
        <div className="space-y-8">
          {/* 风险管理指南 */}
          <RiskManagementGuide />
          
          {/* 抵押品计算器 */}
          <CollateralCalculator />
          
          {/* 借贷参数设置 */}
          <LoanParameters />
          
          {/* 借贷历史记录 */}
          <BorrowHistory />
        </div>
      </div>
      
      {/* 常见问题 */}
      <div className="mt-16">
        <BorrowFAQ />
      </div>
      
      {/* 代币选择模态框 */}
      <Dialog open={isTokenSelectOpen} onOpenChange={setIsTokenSelectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>选择抵押品</DialogTitle>
            <DialogDescription>
              选择您想要提供作为抵押的代币
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto">
            {tokens.map(token => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => {
                  setSelectedCollateralToken(token);
                  setIsTokenSelectOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {token.symbol.substring(0, 1)}
                  </div>
                  <div>
                    <div className="font-medium">{token.name}</div>
                    <div className="text-xs text-muted-foreground">{token.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div>{token.balance}</div>
                  <div className="text-xs text-muted-foreground">${token.priceUSD?.toFixed(2) || '0.00'}</div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isBorrowTokenSelectOpen} onOpenChange={setBorrowTokenSelectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>选择借款代币</DialogTitle>
            <DialogDescription>
              选择您想要借入的代币
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto">
            {tokens.filter(t => t.canBorrow).map(token => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => {
                  setSelectedBorrowToken(token);
                  setBorrowTokenSelectOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {token.symbol.substring(0, 1)}
                  </div>
                  <div>
                    <div className="font-medium">{token.name}</div>
                    <div className="text-xs text-muted-foreground">{token.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">利率: {token.borrowAPY}%</div>
                  <div className="text-xs text-muted-foreground">${token.priceUSD?.toFixed(2) || '0.00'}</div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isRepayTokenSelectOpen} onOpenChange={setRepayTokenSelectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>选择还款代币</DialogTitle>
            <DialogDescription>
              选择您想要偿还的借款
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto">
            {tokens.filter(t => t.debt && parseFloat(t.debt) > 0).map(token => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => {
                  setSelectedRepayToken(token);
                  setRepayTokenSelectOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {token.symbol.substring(0, 1)}
                  </div>
                  <div>
                    <div className="font-medium">{token.name}</div>
                    <div className="text-xs text-muted-foreground">{token.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div>{token.debt}</div>
                  <div className="text-xs text-muted-foreground">${(parseFloat(token.debt || '0') * (token.priceUSD || 0)).toFixed(2)}</div>
                </div>
              </div>
            ))}
            
            {tokens.filter(t => t.debt && parseFloat(t.debt) > 0).length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <p>您目前没有任何借款</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isBorrowConfirmOpen} onOpenChange={setBorrowConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>确认借款</DialogTitle>
            <DialogDescription>
              请确认以下借贷信息
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">抵押品</span>
              <span className="font-medium">{collateralAmount} {selectedCollateralToken?.symbol}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">借款金额</span>
              <span className="font-medium">{borrowAmount} {selectedBorrowToken?.symbol}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">抵押率</span>
              <span className={
                collateralRatio === '∞' ? 'text-green-500 font-medium' : 
                parseFloat(collateralRatio) >= 200 ? 'text-green-500 font-medium' : 
                parseFloat(collateralRatio) >= 150 ? 'text-amber-500 font-medium' : 
                'text-red-500 font-medium'
              }>
                {collateralRatio === '∞' ? '∞%' : `${collateralRatio}%`}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">健康因子</span>
              <span className={
                healthFactor >= 2 ? 'text-green-500 font-medium' : 
                healthFactor >= 1.5 ? 'text-amber-500 font-medium' : 
                'text-red-500 font-medium'
              }>
                {healthFactor.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">清算阈值</span>
              <span className="font-medium">
                ${liquidationPrice.toFixed(2)} ({selectedCollateralToken?.symbol}/USD)
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">年化利率</span>
              <span className="font-medium">{selectedBorrowToken?.borrowAPY}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">交易费用</span>
              <span className="font-medium">≈ $1.25</span>
            </div>
            
            <Separator />
            
            <div className="bg-amber-500/10 p-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
              <div className="text-sm">
                <p>借款后，您的资产将作为抵押，直到您偿还贷款为止。如果健康因子低于1，您的抵押品可能会被清算。</p>
              </div>
            </div>
            
            <div className="flex justify-between gap-4">
              <Button variant="outline" className="w-full" onClick={() => setBorrowConfirmOpen(false)}>
                取消
              </Button>
              <Button className="w-full" onClick={handleBorrowSubmit}>
                确认借款
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 