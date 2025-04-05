"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Proposal {
  id: string;
  title: string;
  status: "active" | "pending" | "closed";
  proposer: string;
  timeRemaining?: string;
  startTime?: string;
  endTime?: string;
  participants: number;
  description: string;
  votesFor: number;
  votesAgainst?: number;
  totalVotes: number;
  percentage: number;
  result?: "passed" | "rejected";
}

// 模拟数据
const proposals: Proposal[] = [
  {
    id: "TIP-023",
    title: "调整清算阈值参数",
    status: "active",
    proposer: "0x1234...5678",
    timeRemaining: "2天8小时",
    participants: 156,
    description: "提议将APT抵押品的清算阈值从140%调整至145%，以增强系统安全性。同时优化清算奖励机制，提高清算人参与积极性。",
    votesFor: 850000,
    totalVotes: 1133333,
    percentage: 75,
  },
  {
    id: "TIP-022",
    title: "新增stSOL抵押品",
    status: "pending",
    proposer: "0x9876...4321",
    startTime: "12小时后",
    participants: 0,
    description: "提议将Solana质押代币stSOL添加为新的抵押品类型，初始抵押率为150%，清算阈值为140%。包含Oracle适配方案和风险评估报告。",
    votesFor: 0,
    totalVotes: 0,
    percentage: 0,
  },
  {
    id: "TIP-021",
    title: "TPX激励方案调整",
    status: "closed",
    proposer: "0x5555...7777",
    endTime: "2天前",
    participants: 283,
    description: "调整TPX代币的发放机制，增加对长期质押者的奖励，引入时间锁定机制。提案已通过，将于下周实施。",
    votesFor: 1250000,
    totalVotes: 1358696,
    percentage: 92,
    result: "passed"
  },
  {
    id: "TIP-020",
    title: "增加借贷市场流动性",
    status: "closed",
    proposer: "0x3344...7799",
    endTime: "5天前",
    participants: 195,
    description: "通过调整激励机制和利率模型，增加借贷市场流动性，降低稳定币借贷利率。",
    votesFor: 620000,
    totalVotes: 1550000,
    percentage: 40,
    result: "rejected"
  },
  {
    id: "TIP-019",
    title: "引入多签名治理机制",
    status: "active",
    proposer: "0x2468...1357",
    timeRemaining: "4天12小时",
    participants: 89,
    description: "为重要参数变更引入多签名治理机制，提高系统安全性和去中心化程度。",
    votesFor: 450000,
    totalVotes: 900000,
    percentage: 50,
  }
];

export default function Governance() {
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [votedProposals, setVotedProposals] = useState<string[]>([]);
  const [votes, setVotes] = useState<Record<string, "for" | "against">>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const [proposalDetailOpen, setProposalDetailOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"latest" | "oldest" | "votesHigh" | "votesLow">("latest");
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  
  // 创建提案表单状态
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    type: "parameter",
    discussionUrl: ""
  });
  
  // 质押状态
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakedTPX, setStakedTPX] = useState(25000);
  const [availableTPX, setAvailableTPX] = useState(15000);

  // 模拟加载效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleVote = (proposalId: string, vote: "for" | "against") => {
    setVotes(prev => ({
      ...prev,
      [proposalId]: vote
    }));
    
    if (!votedProposals.includes(proposalId)) {
      setVotedProposals(prev => [...prev, proposalId]);
    }
    
    alert(`您已对提案 ${proposalId} 投票${vote === "for" ? "赞成" : "反对"}`);
  };

  const getFilteredProposals = (status: "active" | "pending" | "closed" | "voted") => {
    if (status === "voted") {
      return proposals.filter(p => votedProposals.includes(p.id));
    }
    return proposals.filter(p => p.status === status);
  };

  const getStatusBadge = (status: "active" | "pending" | "closed") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">进行中</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">即将开始</Badge>;
      case "closed":
        return <Badge variant="destructive">已结束</Badge>;
    }
  };
  
  const handleCreateProposal = () => {
    // 验证表单
    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      alert("请填写所有必填字段");
      return;
    }
    
    // 如果质押的TPX不够100,000
    if (stakedTPX < 100000) {
      alert("创建提案需要至少质押100,000 TPX");
      setCreateModalOpen(false);
      setStakeModalOpen(true);
      return;
    }
    
    // 模拟提案创建成功
    alert(`提案创建成功，将在审核后上线`);
    setCreateModalOpen(false);
    
    // 重置表单
    setNewProposal({
      title: "",
      description: "",
      type: "parameter",
      discussionUrl: ""
    });
  };
  
  const handleStake = () => {
    const amount = Number(stakeAmount);
    if (isNaN(amount) || amount <= 0 || amount > availableTPX) {
      alert("请输入有效的质押数量");
      return;
    }
    
    // 模拟质押
    setStakedTPX(prev => prev + amount);
    setAvailableTPX(prev => prev - amount);
    setStakeModalOpen(false);
    setStakeAmount("");
    
    alert(`成功质押 ${amount} TPX`);
  };
  
  const handleViewDetails = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setProposalDetailOpen(true);
  };
  
  // 提案类型选项
  const proposalTypes = [
    { value: "parameter", label: "参数调整" },
    { value: "asset", label: "新增资产" },
    { value: "upgrade", label: "协议升级" },
    { value: "distribution", label: "收益分配" },
    { value: "other", label: "其他" }
  ];
  
  // 图表数据
  const pieData = [
    { name: '赞成', value: selectedProposal?.votesFor || 0, color: '#4f46e5' },
    { name: '反对', value: (selectedProposal?.totalVotes || 0) - (selectedProposal?.votesFor || 0), color: '#dc2626' }
  ];

  // 提案搜索和排序
  const getFilteredAndSortedProposals = (status: "active" | "pending" | "closed" | "voted") => {
    let filtered = getFilteredProposals(status);
    
    // 搜索
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(lowerSearchTerm) || 
        p.id.toLowerCase().includes(lowerSearchTerm) ||
        p.proposer.toLowerCase().includes(lowerSearchTerm) ||
        p.description.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // 排序
    return filtered.sort((a, b) => {
      switch (sortField) {
        case "latest":
          return proposals.indexOf(a) - proposals.indexOf(b);
        case "oldest":
          return proposals.indexOf(b) - proposals.indexOf(a);
        case "votesHigh":
          return b.percentage - a.percentage;
        case "votesLow":
          return a.percentage - b.percentage;
        default:
          return 0;
      }
    });
  };
  
  // 获取治理统计数据
  const getGovernanceStats = () => {
    return {
      totalProposals: proposals.length,
      activeProposals: proposals.filter(p => p.status === "active").length,
      pendingProposals: proposals.filter(p => p.status === "pending").length,
      closedProposals: proposals.filter(p => p.status === "closed").length,
      passRate: Math.round(proposals.filter(p => p.result === "passed").length / proposals.filter(p => p.status === "closed").length * 100),
      avgParticipation: Math.round(proposals.reduce((acc, p) => acc + p.participants, 0) / proposals.length),
      totalVotingPower: "12.5M TPX"
    };
  };
  
  // 获取状态统计
  const stats = getGovernanceStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <nav className="flex mb-4 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary mr-2">首页</Link>
          <span className="text-muted-foreground mx-2">/</span>
          <span>治理</span>
        </nav>
        <h1 className="text-3xl font-bold">治理</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-card rounded-lg p-4 shadow">
            <div className="space-y-2">
              <Link href="/collateral" className="block px-4 py-2 hover:bg-accent rounded-md cursor-pointer">抵押品管理</Link>
              <Link href="/synthetix" className="block px-4 py-2 hover:bg-accent rounded-md cursor-pointer">合成资产</Link>
              <Link href="/triplexliquiditymining" className="block px-4 py-2 hover:bg-accent rounded-md cursor-pointer">流动性挖矿</Link>
              <div className="px-4 py-2 bg-accent rounded-md cursor-pointer text-primary font-medium">治理</div>
              <Link href="/dashboard" className="block px-4 py-2 hover:bg-accent rounded-md cursor-pointer">数据分析</Link>
              <Link href="/help-center" className="block px-4 py-2 hover:bg-accent rounded-md cursor-pointer">帮助中心</Link>
            </div>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>质押状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>已质押 TPX</span>
                    <span className="font-medium">{stakedTPX.toLocaleString()}</span>
                  </div>
                  <Progress value={(stakedTPX / (stakedTPX + availableTPX)) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>可用 TPX</span>
                    <span className="font-medium">{availableTPX.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span>可创建提案</span>
                  <span className={`font-medium ${stakedTPX >= 100000 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {stakedTPX >= 100000 ? '是' : '需要100,000 TPX'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setStakeModalOpen(true)} 
                    className="w-full"
                    variant="outline"
                  >
                    质押
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    disabled={stakedTPX <= 0}
                  >
                    解除质押
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">快速链接</h3>
              <div className="space-y-2">
                <Link href="#" className="block p-2 hover:bg-accent rounded-md text-sm">治理讨论区</Link>
                <Link href="#" className="block p-2 hover:bg-accent rounded-md text-sm">提案规范</Link>
                <Link href="#" className="block p-2 hover:bg-accent rounded-md text-sm">TPX代币信息</Link>
                <Link href="#" className="block p-2 hover:bg-accent rounded-md text-sm">治理文档</Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>治理概览</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-card/30 p-4 rounded-lg">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-28 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-card/30 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">总质押TPX</div>
                    <div className="text-2xl font-bold">12.5M</div>
                    <div className="text-sm text-muted-foreground">占总供应量 25.0%</div>
                  </div>
                  <div className="bg-card/30 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">活跃提案</div>
                    <div className="text-2xl font-bold">
                      {proposals.filter(p => p.status === "active").length}
                    </div>
                    <div className="text-sm text-muted-foreground">本周新增 3 个</div>
                  </div>
                  <div className="bg-card/30 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">您的投票权</div>
                    <div className="text-2xl font-bold">{stakedTPX.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">已质押 TPX</div>
                  </div>
                  <div className="bg-card/30 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">参与率</div>
                    <div className="text-2xl font-bold">68.5%</div>
                    <div className="text-sm text-green-500">较上月 +5.2%</div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setShowAnalyticsModal(true)}>
                  查看详细统计
                </Button>
                <Button onClick={() => setCreateModalOpen(true)}>
                  创建提案
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-full mb-6" />
                  <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-64 w-full rounded-lg" />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                    <Tabs 
                      defaultValue="active" 
                      value={activeTab} 
                      onValueChange={(value) => setActiveTab(value)}
                      className="w-full md:w-auto"
                    >
                      <TabsList className="w-full md:w-auto justify-start">
                        <TabsTrigger value="active">活跃提案</TabsTrigger>
                        <TabsTrigger value="pending">即将开始</TabsTrigger>
                        <TabsTrigger value="closed">已结束</TabsTrigger>
                        <TabsTrigger value="voted">我的投票</TabsTrigger>
                      </TabsList>
                      
                      {["active", "pending", "closed", "voted"].map((tab) => (
                        <TabsContent key={tab} value={tab} className="space-y-6 mt-6">
                          {getFilteredAndSortedProposals(tab as any).length === 0 ? (
                            <div className="text-center py-16">
                              {searchTerm ? (
                                <h3 className="text-xl font-medium mb-2">没有找到匹配"{searchTerm}"的提案</h3>
                              ) : (
                                <h3 className="text-xl font-medium mb-2">暂无{tab === "active" ? "活跃" : tab === "pending" ? "即将开始" : tab === "closed" ? "已结束" : "您参与的"}提案</h3>
                              )}
                              {tab === "voted" && !searchTerm && (
                                <>
                                  <p className="text-muted-foreground mb-6">参与投票，共同决定Triplex协议的未来</p>
                                  <Button onClick={() => setActiveTab("active")}>浏览活跃提案</Button>
                                </>
                              )}
                              {searchTerm && (
                                <Button 
                                  variant="ghost" 
                                  className="mt-4"
                                  onClick={() => setSearchTerm("")}
                                >
                                  清除搜索条件
                                </Button>
                              )}
                            </div>
                          ) : (
                            getFilteredAndSortedProposals(tab as any).map((proposal) => (
                              <Card key={proposal.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                  <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-medium">
                                      {proposal.id}: {proposal.title}
                                    </h3>
                                    {getStatusBadge(proposal.status)}
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                                    <div>提案人: {proposal.proposer}</div>
                                    {proposal.timeRemaining && <div>剩余时间: {proposal.timeRemaining}</div>}
                                    {proposal.startTime && <div>开始时间: {proposal.startTime}</div>}
                                    {proposal.endTime && <div>结束时间: {proposal.endTime}</div>}
                                    <div>参与人数: {proposal.participants}</div>
                                  </div>
                                  
                                  <p className="text-muted-foreground mb-6">{proposal.description}</p>
                                  
                                  <div className="mb-2">
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary rounded-full" 
                                        style={{ width: `${proposal.percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between text-sm mb-6">
                                    <div className="text-muted-foreground">
                                      {proposal.status === "closed" 
                                        ? `${proposal.result === "passed" ? "已通过" : "未通过"}: ${proposal.votesFor.toLocaleString()} TPX` 
                                        : `赞成: ${proposal.votesFor.toLocaleString()} TPX`}
                                    </div>
                                    <div className="font-medium">{proposal.percentage}%</div>
                                  </div>
                                  
                                  <div className="flex gap-3">
                                    {proposal.status === "active" && !votedProposals.includes(proposal.id) ? (
                                      <>
                                        <Button 
                                          onClick={() => handleVote(proposal.id, "for")}
                                          className="flex-1"
                                        >
                                          投票赞成
                                        </Button>
                                        <Button 
                                          variant="outline"
                                          onClick={() => handleVote(proposal.id, "against")}
                                          className="flex-1"
                                        >
                                          投票反对
                                        </Button>
                                      </>
                                    ) : proposal.status === "pending" ? (
                                      <Button 
                                        variant="outline" 
                                        className="flex-1"
                                        onClick={() => handleViewDetails(proposal)}
                                      >
                                        查看详情
                                      </Button>
                                    ) : proposal.status === "closed" ? (
                                      <Button 
                                        variant="outline" 
                                        className="flex-1"
                                        onClick={() => handleViewDetails(proposal)}
                                      >
                                        查看结果
                                      </Button>
                                    ) : (
                                      <div className="flex items-center px-4 py-2 bg-muted rounded-md text-sm w-full justify-center font-medium">
                                        已投票 {votes[proposal.id] === "for" ? "赞成" : "反对"}
                                      </div>
                                    )}
                                    
                                    {!votedProposals.includes(proposal.id) && (
                                      <Button 
                                        variant="ghost" 
                                        className="px-3"
                                        onClick={() => handleViewDetails(proposal)}
                                      >
                                        详情
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </TabsContent>
                      ))}
                    </Tabs>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <Input
                        className="max-w-[300px]"
                        placeholder="搜索提案..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      />
                      
                      <Select 
                        value={sortField} 
                        onValueChange={(value) => setSortField(value as any)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="排序方式" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">最新提案</SelectItem>
                          <SelectItem value="oldest">最早提案</SelectItem>
                          <SelectItem value="votesHigh">投票率高到低</SelectItem>
                          <SelectItem value="votesLow">投票率低到高</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>如何参与治理</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-4 mb-6">
                <li>
                  <strong>质押TPX</strong> - 质押TPX代币获得投票权
                </li>
                <li>
                  <strong>浏览提案</strong> - 查看当前活跃的治理提案
                </li>
                <li>
                  <strong>参与投票</strong> - 使用您的投票权对提案进行投票
                </li>
                <li>
                  <strong>提交提案</strong> - 质押足够的TPX后可以提交新的提案
                </li>
              </ol>
              
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="text-primary font-semibold mb-2">提案指南</h4>
                <p className="text-sm">提交提案需要质押至少100,000 TPX。提案将经过72小时的讨论期，随后进入为期7天的投票期。提案通过需要获得超过50%的赞成票，且参与投票的TPX数量需超过总质押量的20%。</p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">投票权重</h4>
                  <p className="text-sm text-muted-foreground">您的投票权重与质押的TPX数量成正比，持有更多TPX将获得更大的投票权。</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">提案类型</h4>
                  <p className="text-sm text-muted-foreground">提案可涉及参数调整、新资产添加、协议升级、收益分配等方面，需详细说明实施方案。</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">执行时间</h4>
                  <p className="text-sm text-muted-foreground">通过的提案将在投票结束后48小时内由多签钱包执行，重大升级可能需要更长准备时间。</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button size="lg" onClick={() => setCreateModalOpen(true)}>创建提案</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* 创建提案模态框 */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>创建提案</DialogTitle>
            <DialogDescription>
              创建一个新的治理提案。请确保提供详细的信息，以便社区能够了解您的提议。
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">提案标题 *</Label>
              <Input 
                id="title" 
                value={newProposal.title}
                onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="简明扼要的描述您的提案"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">提案类型 *</Label>
              <Select 
                value={newProposal.type}
                onValueChange={(value) => setNewProposal(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择提案类型" />
                </SelectTrigger>
                <SelectContent>
                  {proposalTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">提案详细描述 *</Label>
              <Textarea 
                id="description" 
                value={newProposal.description}
                onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="详细描述您的提案，包括实施方案、预期影响等"
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discussionUrl">讨论链接（可选）</Label>
              <Input 
                id="discussionUrl" 
                value={newProposal.discussionUrl}
                onChange={(e) => setNewProposal(prev => ({ ...prev, discussionUrl: e.target.value }))}
                placeholder="链接到相关讨论或技术文档"
              />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">您的质押TPX</span>
                <span>{stakedTPX.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">提案要求</span>
                <span>100,000 TPX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">状态</span>
                <span className={stakedTPX >= 100000 ? "text-green-500" : "text-yellow-500"}>
                  {stakedTPX >= 100000 ? "可以创建" : "质押不足"}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateProposal}>
              提交提案
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 质押模态框 */}
      <Dialog open={stakeModalOpen} onOpenChange={setStakeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>质押TPX</DialogTitle>
            <DialogDescription>
              质押TPX代币以获得投票权。质押的TPX将被锁定，直到您解除质押。
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="stakeAmount">质押数量</Label>
                <span className="text-sm text-muted-foreground">
                  可用: {availableTPX.toLocaleString()} TPX
                </span>
              </div>
              <div className="relative">
                <Input 
                  id="stakeAmount" 
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="输入质押数量"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs"
                  onClick={() => setStakeAmount(availableTPX.toString())}
                >
                  最大
                </Button>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">当前已质押</span>
                <span>{stakedTPX.toLocaleString()} TPX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">质押后总量</span>
                <span>{(stakedTPX + Number(stakeAmount || 0)).toLocaleString()} TPX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">创建提案资格</span>
                <span className={(stakedTPX + Number(stakeAmount || 0)) >= 100000 ? "text-green-500" : "text-yellow-500"}>
                  {(stakedTPX + Number(stakeAmount || 0)) >= 100000 ? "符合" : "不符合（需100,000 TPX）"}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setStakeModalOpen(false)}>
              取消
            </Button>
            <Button onClick={handleStake}>
              确认质押
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 提案详情模态框 */}
      <Dialog open={proposalDetailOpen} onOpenChange={setProposalDetailOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>提案详情</DialogTitle>
          </DialogHeader>
          
          {selectedProposal && (
            <div className="space-y-6 mt-2">
              <div>
                <h3 className="text-xl font-medium mb-2">
                  {selectedProposal.id}: {selectedProposal.title}
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  {getStatusBadge(selectedProposal.status)}
                  <span className="text-sm text-muted-foreground">提案人: {selectedProposal.proposer}</span>
                </div>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">状态</span>
                  <span>{selectedProposal.status === "active" 
                    ? "投票中" 
                    : selectedProposal.status === "pending" 
                      ? "即将开始" 
                      : selectedProposal.result === "passed" 
                        ? "已通过" 
                        : "未通过"}</span>
                </div>
                
                {selectedProposal.timeRemaining && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">剩余时间</span>
                    <span>{selectedProposal.timeRemaining}</span>
                  </div>
                )}
                
                {selectedProposal.startTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">开始时间</span>
                    <span>{selectedProposal.startTime}</span>
                  </div>
                )}
                
                {selectedProposal.endTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">结束时间</span>
                    <span>{selectedProposal.endTime}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">参与人数</span>
                  <span>{selectedProposal.participants}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">提案描述</h4>
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedProposal.description}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">投票结果</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${selectedProposal.percentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm mb-3">
                      <div className="text-muted-foreground">
                        赞成: {selectedProposal.votesFor.toLocaleString()} TPX
                      </div>
                      <div className="font-medium">{selectedProposal.percentage}%</div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div className="text-muted-foreground">
                        反对: {(selectedProposal.totalVotes - selectedProposal.votesFor).toLocaleString()} TPX
                      </div>
                      <div className="font-medium">{100 - selectedProposal.percentage}%</div>
                    </div>
                  </div>
                  
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          fill="#8884d8"
                          paddingAngle={1}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {selectedProposal.status === "active" && !votedProposals.includes(selectedProposal.id) && (
                <div className="flex gap-3 mt-2">
                  <Button 
                    onClick={() => {
                      handleVote(selectedProposal.id, "for");
                      setProposalDetailOpen(false);
                    }}
                    className="flex-1"
                  >
                    投票赞成
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleVote(selectedProposal.id, "against");
                      setProposalDetailOpen(false);
                    }}
                    className="flex-1"
                  >
                    投票反对
                  </Button>
                </div>
              )}
              
              {votedProposals.includes(selectedProposal.id) && (
                <div className="flex items-center justify-center px-4 py-3 bg-muted rounded-md text-sm w-full font-medium">
                  您已投票 {votes[selectedProposal.id] === "for" ? "赞成" : "反对"}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 治理分析模态框 */}
      <Dialog open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>治理数据分析</DialogTitle>
            <DialogDescription>
              Triplex治理数据概览与统计分析
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">总提案数</div>
                <div className="text-2xl font-bold">{stats.totalProposals}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  活跃: {stats.activeProposals} / 即将开始: {stats.pendingProposals} / 已结束: {stats.closedProposals}
                </div>
              </div>
              
              <div className="bg-card/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">提案通过率</div>
                <div className="text-2xl font-bold">{stats.passRate}%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  基于已结束的提案
                </div>
              </div>
              
              <div className="bg-card/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">平均参与人数</div>
                <div className="text-2xl font-bold">{stats.avgParticipation}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  每个提案的平均投票人数
                </div>
              </div>
              
              <div className="bg-card/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">总质押量</div>
                <div className="text-2xl font-bold">{stats.totalVotingPower}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  占总供应量的25%
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-3">近期提案类型分布</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: '参数调整', value: 8, color: '#4f46e5' },
                        { name: '资产添加', value: 5, color: '#8b5cf6' },
                        { name: '协议升级', value: 3, color: '#ec4899' },
                        { name: '收益分配', value: 4, color: '#10b981' },
                        { name: '其他', value: 2, color: '#6b7280' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={1}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: '参数调整', value: 8, color: '#4f46e5' },
                        { name: '资产添加', value: 5, color: '#8b5cf6' },
                        { name: '协议升级', value: 3, color: '#ec4899' },
                        { name: '收益分配', value: 4, color: '#10b981' },
                        { name: '其他', value: 2, color: '#6b7280' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="border-t border-border pt-4">
              <h3 className="font-medium text-lg mb-3">最活跃的治理参与者</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>0x6789...abcd</span>
                  </div>
                  <span>18 提案</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>0x1234...ef56</span>
                  </div>
                  <span>12 提案</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>0x89ab...0123</span>
                  </div>
                  <span>9 提案</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 