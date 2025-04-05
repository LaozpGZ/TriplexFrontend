"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertCircle, 
  Info, 
  ChevronDown, 
  TrendingUp, 
  Wallet,
  BarChart3, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  DollarSign,
  Plus,
  Minus,
  PercentIcon,
  Clock,
  Sparkles,
  BarChart2,
  HelpCircle,
  ExternalLink,
  X,
  Calculator,
  Award,
  Timer,
  RefreshCw
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

// 农场池类型定义
interface FarmPool {
  id: string;
  name: string;
  icon: string;
  pairIcon?: string;
  apr: number;
  tvl: number;
  stakedAmount: number;
  earnedTokens: number;
  totalStaked: number;
  multiplier: string;
  isHot?: boolean;
  isBoosted?: boolean;
  isSingle?: boolean;
  nextRewardTime?: number; // 添加下一次奖励时间
  dailyReward?: number; // 每日奖励量
}

// 页面组件
export default function FarmPage() {
  // 农场池列表 (模拟数据)
  const [pools, setPools] = useState<FarmPool[]>([
    {
      id: "tpxusd-usdc",
      name: "TpxUSD-USDC LP",
      icon: "/icons/usdc.svg",
      pairIcon: "/icons/usdt.svg",
      apr: 32.5,
      tvl: 4250000,
      stakedAmount: 0,
      earnedTokens: 0,
      totalStaked: 3800000,
      multiplier: "40x",
      isHot: true,
      isBoosted: true,
      nextRewardTime: Date.now() + 6 * 60 * 60 * 1000, // 6小时后
      dailyReward: 4200
    },
    {
      id: "tpxusd-eth",
      name: "TpxUSD-ETH LP",
      icon: "/icons/eth.svg",
      pairIcon: "/icons/usdt.svg",
      apr: 28.7,
      tvl: 3150000,
      stakedAmount: 0,
      earnedTokens: 0,
      totalStaked: 2800000,
      multiplier: "30x",
      nextRewardTime: Date.now() + 4 * 60 * 60 * 1000, // 4小时后
      dailyReward: 3500
    },
    {
      id: "tpxusd-btc",
      name: "TpxUSD-BTC LP",
      icon: "/icons/btc.svg",
      pairIcon: "/icons/usdt.svg",
      apr: 25.2,
      tvl: 2750000,
      stakedAmount: 0,
      earnedTokens: 0,
      totalStaked: 2400000,
      multiplier: "25x"
    },
    {
      id: "tpx",
      name: "TPX",
      icon: "/icons/eth.svg", // 替换为TPX图标
      apr: 18.9,
      tvl: 1850000,
      stakedAmount: 0,
      earnedTokens: 0,
      totalStaked: 1500000,
      multiplier: "15x",
      isSingle: true
    },
    {
      id: "tpxusd",
      name: "TpxUSD",
      icon: "/icons/usdc.svg", // 替换为TpxUSD图标
      apr: 12.4,
      tvl: 950000,
      stakedAmount: 0,
      earnedTokens: 0,
      totalStaked: 850000,
      multiplier: "10x",
      isSingle: true
    }
  ]);
  
  // 状态
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("apr");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState<string>("");
  const [showStakedOnly, setShowStakedOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // 添加新状态
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [calculatorPool, setCalculatorPool] = useState<FarmPool | null>(null);
  const [calculatorAmount, setCalculatorAmount] = useState<string>("1000");
  const [calculatorPeriod, setCalculatorPeriod] = useState<number>(30);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // 添加倒计时逻辑
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // 添加本地存储功能，保存用户过滤器选择
  useEffect(() => {
    // 从本地存储加载过滤器设置
    if (typeof window !== 'undefined') {
      const savedFilters = localStorage.getItem('farm-filters');
      if (savedFilters) {
        try {
          const filters = JSON.parse(savedFilters);
          if (filters.activeTab) setActiveTab(filters.activeTab);
          if (filters.sortBy) setSortBy(filters.sortBy);
          if (filters.sortOrder) setSortOrder(filters.sortOrder);
          if (filters.showStakedOnly !== undefined) setShowStakedOnly(filters.showStakedOnly);
        } catch (error) {
          console.error('Error parsing saved filters:', error);
        }
      }
    }
  }, []);

  // 保存过滤器设置到本地存储
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('farm-filters', JSON.stringify({
          activeTab,
          sortBy,
          sortOrder,
          showStakedOnly
        }));
      } catch (error) {
        console.error('Error saving filters:', error);
      }
    }
  }, [activeTab, sortBy, sortOrder, showStakedOnly]);
  
  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 添加倒计时逻辑
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // 每分钟更新一次
    
    return () => clearInterval(timer);
  }, []);
  
  // 格式化倒计时显示
  const formatTimeLeft = (timeInMs: number) => {
    if (timeInMs <= 0) return "即将分发";
    
    const hours = Math.floor(timeInMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}小时${minutes}分钟`;
  };
  
  // 显示成功消息
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };
  
  // 显示错误消息
  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };
  
  // 处理复合操作
  const handleCompound = (poolId: string) => {
    // 模拟复合操作
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showSuccess("奖励已成功复投到农场池中");
    }, 1500);
  };
  
  // 按条件筛选池子
  const filteredPools = pools.filter(pool => {
    // 按搜索词筛选
    if (search && !pool.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    // 按类型筛选
    if (activeTab === "lp" && pool.isSingle) {
      return false;
    }
    if (activeTab === "single" && !pool.isSingle) {
      return false;
    }
    
    // 按是否已质押筛选
    if (showStakedOnly && pool.stakedAmount <= 0) {
      return false;
    }
    
    return true;
  });
  
  // 排序池子
  const sortedPools = [...filteredPools].sort((a, b) => {
    let valueA, valueB;
    
    // 按选择的字段排序
    switch (sortBy) {
      case "apr":
        valueA = a.apr;
        valueB = b.apr;
        break;
      case "tvl":
        valueA = a.tvl;
        valueB = b.tvl;
        break;
      case "multiplier":
        valueA = parseInt(a.multiplier);
        valueB = parseInt(b.multiplier);
        break;
      default:
        valueA = a.apr;
        valueB = b.apr;
    }
    
    // 根据排序方向返回结果
    return sortOrder === "desc" ? valueB - valueA : valueA - valueB;
  });
  
  // 处理排序点击
  const handleSortClick = (field: string) => {
    if (sortBy === field) {
      // 如果已经按该字段排序，则切换排序方向
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      // 如果是新字段，设置为降序
      setSortBy(field);
      setSortOrder("desc");
    }
  };
  
  // 计算收益函数
  const calculateRewards = (amount: number, apr: number, days: number) => {
    // 简单计算 - 实际应用中可能需要更复杂的公式
    const dailyRate = apr / 365 / 100;
    const totalReturn = amount * (1 + dailyRate) ** days - amount;
    return {
      totalReturn: totalReturn.toFixed(2),
      dailyReturn: (amount * dailyRate).toFixed(2)
    };
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 添加成功/错误提示 */}
      {successMessage && (
        <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>操作成功</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      
      {errorMessage && (
        <Alert className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle>操作失败</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">流动性挖矿农场</h1>
          <p className="text-muted-foreground">质押LP代币和单一代币赚取TPX奖励</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/liquidity">
              <Plus className="mr-1 h-4 w-4" /> 添加流动性
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <ArrowRight className="mr-1 h-4 w-4" /> 收获全部奖励
          </Button>
        </div>
      </div>
      
      {/* 统计数据卡片 - 添加更吸引人的视觉效果 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="总质押价值" 
          value="$13,450,000" 
          icon={<BarChart2 className="h-5 w-5 text-primary" />} 
          change="+5.2%"
          period="过去24小时"
          gradient="from-blue-500 to-purple-500"
        />
        <StatCard 
          title="奖励分配" 
          value="125,000 TPX" 
          icon={<Sparkles className="h-5 w-5 text-primary" />} 
          period="每周"
          gradient="from-amber-500 to-pink-500"
        />
        <StatCard 
          title="平均APR" 
          value="24.6%" 
          icon={<PercentIcon className="h-5 w-5 text-primary" />} 
          change="+1.8%"
          period="过去30天"
          gradient="from-green-500 to-emerald-500"
        />
      </div>
      
      {/* 添加矿池亮点展示 */}
      <div className="mb-8 p-4 border border-primary/20 rounded-xl bg-primary/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">热门推荐</h3>
              <p className="text-sm text-muted-foreground">TpxUSD-USDC LP池 | 高达32.5% APR</p>
            </div>
          </div>
          <Button size="sm" asChild>
            <Link href="#tpxusd-usdc">立即质押</Link>
          </Button>
        </div>
      </div>
      
      {/* 添加下一次奖励分发卡片 */}
      <div className="mb-8 p-4 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-full">
              <Timer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">下次奖励分发</h3>
              <p className="text-sm flex items-center gap-1">
                <span className="text-primary font-medium">{formatTimeLeft(Math.min(...pools.filter(p => p.nextRewardTime).map(p => p.nextRewardTime! - currentTime)))}</span>
                <span className="text-xs text-muted-foreground">关注TpxUSD-USDC LP池</span>
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="gap-1">
            <RefreshCw className="h-4 w-4" /> 刷新奖励
          </Button>
        </div>
      </div>
      
      {/* 过滤和操作栏 - 优化移动端显示 */}
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="lp">流动性对</TabsTrigger>
                <TabsTrigger value="single">单币质押</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="staked-only" className="text-sm cursor-pointer">
                <input 
                  id="staked-only" 
                  type="checkbox" 
                  className="accent-primary mr-1.5"
                  checked={showStakedOnly}
                  onChange={() => setShowStakedOnly(!showStakedOnly)}
                />
                仅显示已质押
              </Label>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="搜索池子..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-10"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              {search && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearch("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apr">APR</SelectItem>
                  <SelectItem value="tvl">总质押价值</SelectItem>
                  <SelectItem value="multiplier">乘数</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              >
                {sortOrder === "desc" ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4 transform rotate-180" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 添加连接钱包提示 */}
      <div className="mb-6 p-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <Wallet className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-300">需要连接钱包</p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
              连接您的钱包以查看您的质押和奖励状态，开始赚取收益。
            </p>
          </div>
        </div>
      </div>
      
      {/* 池子列表 - 添加锚点和改进加载状态 */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between mb-6">
                  <div className="h-10 w-32 bg-muted rounded-md"></div>
                  <div className="h-10 w-24 bg-muted rounded-md"></div>
                </div>
                <div className="h-20 bg-muted rounded-md"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : sortedPools.length > 0 ? (
        <div className="space-y-4">
          {sortedPools.map((pool) => (
            <div id={pool.id} key={pool.id}>
              <PoolCard 
                pool={pool} 
                onCalculate={(pool) => {
                  setCalculatorPool(pool);
                  setShowCalculator(true);
                }}
                currentTime={currentTime}
                onCompound={() => handleCompound(pool.id)}
                onSuccess={showSuccess}
                onError={showError}
              />
            </div>
          ))}
        </div>
      ) : (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">未找到匹配的农场池</h3>
            <p className="text-muted-foreground mb-4">
              尝试更改您的筛选条件或查看所有可用的农场池
            </p>
            <Button variant="outline" onClick={() => {
              setSearch("");
              setActiveTab("all");
              setShowStakedOnly(false);
            }}>
              查看所有池子
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* APR计算器对话框 */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>收益计算器</DialogTitle>
          </DialogHeader>
          {calculatorPool && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img src={calculatorPool.icon} alt={calculatorPool.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="font-medium">{calculatorPool.name}</h3>
                <Badge className="ml-auto">{calculatorPool.apr}% APR</Badge>
              </div>
              
              <div className="space-y-3">
                <Label>质押金额 (USD)</Label>
                <Input
                  type="number"
                  value={calculatorAmount}
                  onChange={(e) => setCalculatorAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>时间段</Label>
                  <span className="text-sm text-muted-foreground">{calculatorPeriod} 天</span>
                </div>
                <Slider
                  value={[calculatorPeriod]}
                  min={1}
                  max={365}
                  step={1}
                  onValueChange={(value) => setCalculatorPeriod(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1天</span>
                  <span>30天</span>
                  <span>90天</span>
                  <span>1年</span>
                </div>
              </div>
              
              <div className="bg-muted/40 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">每日收益</span>
                  <span className="font-medium">
                    {calculateRewards(
                      parseFloat(calculatorAmount) || 0,
                      calculatorPool.apr,
                      calculatorPeriod
                    ).dailyReturn} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">总收益 ({calculatorPeriod}天)</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {calculateRewards(
                      parseFloat(calculatorAmount) || 0,
                      calculatorPool.apr,
                      calculatorPeriod
                    ).totalReturn} USD
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium">总价值</span>
                  <span className="font-bold">
                    {(parseFloat(calculatorAmount) + parseFloat(calculateRewards(
                      parseFloat(calculatorAmount) || 0,
                      calculatorPool.apr,
                      calculatorPeriod
                    ).totalReturn)).toFixed(2)} USD
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p>* 收益计算基于当前APR，实际收益可能因市场情况而变化</p>
                <p>* 复投可以提高实际收益</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCalculator(false)}>关闭</Button>
            <Button onClick={() => {
              setShowCalculator(false);
              // 可以添加跳转到质押页的逻辑
            }}>前往质押</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 指南部分 - 添加更多视觉效果 */}
      <div className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
        <h2 className="text-xl font-bold mb-4">如何参与流动性挖矿？</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg">
            <div className="relative">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full"></div>
            </div>
            <h3 className="font-medium mb-2">获取LP代币</h3>
            <p className="text-sm text-muted-foreground">
              提供流动性到交易对获得LP代币，或直接使用单一代币进行质押
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg">
            <div className="relative">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full"></div>
            </div>
            <h3 className="font-medium mb-2">质押到农场</h3>
            <p className="text-sm text-muted-foreground">
              选择您感兴趣的农场池，质押您的LP代币或单一代币
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg">
            <div className="relative">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full"></div>
            </div>
            <h3 className="font-medium mb-2">收获奖励</h3>
            <p className="text-sm text-muted-foreground">
              随时收获您赚取的TPX代币奖励，或复投以获得更高收益
            </p>
          </div>
        </div>
        
        {/* 添加常见问题链接 */}
        <div className="mt-6 text-center">
          <Button variant="link" asChild>
            <Link href="/help-center">
              查看常见问题 <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* 添加社区行动号召 */}
      <div className="mt-8 text-center p-6 border rounded-xl">
        <h3 className="text-lg font-medium mb-2">加入我们的社区</h3>
        <p className="text-muted-foreground mb-4">参与讨论，了解最新的农场和奖励更新</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button size="sm" variant="outline">Discord</Button>
          <Button size="sm" variant="outline">Telegram</Button>
          <Button size="sm" variant="outline">Twitter</Button>
        </div>
      </div>
    </div>
  );
}

// 状态卡片组件
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  period: string;
  gradient?: string;
}

function StatCard({ title, value, icon, change, period, gradient }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${gradient || "from-primary to-primary"}`}></div>
      <CardContent className="pt-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl md:text-3xl font-bold">{value}</h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
        {change && (
          <div className="flex items-center gap-1">
            <span className={change.startsWith("+") ? "text-green-500" : "text-red-500"}>
              {change}
            </span>
            <span className="text-xs text-muted-foreground">{period}</span>
          </div>
        )}
        {!change && (
          <div className="text-xs text-muted-foreground">{period}</div>
        )}
      </CardContent>
    </Card>
  );
}

// 池子卡片组件 - 增强版
interface PoolCardProps {
  pool: FarmPool;
  onCalculate: (pool: FarmPool) => void;
  currentTime: number;
  onCompound: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

function PoolCard({ pool, onCalculate, currentTime, onCompound, onSuccess, onError }: PoolCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [isCompounding, setIsCompounding] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // 计算时间剩余
  const timeLeft = pool.nextRewardTime ? pool.nextRewardTime - currentTime : 0;
  const formattedTimeLeft = formatTimeLeft(timeLeft);
  
  // 处理质押提交
  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      onError("请输入有效的质押数量");
      return;
    }
    
    setIsStaking(true);
    // 模拟质押过程
    setTimeout(() => {
      setIsStaking(false);
      // 更新池子状态
      // 此处简化处理，实际应用中需要调用智能合约
      setStakeAmount("");
      // 添加成功动画和通知
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      onSuccess(`已成功质押 ${stakeAmount} 到 ${pool.name} 农场`);
    }, 1500);
  };

  // 处理取消质押提交
  const handleUnstake = () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0 || parseFloat(unstakeAmount) > pool.stakedAmount) {
      onError("请输入有效的取消质押数量");
      return;
    }
    
    setIsUnstaking(true);
    // 模拟取消质押过程
    setTimeout(() => {
      setIsUnstaking(false);
      // 更新池子状态
      setUnstakeAmount("");
      onSuccess(`已成功从 ${pool.name} 农场取回 ${unstakeAmount}`);
    }, 1500);
  };

  // 处理收获奖励
  const handleHarvest = () => {
    if (pool.earnedTokens <= 0) {
      onError("没有可收获的奖励");
      return;
    }
    
    setIsHarvesting(true);
    // 模拟收获过程
    setTimeout(() => {
      setIsHarvesting(false);
      onSuccess(`已成功收获 ${pool.earnedTokens.toFixed(4)} TPX 奖励`);
    }, 1500);
  };
  
  // 处理复合奖励
  const handleCompound = () => {
    if (pool.earnedTokens <= 0) {
      onError("没有可复投的奖励");
      return;
    }
    
    setIsCompounding(true);
    // 模拟复合过程
    setTimeout(() => {
      setIsCompounding(false);
      onSuccess(`已成功将 ${pool.earnedTokens.toFixed(4)} TPX 奖励复投`);
      onCompound();
    }, 1500);
  };
  
  return (
    <Card className={`overflow-hidden transition-all duration-200 ${isExpanded ? "border-primary/50" : "hover:border-primary/30"}`}>
      {showConfetti && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-20 w-20 text-primary/80 animate-bounce">
            <Sparkles className="h-full w-full" />
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* 池子基本信息 */}
          <div className="flex items-center">
            <div className="relative mr-3">
              {pool.isSingle ? (
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pool.icon} alt={pool.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="relative h-12 w-12">
                  <div className="absolute top-0 left-0 h-10 w-10 rounded-full overflow-hidden border-2 border-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pool.icon} alt={pool.name.split('-')[0]} className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 h-10 w-10 rounded-full overflow-hidden border-2 border-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pool.pairIcon} alt={pool.name.split('-')[1]} className="h-full w-full object-cover" />
                  </div>
                </div>
              )}
              
              {pool.isHot && (
                <Badge variant="default" className="absolute -top-2 -right-2 px-2 py-0.5 text-xs animate-pulse">
                  HOT
                </Badge>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-base md:text-lg">{pool.name}</h3>
                {pool.isBoosted && (
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    BOOSTED
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>农场池乘数: {pool.multiplier}</span>
                {pool.nextRewardTime && (
                  <span className="flex items-center gap-1 text-primary">
                    <Clock className="h-3 w-3" />
                    {formattedTimeLeft}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* 池子APR和TVL */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">APR</p>
              <div className="flex items-center gap-1">
                <p className="font-medium text-lg text-green-500">{pool.apr}%</p>
                <div className="flex space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          年化收益率基于当前池子大小和TPX价格计算。随着池子和市场变化而变化。
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 rounded-full" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onCalculate(pool);
                    }}
                  >
                    <Calculator className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">总质押价值</p>
              <p className="font-medium">${pool.tvl.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">已质押</p>
              <p className="font-medium">{pool.stakedAmount > 0 ? `${pool.stakedAmount.toLocaleString()} LP` : "-"}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">已赚取</p>
              <p className="font-medium">{pool.earnedTokens > 0 ? `${pool.earnedTokens.toFixed(4)} TPX` : "-"}</p>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            {pool.earnedTokens > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="px-3"
                  disabled={isHarvesting || isCompounding}
                  onClick={handleHarvest}
                >
                  {isHarvesting ? (
                    <span className="flex items-center">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-1"></span>
                      收获中
                    </span>
                  ) : "收获"}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="px-3"
                  disabled={isHarvesting || isCompounding}
                  onClick={handleCompound}
                >
                  {isCompounding ? (
                    <span className="flex items-center">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-1"></span>
                      处理中
                    </span>
                  ) : "复投"}
                </Button>
              </>
            )}
            
            <Button
              variant={isExpanded ? "secondary" : "default"}
              size="sm"
              className="px-3"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "收起" : "质押"}
            </Button>
          </div>
        </div>
        
        {/* 展开的详细信息和操作 */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 质押部分 */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-4">质押 {pool.name}</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor={`stake-amount-${pool.id}`}>数量</Label>
                      <div className="text-xs text-muted-foreground">
                        余额: <span className="text-primary cursor-pointer" onClick={() => setStakeAmount("1000")}>1,000 LP</span>
                      </div>
                    </div>
                    <div className="flex">
                      <Input
                        id={`stake-amount-${pool.id}`}
                        type="number"
                        placeholder="输入数量"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="rounded-r-none"
                      />
                      <Button 
                        variant="secondary"
                        className="rounded-l-none"
                        onClick={() => setStakeAmount("1000")}
                      >
                        最大
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // 获取LP代币的操作
                        window.open("/liquidity", "_blank");
                      }}
                    >
                      获取LP
                    </Button>
                    <Button 
                      variant="default"
                      disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isStaking}
                      onClick={handleStake}
                    >
                      {isStaking ? (
                        <span className="flex items-center">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1"></span>
                          质押中
                        </span>
                      ) : "确认质押"}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* 取消质押部分 */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-4">取消质押 {pool.name}</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor={`unstake-amount-${pool.id}`}>数量</Label>
                      <div className="text-xs text-muted-foreground">
                        已质押: <span className="text-primary cursor-pointer" onClick={() => setUnstakeAmount(pool.stakedAmount.toString())}>
                          {pool.stakedAmount > 0 ? pool.stakedAmount.toLocaleString() : 0} LP
                        </span>
                      </div>
                    </div>
                    <div className="flex">
                      <Input
                        id={`unstake-amount-${pool.id}`}
                        type="number"
                        placeholder="输入数量"
                        value={unstakeAmount}
                        onChange={(e) => setUnstakeAmount(e.target.value)}
                        className="rounded-r-none"
                        disabled={pool.stakedAmount <= 0}
                      />
                      <Button 
                        variant="secondary"
                        className="rounded-l-none"
                        onClick={() => setUnstakeAmount(pool.stakedAmount.toString())}
                        disabled={pool.stakedAmount <= 0}
                      >
                        最大
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline"
                      onClick={handleHarvest}
                      disabled={pool.earnedTokens <= 0 || isHarvesting}
                    >
                      {isHarvesting ? "收获中" : "收获奖励"}
                    </Button>
                    <Button 
                      variant="default"
                      disabled={
                        !unstakeAmount || 
                        parseFloat(unstakeAmount) <= 0 || 
                        parseFloat(unstakeAmount) > pool.stakedAmount || 
                        isUnstaking
                      }
                      onClick={handleUnstake}
                    >
                      {isUnstaking ? (
                        <span className="flex items-center">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1"></span>
                          处理中
                        </span>
                      ) : "确认取消质押"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 池子详细信息 */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-4">池子信息</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">总质押</p>
                  <p className="font-medium">{pool.totalStaked.toLocaleString()} LP</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">奖励代币</p>
                  <p className="font-medium">TPX</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">每日奖励</p>
                  <p className="font-medium">~{(pool.apr * pool.tvl / 365 / 100).toFixed(2)} TPX</p>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <Link href="#" target="_blank" rel="noopener noreferrer">
                    查看合约 <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <Link href="#" target="_blank" rel="noopener noreferrer">
                    获取LP帮助 <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <Link href="/help-center/farm" rel="noopener noreferrer">
                    常见问题 <HelpCircle className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// 时间格式化辅助函数
function formatTimeLeft(timeInMs: number) {
  if (timeInMs <= 0) return "即将分发";
  
  const hours = Math.floor(timeInMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}小时${minutes}分钟`;
} 