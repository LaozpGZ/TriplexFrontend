"use client";

import { useState, useEffect } from "react";
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
  DialogFooter 
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
  BarChart3, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  DollarSign,
  Copy,
  ExternalLink,
  Share2
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// 抵押品类型
interface Collateral {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  icon: string;
  minRatio: number;
  liquidationRatio: number;
  mintFee: number;
  isStablecoin: boolean;
}

export default function MintTpxUsdPage() {
  // 状态管理
  const [activeTab, setActiveTab] = useState<"mint" | "redeem">("mint");
  const [amount, setAmount] = useState<string>("");
  const [selectedCollateral, setSelectedCollateral] = useState<Collateral | null>(null);
  const [collateralAmount, setCollateralAmount] = useState<string>("");
  const [collateralRatio, setCollateralRatio] = useState<number>(200);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ amount?: string; collateral?: string; ratio?: string }>({});
  const [txHash, setTxHash] = useState<string>("");
  const [priceChange, setPriceChange] = useState<number>(0);
  const [isCalculatingFromCollateral, setIsCalculatingFromCollateral] = useState<boolean>(false);
  
  // 模拟数据 - 抵押品列表
  const collaterals: Collateral[] = [
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: 1.25,
      price: 2250.15,
      icon: "/icons/eth.svg",
      minRatio: 150,
      liquidationRatio: 120,
      mintFee: 0.25,
      isStablecoin: false
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: 5000,
      price: 1,
      icon: "/icons/usdc.svg",
      minRatio: 120,
      liquidationRatio: 105,
      mintFee: 0.1,
      isStablecoin: true
    },
    {
      symbol: "USDT",
      name: "Tether",
      balance: 3500,
      price: 1,
      icon: "/icons/usdt.svg",
      minRatio: 120,
      liquidationRatio: 105,
      mintFee: 0.1,
      isStablecoin: true
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: 0.085,
      price: 43500.75,
      icon: "/icons/btc.svg",
      minRatio: 150,
      liquidationRatio: 120,
      mintFee: 0.25,
      isStablecoin: false
    },
    {
      symbol: "APT",
      name: "Aptos",
      balance: 250,
      price: 8.25,
      icon: "/icons/apt.svg",
      minRatio: 180,
      liquidationRatio: 140,
      mintFee: 0.3,
      isStablecoin: false
    }
  ];
  
  // 初始化默认选择第一个抵押品
  useEffect(() => {
    if (collaterals.length > 0 && !selectedCollateral) {
      setSelectedCollateral(collaterals[0]);
    }
  }, [collaterals, selectedCollateral]);
  
  // 计算需要的抵押品数量
  useEffect(() => {
    if (!selectedCollateral) return;

    if (!isCalculatingFromCollateral) {
      // 根据铸造金额计算抵押品数量
      if (amount && !isNaN(parseFloat(amount))) {
        const amountValue = parseFloat(amount);
        const requiredCollateral = (amountValue * collateralRatio / 100) / selectedCollateral.price;
        setCollateralAmount(requiredCollateral.toFixed(selectedCollateral.isStablecoin ? 2 : 6));
      } else {
        setCollateralAmount("");
      }
    } else {
      // 根据抵押品数量计算铸造金额
      if (collateralAmount && !isNaN(parseFloat(collateralAmount))) {
        const collateralValue = parseFloat(collateralAmount);
        const possibleMintAmount = (collateralValue * selectedCollateral.price) / (collateralRatio / 100);
        setAmount(possibleMintAmount.toFixed(2));
      } else {
        setAmount("");
      }
    }
  }, [amount, collateralRatio, selectedCollateral, collateralAmount, isCalculatingFromCollateral]);
  
  // 处理抵押品数量输入变化
  const handleCollateralAmountChange = (value: string) => {
    setIsCalculatingFromCollateral(true);
    setCollateralAmount(value);
  };
  
  // 处理铸造数量输入变化
  const handleAmountChange = (value: string) => {
    setIsCalculatingFromCollateral(false);
    setAmount(value);
  };
  
  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: { amount?: string; collateral?: string; ratio?: string } = {};
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = "请输入有效的铸造金额";
    }
    
    if (!selectedCollateral) {
      newErrors.collateral = "请选择抵押品";
    } else if (parseFloat(collateralAmount) > selectedCollateral.balance) {
      newErrors.collateral = "抵押品余额不足";
    }
    
    if (collateralRatio < (selectedCollateral?.minRatio || 150)) {
      newErrors.ratio = `抵押率必须高于最低要求(${selectedCollateral?.minRatio || 150}%)`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 处理铸造提交
  const handleMintSubmit = () => {
    if (!validateForm()) return;
    setIsConfirmModalOpen(true);
  };
  
  // 处理确认铸造
  const handleConfirmMint = async () => {
    setIsLoading(true);
    
    // 模拟交易确认
    setTimeout(() => {
      // 模拟交易哈希
      setTxHash("0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234");
      setIsLoading(false);
      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true);
    }, 2000);
  };
  
  // 处理继续铸造
  const handleMintMore = () => {
    setIsSuccessModalOpen(false);
    setAmount("");
    setCollateralRatio(200);
    // 重置表单状态但保留抵押品选择
  };
  
  // 处理重新铸造
  const handleReset = () => {
    setAmount("");
    setCollateralRatio(200);
    setErrors({});
  };
  
  // 格式化交易哈希显示
  const formatTxHash = (hash: string): string => {
    if (!hash) return "";
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };
  
  // 复制交易哈希到剪贴板
  const [copied, setCopied] = useState(false);
  const copyTxHash = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="container py-6 md:py-10 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">TpxUSD 铸造</h1>
          <p className="text-muted-foreground mt-1">使用多种抵押品铸造TpxUSD稳定币</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              我的资产
            </Button>
          </Link>
          <Link href="/help-center/tpxusd">
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              关于 TpxUSD
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Tabs defaultValue="mint" value={activeTab} onValueChange={(v) => setActiveTab(v as "mint" | "redeem")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mint">铸造 TpxUSD</TabsTrigger>
                  <TabsTrigger value="redeem">赎回 TpxUSD</TabsTrigger>
                </TabsList>
                
                <TabsContent value="mint" className="mt-0">
                  <div className="space-y-6">
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="amount">铸造数量</Label>
                        <div className="relative">
                          <Input
                            id="amount"
                            placeholder="输入TpxUSD数量"
                            value={amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className="pr-20"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-muted-foreground text-sm">TpxUSD</span>
                          </div>
                        </div>
                        {errors.amount && (
                          <p className="text-xs text-destructive">{errors.amount}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="collateral">选择抵押品</Label>
                          {selectedCollateral && (
                            <div className="text-xs text-muted-foreground">
                              余额: {selectedCollateral.balance} {selectedCollateral.symbol}
                            </div>
                          )}
                        </div>
                        <Select
                          onValueChange={(value) => {
                            const selected = collaterals.find(c => c.symbol === value);
                            if (selected) {
                              setSelectedCollateral(selected);
                              // 重置抵押率为选中抵押品的最低抵押率加20%
                              setCollateralRatio(Math.max(selected.minRatio + 20, 150));
                            }
                          }}
                          value={selectedCollateral?.symbol}
                        >
                          <SelectTrigger id="collateral" className="w-full">
                            <SelectValue placeholder="选择抵押品" />
                          </SelectTrigger>
                          <SelectContent>
                            {collaterals.map((collateral) => (
                              <SelectItem key={collateral.symbol} value={collateral.symbol}>
                                <div className="flex items-center gap-2">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={collateral.icon}
                                    alt={collateral.symbol}
                                    className="w-5 h-5 rounded-full"
                                  />
                                  <span>{collateral.name}</span>
                                  <span className="text-muted-foreground ml-1">
                                    ({collateral.symbol})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.collateral && (
                          <p className="text-xs text-destructive">{errors.collateral}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <Label htmlFor="collateral-amount">需要抵押</Label>
                          {selectedCollateral && collateralAmount && !isNaN(parseFloat(collateralAmount)) && (
                            <div className="text-sm">
                              ≈ ${(parseFloat(collateralAmount) * selectedCollateral.price).toLocaleString(undefined, {maximumFractionDigits: 2})}
                            </div>
                          )}
                        </div>
                        <div className="relative">
                          <Input
                            id="collateral-amount"
                            value={collateralAmount}
                            onChange={(e) => handleCollateralAmountChange(e.target.value)}
                            placeholder={`输入${selectedCollateral?.symbol || ''}数量`}
                            className="pr-20"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-muted-foreground text-sm">
                              {selectedCollateral?.symbol || ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2 pt-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="collateral-ratio">抵押率</Label>
                          <div className="flex items-center">
                            <span className="text-xl font-medium mr-1">{collateralRatio}%</span>
                            {selectedCollateral && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-80 p-4">
                                    <div className="space-y-2 text-sm">
                                      <p><strong>最低抵押率:</strong> {selectedCollateral.minRatio}%</p>
                                      <p><strong>清算阈值:</strong> {selectedCollateral.liquidationRatio}%</p>
                                      <p className="text-xs text-muted-foreground pt-1">当抵押率低于清算阈值时，您的抵押品可能会被清算。我们建议保持抵押率高于最低要求至少20%，以防止因价格波动导致的风险。</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const minRatio = selectedCollateral?.minRatio || 150;
                              setCollateralRatio(Math.max(collateralRatio - 10, minRatio));
                            }}
                            disabled={!selectedCollateral || collateralRatio <= (selectedCollateral?.minRatio || 150)}
                            className="px-2"
                          >
                            -10%
                          </Button>
                          <Slider
                            data-id="collateral-ratio"
                            min={selectedCollateral?.minRatio || 150}
                            max={300}
                            step={1}
                            value={[collateralRatio]}
                            onValueChange={(values) => setCollateralRatio(values[0])}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCollateralRatio(Math.min(collateralRatio + 10, 300))}
                            disabled={collateralRatio >= 300}
                            className="px-2"
                          >
                            +10%
                          </Button>
                        </div>
                        {errors.ratio && (
                          <p className="text-xs text-destructive">{errors.ratio}</p>
                        )}
                        {selectedCollateral && (
                          <div className="grid grid-cols-3 gap-2 my-2">
                            <div 
                              className={`text-center p-2 border rounded-md cursor-pointer transition-colors ${
                                collateralRatio === selectedCollateral.minRatio ? 'bg-primary/10 border-primary/50' : ''
                              }`}
                              onClick={() => setCollateralRatio(selectedCollateral.minRatio)}
                            >
                              <div className="text-xs text-muted-foreground mb-1">最低</div>
                              <div className="font-medium">{selectedCollateral.minRatio}%</div>
                            </div>
                            <div 
                              className={`text-center p-2 border rounded-md cursor-pointer transition-colors ${
                                collateralRatio === selectedCollateral.minRatio + 50 ? 'bg-primary/10 border-primary/50' : ''
                              }`}
                              onClick={() => setCollateralRatio(selectedCollateral.minRatio + 50)}
                            >
                              <div className="text-xs text-muted-foreground mb-1">推荐</div>
                              <div className="font-medium">{selectedCollateral.minRatio + 50}%</div>
                            </div>
                            <div 
                              className={`text-center p-2 border rounded-md cursor-pointer transition-colors ${
                                collateralRatio === 300 ? 'bg-primary/10 border-primary/50' : ''
                              }`}
                              onClick={() => setCollateralRatio(300)}
                            >
                              <div className="text-xs text-muted-foreground mb-1">最高</div>
                              <div className="font-medium">300%</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 铸造摘要 */}
                    {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && selectedCollateral && (
                      <div className="mt-6 rounded-lg border p-4 space-y-3">
                        <h3 className="font-medium">铸造摘要</h3>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">将获得</span>
                          <span>{parseFloat(amount).toFixed(2)} TpxUSD</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">需要抵押</span>
                          <span>{collateralAmount} {selectedCollateral.symbol}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">抵押率</span>
                          <span className={collateralRatio < 150 ? "text-destructive" : collateralRatio > 250 ? "text-green-500" : ""}>
                            {collateralRatio}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">铸造费用</span>
                          <span>{(parseFloat(amount) * (selectedCollateral.mintFee / 100)).toFixed(2)} TpxUSD ({selectedCollateral.mintFee}%)</span>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between text-sm font-medium">
                          <span>实际获得</span>
                          <span>{(parseFloat(amount) * (1 - selectedCollateral.mintFee / 100)).toFixed(2)} TpxUSD</span>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="redeem" className="mt-0">
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">赎回功能即将推出</p>
                      <Button variant="outline" onClick={() => setActiveTab("mint")}>返回铸造</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              {/* TabsContent 已移至 Tabs 组件内部 */}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>重置</Button>
              <Button onClick={handleMintSubmit} disabled={!amount || !selectedCollateral}>铸造 TpxUSD</Button>
            </CardFooter>
          </Card>
          
          {/* 铸造历史 */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>铸造历史</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "TX001", date: "2024-04-01", amount: "500", collateral: "0.25 ETH", ratio: "185%" },
                  { id: "TX002", date: "2024-03-25", amount: "1,000", collateral: "1,000 USDC", ratio: "130%" },
                  { id: "TX003", date: "2024-03-15", amount: "250", collateral: "0.006 BTC", ratio: "210%" },
                ].map((tx) => (
                  <div key={tx.id} className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg">
                    <div className="mb-2 sm:mb-0">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {tx.id}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{tx.date}</span>
                      </div>
                      <div className="mt-1 font-medium">{tx.amount} TpxUSD</div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end">
                      <div className="text-sm text-muted-foreground">抵押: {tx.collateral}</div>
                      <div className="text-sm text-muted-foreground">抵押率: {tx.ratio}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 风险计算器 */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>市场风险计算器</CardTitle>
              <CardDescription>
                计算市场波动对您抵押头寸的影响
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="price-change">抵押品价格变动</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const newValue = Math.max(-50, (priceChange || 0) - 10);
                        setPriceChange(newValue);
                      }}
                    >
                      -10%
                    </Button>
                    <Slider
                      data-id="price-change"
                      min={-50}
                      max={50}
                      step={1}
                      value={[priceChange || 0]}
                      onValueChange={(values) => setPriceChange(values[0])}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const newValue = Math.min(50, (priceChange || 0) + 10);
                        setPriceChange(newValue);
                      }}
                    >
                      +10%
                    </Button>
                    <span className="w-16 text-right font-medium">{priceChange || 0}%</span>
                  </div>
                </div>

                {selectedCollateral && amount && !isNaN(parseFloat(amount)) && (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">波动影响分析</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">原始抵押率</span>
                        <span>{collateralRatio}%</span>
                      </div>
                      
                      {(() => {
                        const newPrice = selectedCollateral.price * (1 + priceChange / 100);
                        const newRatio = Math.round((parseFloat(collateralAmount) * newPrice) / parseFloat(amount) * 100);
                        const liquidationImpact = selectedCollateral.liquidationRatio >= newRatio;
                        
                        return (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">抵押品新价格</span>
                              <span>${newPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">新抵押率</span>
                              <span className={
                                liquidationImpact 
                                  ? "text-destructive font-medium" 
                                  : newRatio <= selectedCollateral.minRatio 
                                    ? "text-yellow-500 font-medium" 
                                    : "text-green-500 font-medium"
                              }>
                                {newRatio}%
                              </span>
                            </div>
                            
                            <Separator />
                            
                            <div className="pt-2">
                              {liquidationImpact ? (
                                <div className="flex gap-2 text-destructive text-sm items-start">
                                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    <strong>清算风险!</strong> 价格变动将导致您的抵押率低于清算阈值 {selectedCollateral.liquidationRatio}%。请考虑增加抵押品或减少铸造量。
                                  </span>
                                </div>
                              ) : newRatio <= selectedCollateral.minRatio ? (
                                <div className="flex gap-2 text-yellow-500 text-sm items-start">
                                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    <strong>注意!</strong> 价格变动将导致您的抵押率低于最低要求 {selectedCollateral.minRatio}%。您将无法进行新的铸造操作。
                                  </span>
                                </div>
                              ) : (
                                <div className="flex gap-2 text-green-500 text-sm items-start">
                                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    <strong>安全!</strong> 即使价格下跌，您的抵押率仍然保持在安全水平。
                                  </span>
                                </div>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
                
                {(!selectedCollateral || !amount || isNaN(parseFloat(amount))) && (
                  <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                    <p className="mb-2">请先选择抵押品并输入铸造金额</p>
                    <p className="text-sm">完成铸造表单后，风险计算器将显示市场波动的潜在影响</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 右侧信息栏 */}
        <div className="space-y-6">
          {/* TpxUSD信息卡片 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>关于 TpxUSD</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">TpxUSD 稳定币</h3>
                  <p className="text-sm text-muted-foreground">Triplex协议的官方稳定币</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">当前价格</span>
                  <span>$1.00 USD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">总市值</span>
                  <span>$35,721,458</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">流通量</span>
                  <span>35,721,458 TpxUSD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">抵押率</span>
                  <span>185%</span>
                </div>
              </div>
              
              <div className="p-3 bg-primary/10 rounded-md text-sm">
                <p>TpxUSD 是由多种加密资产抵押担保的稳定币，与美元保持1:1的价格挂钩，是Triplex生态系统的基础。</p>
              </div>
            </CardContent>
          </Card>
          
          {/* 抵押品信息 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>抵押品参数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">资产</th>
                        <th className="text-right pb-2">最低<br/>抵押率</th>
                        <th className="text-right pb-2">清算<br/>阈值</th>
                        <th className="text-right pb-2">铸造<br/>费用</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collaterals.map(collateral => (
                        <tr key={collateral.symbol} className="border-b last:border-0">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-6 h-6 mr-2 rounded-full bg-background flex items-center justify-center">
                                <img
                                  src={collateral.icon}
                                  alt={collateral.symbol}
                                  className="h-4 w-4"
                                  onError={(e) => {
                                    e.currentTarget.src = "";
                                    e.currentTarget.alt = collateral.symbol.slice(0, 2);
                                  }}
                                />
                              </div>
                              <span>{collateral.symbol}</span>
                            </div>
                          </td>
                          <td className="text-right py-3">{collateral.minRatio}%</td>
                          <td className="text-right py-3">{collateral.liquidationRatio}%</td>
                          <td className="text-right py-3">{collateral.mintFee}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-3 bg-yellow-500/10 rounded-md text-sm text-yellow-500 flex gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>市场波动可能导致清算风险。请确保您的抵押率足够高，以抵御价格波动。</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 常见问题 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>常见问题</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">什么是 TpxUSD？</h3>
                <p className="text-sm text-muted-foreground">TpxUSD是Triplex协议的稳定币，与美元保持1:1锚定。用户可以通过抵押加密资产铸造TpxUSD，也可以在去中心化交易所进行交易。</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">如何避免清算？</h3>
                <p className="text-sm text-muted-foreground">为避免清算，请确保您的抵押率始终高于清算阈值。您可以通过追加抵押品或偿还部分债务来提高抵押率。建议将抵押率维持在200%以上的安全水平。</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">铸造费用如何计算？</h3>
                <p className="text-sm text-muted-foreground">铸造费用基于您要铸造的TpxUSD数量，不同抵押品有不同的费率。稳定币抵押通常为0.1%，而加密货币抵押则为0.25%-0.3%。</p>
              </div>
              
              <Button variant="link" className="px-0">
                查看更多常见问题
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* 确认铸造对话框 */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>确认铸造操作</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">铸造数量</span>
                <span className="font-medium">{amount} TpxUSD</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">抵押品</span>
                <div className="flex items-center gap-2">
                  {selectedCollateral && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedCollateral.icon}
                        alt={selectedCollateral.symbol}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="font-medium">
                        {collateralAmount} {selectedCollateral.symbol}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">抵押率</span>
                <span className={`font-medium ${
                  collateralRatio > 200 ? "text-green-500" : 
                  collateralRatio < 150 ? "text-destructive" : ""
                }`}>
                  {collateralRatio}%
                </span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">铸造费用</span>
                <span className="font-medium">
                  {selectedCollateral && (selectedCollateral.mintFee * 100).toFixed(2)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">预计Gas费用</span>
                <span className="font-medium">~0.0025 ETH</span>
              </div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-500">铸造风险提示</p>
                  <p className="text-muted-foreground mt-1">
                    当抵押率低于{selectedCollateral?.liquidationRatio || 120}%时，您的抵押品可能会被清算。市场波动可能导致抵押率变化。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
              className="mt-3 sm:mt-0"
            >
              取消
            </Button>
            <Button 
              onClick={handleConfirmMint}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  处理中...
                </span>
              ) : (
                "确认铸造"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 铸造成功对话框 */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>铸造成功</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{amount} TpxUSD</p>
              <p className="text-muted-foreground mt-1">已成功铸造到您的钱包</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">交易哈希</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs max-w-[180px] truncate">{txHash}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">抵押资产</span>
                <span>{collateralAmount} {selectedCollateral?.symbol}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">抵押率</span>
                <span>{collateralRatio}%</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              完成
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setIsSuccessModalOpen(false);
                // 重置表单
                setAmount("");
                setCollateralRatio(200);
              }}
            >
              继续铸造
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                setIsSuccessModalOpen(false);
                // 这里可以导航到仪表板页面
                // router.push("/dashboard");
              }}
            >
              查看资产
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 