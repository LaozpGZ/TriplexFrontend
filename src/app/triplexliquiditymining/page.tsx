"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import Link from "next/link";

// 定义类型接口
interface Asset {
  name: string;
  balance: number;
}

interface Pool {
  name: string;
  type: string;
  assetType: "stablecoin" | "crypto" | "rwa";
  apr: string;
  tvl: string;
  weeklyReward: string;
  yourShare: string;
  asset1: Asset;
  asset2: Asset;
  yourLpTokens: number;
}

// 模拟数据
const pools: Pool[] = [
  {
    name: "trxUSD-USDC",
    type: "稳定币流动性池",
    assetType: "stablecoin",
    apr: "28.5%",
    tvl: "$3.45M",
    weeklyReward: "45,000 TPX",
    yourShare: "0.8%",
    asset1: { name: "trxUSD", balance: 1250.45 },
    asset2: { name: "USDC", balance: 1852.32 },
    yourLpTokens: 185.67
  },
  {
    name: "trxUSD-APT",
    type: "交易对流动性池",
    assetType: "crypto",
    apr: "42.3%",
    tvl: "$2.18M",
    weeklyReward: "35,000 TPX",
    yourShare: "0.5%",
    asset1: { name: "trxUSD", balance: 1250.45 },
    asset2: { name: "APT", balance: 42.75 },
    yourLpTokens: 128.45
  },
  {
    name: "tpxBTC-trxUSD",
    type: "合成资产流动性池",
    assetType: "crypto",
    apr: "35.8%",
    tvl: "$1.65M",
    weeklyReward: "25,000 TPX",
    yourShare: "0.3%",
    asset1: { name: "tpxBTC", balance: 0.25 },
    asset2: { name: "trxUSD", balance: 1250.45 },
    yourLpTokens: 78.21
  },
  {
    name: "tpxUSD-USDT",
    type: "稳定币对流动性池",
    assetType: "stablecoin",
    apr: "32.6%",
    tvl: "$1.42M",
    weeklyReward: "22,000 TPX",
    yourShare: "0.2%",
    asset1: { name: "tpxUSD", balance: 985.63 },
    asset2: { name: "USDT", balance: 1025.82 },
    yourLpTokens: 42.18
  },
  {
    name: "tpxGOLD-trxUSD",
    type: "黄金指数流动性池",
    assetType: "rwa",
    apr: "38.2%",
    tvl: "$1.28M",
    weeklyReward: "18,000 TPX",
    yourShare: "0.1%",
    asset1: { name: "tpxGOLD", balance: 12.35 },
    asset2: { name: "trxUSD", balance: 1250.45 },
    yourLpTokens: 25.62
  },
  {
    name: "tpxOIL-USDT",
    type: "石油指数流动性池",
    assetType: "rwa",
    apr: "42.5%",
    tvl: "$0.92M",
    weeklyReward: "15,000 TPX",
    yourShare: "0%",
    asset1: { name: "tpxOIL", balance: 0 },
    asset2: { name: "USDT", balance: 1025.82 },
    yourLpTokens: 0
  }
];

export default function LiquidityMining() {
  const [activeTab, setActiveTab] = useState("all");
  const [assetFilter, setAssetFilter] = useState<"all" | "crypto" | "stablecoin" | "rwa">("all");
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [currentPool, setCurrentPool] = useState<Pool | null>(null);
  const [asset1Amount, setAsset1Amount] = useState("");
  const [asset2Amount, setAsset2Amount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [claimRewards, setClaimRewards] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"apr" | "tvl" | "yourShare">("apr");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // 模拟加载效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const openDepositModal = (pool: Pool) => {
    setCurrentPool(pool);
    setAsset1Amount("");
    setAsset2Amount("");
    setDepositModalOpen(true);
  };

  const openWithdrawModal = (pool: Pool) => {
    setCurrentPool(pool);
    setWithdrawAmount("");
    setWithdrawModalOpen(true);
  };

  const handleDeposit = () => {
    // 实际项目中这里会调用智能合约
    alert("存入成功！流动性已添加。");
    setDepositModalOpen(false);
  };

  const handleWithdraw = () => {
    // 实际项目中这里会调用智能合约
    if (claimRewards) {
      alert("提取成功！同时已领取65.32 TPX奖励。");
    } else {
      alert("提取成功！流动性已移除。");
    }
    setWithdrawModalOpen(false);
  };

  const updateDepositEstimates = () => {
    if (!currentPool) return { lpTokens: "0", sharePercentage: "0", weeklyReward: "0" };
    
    const amount1 = parseFloat(asset1Amount) || 0;
    const amount2 = parseFloat(asset2Amount) || 0;
    
    if (amount1 > 0 && amount2 > 0) {
      // 简单估算LP代币和份额
      const lpTokens = Math.sqrt(amount1 * amount2);
      const sharePercentage = (lpTokens / (parseFloat(currentPool.tvl.replace('$', '').replace('M', '')) * 10)) * 100;
      const weeklyReward = parseFloat(currentPool.weeklyReward.split(' ')[0]) * (sharePercentage / 100);
      
      return {
        lpTokens: lpTokens.toFixed(2),
        sharePercentage: sharePercentage.toFixed(4),
        weeklyReward: weeklyReward.toFixed(2)
      };
    }
    
    return { lpTokens: "0", sharePercentage: "0", weeklyReward: "0" };
  };

  const updateWithdrawEstimates = () => {
    if (!currentPool) return { asset1Amount: "0", asset2Amount: "0", remainingShare: "0" };
    
    const amount = parseFloat(withdrawAmount) || 0;
    const maxLp = currentPool.yourLpTokens;
    
    if (amount > 0 && amount <= maxLp) {
      const ratio = amount / maxLp;
      const asset1Amount = currentPool.asset1.balance * ratio * 0.99; // 0.99表示扣除0.3%手续费
      const asset2Amount = currentPool.asset2.balance * ratio * 0.99;
      
      const remainingShare = parseFloat(currentPool.yourShare) * (1 - ratio);
      
      return {
        asset1Amount: asset1Amount.toFixed(4),
        asset2Amount: asset2Amount.toFixed(4),
        remainingShare: remainingShare.toFixed(4)
      };
    }
    
    return {
      asset1Amount: "0",
      asset2Amount: "0",
      remainingShare: currentPool?.yourShare || "0"
    };
  };

  // 获取排序和过滤后的池子
  const getFilteredPools = () => {
    const filtered = pools
      .filter(pool => {
        // 资产类型筛选
        const assetTypeMatch = assetFilter === "all" || pool.assetType === assetFilter;
        
        // 搜索筛选
        const searchMatch = searchTerm === "" || 
          pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pool.type.toLowerCase().includes(searchTerm.toLowerCase());
        
        return assetTypeMatch && searchMatch;
      });

    // 排序
    return filtered.sort((a, b) => {
      if (sortField === "apr") {
        const aprA = parseFloat(a.apr.replace("%", ""));
        const aprB = parseFloat(b.apr.replace("%", ""));
        return sortDirection === "desc" ? aprB - aprA : aprA - aprB;
      } else if (sortField === "tvl") {
        const tvlA = parseFloat(a.tvl.replace("$", "").replace("M", ""));
        const tvlB = parseFloat(b.tvl.replace("$", "").replace("M", ""));
        return sortDirection === "desc" ? tvlB - tvlA : tvlA - tvlB;
      } else {
        const shareA = parseFloat(a.yourShare.replace("%", ""));
        const shareB = parseFloat(b.yourShare.replace("%", ""));
        return sortDirection === "desc" ? shareB - shareA : shareA - shareB;
      }
    });
  };

  // 切换排序方向
  const toggleSort = (field: "apr" | "tvl" | "yourShare") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const estimates = updateDepositEstimates();
  const withdrawEstimates = updateWithdrawEstimates();
  const filteredPools = getFilteredPools();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <nav className="flex mb-4 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary mr-2">首页</Link>
          <span className="text-muted-foreground mx-2">/</span>
          <span>流动性挖矿</span>
        </nav>
        <h1 className="text-3xl font-bold">流动性挖矿</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-card rounded-lg p-4 shadow">
            <div className="space-y-2">
              <Link href="/collateral" className="block px-4 py-2 hover:bg-accent rounded-md cursor-pointer">抵押品管理</Link>
              <Link href="/synthetix" className="block px-4 py-2 hover:bg-accent rounded-md cursor-pointer">合成资产</Link>
              <div className="px-4 py-2 bg-accent rounded-md cursor-pointer text-primary font-medium">流动性挖矿</div>
              <Link href="/dashboard" className="block px-4 py-2 hover:bg-accent rounded-md cursor-pointer">资产管理</Link>
              <div className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer">清算监控</div>
              <div className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer">预言机数据</div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>流动性挖矿</CardTitle>
              <p className="text-muted-foreground">为Triplex协议提供流动性，赚取TPX奖励</p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-card/30 p-4 rounded-lg">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-8 w-28 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                  
                  <Skeleton className="h-10 w-full mb-6" />
                  
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-9 w-16" />
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-20" />
                      <Skeleton className="h-9 w-32" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-72 w-full rounded-lg" />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-card/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">总锁仓价值(TVL)</div>
                      <div className="text-2xl font-bold">$8.72M</div>
                      <div className="text-sm text-green-500">+12.4% 本周</div>
                    </div>
                    <div className="bg-card/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">周奖励</div>
                      <div className="text-2xl font-bold">105,000 TPX</div>
                      <div className="text-sm text-muted-foreground">≈ $210,000</div>
                    </div>
                    <div className="bg-card/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">您的锁仓</div>
                      <div className="text-2xl font-bold">$25,480</div>
                      <div className="text-sm text-muted-foreground">3个活跃池</div>
                    </div>
                    <div className="bg-card/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">待领取奖励</div>
                      <div className="text-2xl font-bold">842 TPX</div>
                      <div className="text-sm text-muted-foreground">≈ $1,684</div>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="all">
                    <TabsList className="mb-6">
                      <TabsTrigger value="all">所有池</TabsTrigger>
                      <TabsTrigger value="your">您的参与</TabsTrigger>
                      <TabsTrigger value="rewards">奖励计划</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-6">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant={assetFilter === "all" ? "default" : "outline"} 
                            onClick={() => setAssetFilter("all")}
                            size="sm"
                          >
                            全部
                          </Button>
                          <Button 
                            variant={assetFilter === "crypto" ? "default" : "outline"} 
                            onClick={() => setAssetFilter("crypto")}
                            size="sm"
                          >
                            加密货币
                          </Button>
                          <Button 
                            variant={assetFilter === "stablecoin" ? "default" : "outline"} 
                            onClick={() => setAssetFilter("stablecoin")}
                            size="sm"
                          >
                            稳定币
                          </Button>
                          <Button 
                            variant={assetFilter === "rwa" ? "default" : "outline"} 
                            onClick={() => setAssetFilter("rwa")}
                            size="sm"
                          >
                            真实世界资产
                          </Button>
                        </div>
                        
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="搜索流动性池..." 
                            className="pl-9 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-4 px-2">
                        <div className="flex-1">流动性池</div>
                        <div 
                          className="w-28 flex items-center justify-end cursor-pointer" 
                          onClick={() => toggleSort("apr")}
                        >
                          年化收益率
                          {sortField === "apr" && (
                            sortDirection === "desc" ? <ChevronDown className="ml-1 h-4 w-4" /> : <ChevronUp className="ml-1 h-4 w-4" />
                          )}
                        </div>
                        <div 
                          className="w-28 flex items-center justify-end cursor-pointer"
                          onClick={() => toggleSort("tvl")}
                        >
                          总锁仓量
                          {sortField === "tvl" && (
                            sortDirection === "desc" ? <ChevronDown className="ml-1 h-4 w-4" /> : <ChevronUp className="ml-1 h-4 w-4" />
                          )}
                        </div>
                        <div 
                          className="w-24 flex items-center justify-end cursor-pointer"
                          onClick={() => toggleSort("yourShare")}
                        >
                          您的份额
                          {sortField === "yourShare" && (
                            sortDirection === "desc" ? <ChevronDown className="ml-1 h-4 w-4" /> : <ChevronUp className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </div>
                      
                      {filteredPools.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                          没有找到匹配的流动性池
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {filteredPools.map((pool, index) => (
                            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                              <div className="bg-muted/30 p-4 flex items-center gap-4 border-b">
                                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center font-bold">
                                  LP
                                </div>
                                <div>
                                  <h3 className="font-medium">{pool.name}</h3>
                                  <p className="text-sm text-muted-foreground">{pool.type}</p>
                                </div>
                                <div className="ml-auto text-xs bg-background/60 px-2 py-1 rounded">
                                  {pool.assetType === "stablecoin" ? "稳定币" : 
                                   pool.assetType === "crypto" ? "加密货币" : "真实资产"}
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                  <div className="bg-muted/20 p-3 rounded-md">
                                    <div className="text-xs text-muted-foreground">年化收益率(APR)</div>
                                    <div className="font-semibold">{pool.apr}</div>
                                  </div>
                                  <div className="bg-muted/20 p-3 rounded-md">
                                    <div className="text-xs text-muted-foreground">总锁仓量</div>
                                    <div className="font-semibold">{pool.tvl}</div>
                                  </div>
                                  <div className="bg-muted/20 p-3 rounded-md">
                                    <div className="text-xs text-muted-foreground">每周奖励</div>
                                    <div className="font-semibold">{pool.weeklyReward}</div>
                                  </div>
                                  <div className="bg-muted/20 p-3 rounded-md">
                                    <div className="text-xs text-muted-foreground">您的份额</div>
                                    <div className="font-semibold">{pool.yourShare}</div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    className="flex-1" 
                                    onClick={() => openDepositModal(pool)}
                                  >
                                    存入
                                  </Button>
                                  <Button 
                                    className="flex-1" 
                                    variant="outline"
                                    onClick={() => openWithdrawModal(pool)}
                                  >
                                    提取
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="your">
                      {pools.filter(pool => parseFloat(pool.yourShare) > 0).length === 0 ? (
                        <div className="text-center py-16">
                          <div className="mb-4 text-4xl">🏊‍♂️</div>
                          <h3 className="text-xl font-medium mb-2">您尚未参与任何流动性池</h3>
                          <p className="text-muted-foreground mb-6">参与流动性挖矿，享受TPX代币奖励</p>
                          <Button onClick={() => setActiveTab("all")}>浏览流动性池</Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {pools
                            .filter(pool => parseFloat(pool.yourShare) > 0)
                            .map((pool, index) => (
                              <Card key={index} className="overflow-hidden">
                                <div className="bg-muted/30 p-4 flex items-center gap-4 border-b">
                                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center font-bold">
                                    LP
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{pool.name}</h3>
                                    <p className="text-sm text-muted-foreground">{pool.type}</p>
                                  </div>
                                </div>
                                <div className="p-4">
                                  <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-muted/20 p-3 rounded-md">
                                      <div className="text-xs text-muted-foreground">年化收益率(APR)</div>
                                      <div className="font-semibold">{pool.apr}</div>
                                    </div>
                                    <div className="bg-muted/20 p-3 rounded-md">
                                      <div className="text-xs text-muted-foreground">总锁仓量</div>
                                      <div className="font-semibold">{pool.tvl}</div>
                                    </div>
                                    <div className="bg-muted/20 p-3 rounded-md">
                                      <div className="text-xs text-muted-foreground">每周奖励</div>
                                      <div className="font-semibold">{pool.weeklyReward}</div>
                                    </div>
                                    <div className="bg-muted/20 p-3 rounded-md">
                                      <div className="text-xs text-muted-foreground">您的份额</div>
                                      <div className="font-semibold">{pool.yourShare}</div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      className="flex-1" 
                                      onClick={() => openDepositModal(pool)}
                                    >
                                      存入
                                    </Button>
                                    <Button 
                                      className="flex-1" 
                                      variant="outline"
                                      onClick={() => openWithdrawModal(pool)}
                                    >
                                      提取
                                    </Button>
                                  </div>
                                </div>
                              </Card>
                            ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="rewards">
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-semibold mb-4">TPX奖励分配</h3>
                          <div className="space-y-4">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span>trxUSD-USDC 流动性池</span>
                              <span className="font-medium">45,000 TPX/周</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                              <span>trxUSD-APT 流动性池</span>
                              <span className="font-medium">35,000 TPX/周</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                              <span>tpxBTC-trxUSD 流动性池</span>
                              <span className="font-medium">25,000 TPX/周</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                              <span>tpxUSD-USDT 流动性池</span>
                              <span className="font-medium">22,000 TPX/周</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                              <span>tpxGOLD-trxUSD 流动性池</span>
                              <span className="font-medium">18,000 TPX/周</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                              <span>tpxOIL-USDT 流动性池</span>
                              <span className="font-medium">15,000 TPX/周</span>
                            </div>
                          </div>
                          
                          <div className="mt-8 bg-muted/20 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">奖励发放时间</h4>
                            <p className="text-sm text-muted-foreground mb-4">TPX奖励每周一自动发放到您的钱包，您也可以随时手动领取已累积的奖励。</p>
                            
                            <h4 className="font-medium mb-2 mt-4">分配规则</h4>
                            <p className="text-sm text-muted-foreground">奖励按照您提供的流动性在池中的份额比例分配，份额比例 = 您的LP代币数量 / 池中总LP代币数量。</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>如何参与流动性挖矿</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <strong>准备相应资产对</strong> - 确保您钱包中有配对资产，例如trxUSD和USDC
                </li>
                <li>
                  <strong>创建流动性代币</strong> - 按照等值比例提供资产对到相应的流动性池
                </li>
                <li>
                  <strong>质押LP代币</strong> - 将获得的LP代币质押到奖励池中
                </li>
                <li>
                  <strong>收获TPX奖励</strong> - 根据您的质押比例，定期收获TPX代币奖励
                </li>
              </ol>
              
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <h4 className="text-primary font-semibold mb-2">流动性挖矿奖励</h4>
                <p>TPX是Triplex协议的治理代币，持有TPX可以参与协议的决策投票、享受协议收益分配，并可在二级市场交易。</p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">风险提示</h4>
                  <p className="text-sm text-muted-foreground">参与流动性挖矿可能面临无常损失风险，请在了解相关风险后参与。</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">手续费分享</h4>
                  <p className="text-sm text-muted-foreground">流动性提供者可获得交易手续费的30%作为额外收益，按LP份额比例分配。</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">TPX代币用途</h4>
                  <p className="text-sm text-muted-foreground">TPX代币可用于协议治理投票、享受协议收益分配、质押赚取额外奖励等。</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* 存入模态框 */}
      <Dialog open={depositModalOpen} onOpenChange={setDepositModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>存入流动性</DialogTitle>
          </DialogHeader>
          
          <div className="bg-muted/20 p-4 rounded-lg space-y-2 mt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">流动性池</span>
              <span>{currentPool?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">APR</span>
              <span>{currentPool?.apr}</span>
            </div>
          </div>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>{currentPool?.asset1.name}</Label>
                <span className="text-sm text-muted-foreground">
                  余额: {currentPool?.asset1.balance.toFixed(2)}
                </span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={asset1Amount}
                  onChange={(e) => setAsset1Amount(e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs"
                  onClick={() => setAsset1Amount(currentPool?.asset1.balance.toFixed(2) || "")}
                >
                  最大
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>{currentPool?.asset2.name}</Label>
                <span className="text-sm text-muted-foreground">
                  余额: {currentPool?.asset2.balance.toFixed(2)}
                </span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={asset2Amount}
                  onChange={(e) => setAsset2Amount(e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs"
                  onClick={() => setAsset2Amount(currentPool?.asset2.balance.toFixed(2) || "")}
                >
                  最大
                </Button>
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">您将获得</span>
                <span>{estimates.lpTokens} LP代币</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">份额比例</span>
                <span>{estimates.sharePercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">预估每周奖励</span>
                <span>{estimates.weeklyReward} TPX</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleDeposit} 
              disabled={!asset1Amount || !asset2Amount}
            >
              确认存入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 提取模态框 */}
      <Dialog open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>提取流动性</DialogTitle>
          </DialogHeader>
          
          <div className="bg-muted/20 p-4 rounded-lg space-y-2 mt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">流动性池</span>
              <span>{currentPool?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">您的LP代币</span>
              <span>{currentPool?.yourLpTokens.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>提取金额</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs"
                  onClick={() => setWithdrawAmount(currentPool?.yourLpTokens.toFixed(2) || "")}
                >
                  最大
                </Button>
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">您将收到</span>
                <div className="text-right">
                  <div>{withdrawEstimates.asset1Amount} {currentPool?.asset1.name}</div>
                  <div>{withdrawEstimates.asset2Amount} {currentPool?.asset2.name}</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">剩余份额</span>
                <span>{withdrawEstimates.remainingShare}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">未领取奖励</span>
                <span>65.32 TPX</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="claimRewards" 
                checked={claimRewards} 
                onCheckedChange={(checked) => setClaimRewards(checked === true)}
              />
              <label
                htmlFor="claimRewards"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                同时领取奖励
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleWithdraw} 
              disabled={!withdrawAmount || parseFloat(withdrawAmount) > (currentPool?.yourLpTokens || 0)}
            >
              确认提取
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 