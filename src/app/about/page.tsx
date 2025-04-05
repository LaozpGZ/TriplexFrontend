"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  BarChart3, 
  Shield, 
  Clock, 
  Lock, 
  Zap,
  Users, 
  ChevronRight,
  Check,
  ArrowRight,
  ExternalLink,
  Database,
  Landmark
} from "lucide-react";

// 在文件顶部添加类型定义
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

interface IntegrationCardProps {
  title: string;
  category: string;
}

interface FaqCardProps {
  question: string;
  answer: string;
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* 顶部标题区 */}
      <section className="text-center mb-16 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          领先的去中心化合成资产协议
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          由新一代区块链生态系统驱动
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <StatsCard 
            title="总锁仓价值" 
            value="$124.23M" 
            icon={<Database className="h-5 w-5 text-primary" />} 
          />
          <StatsCard 
            title="$TpxUSD 供应量" 
            value="$55.30M" 
            icon={<DollarSign className="h-5 w-5 text-primary" />} 
          />
          <StatsCard 
            title="合成资产种类" 
            value="15+" 
            icon={<Landmark className="h-5 w-5 text-primary" />} 
          />
        </div>
      </section>
      
      {/* 核心功能区 */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            TpxUSD 的无限可能
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Triplex协议的核心稳定币为用户提供多种使用场景和功能
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<DollarSign className="h-10 w-10 text-primary" />}
            title="铸造 TpxUSD"
            description="通过抵押加密资产，以固定利率铸造TpxUSD稳定币，无需担心利率波动带来的不确定性支出"
            link="/mint-tpxusd"
          />
          
          <FeatureCard 
            icon={<Lock className="h-10 w-10 text-primary" />}
            title="质押 TpxUSD"
            description="将TpxUSD质押获得sTpxUSD，与Triplex协议共同成长，分享协议收益！将sTpxUSD存入储蓄池赚取收益"
            link="/stake"
          />
          
          <FeatureCard 
            icon={<Zap className="h-10 w-10 text-primary" />}
            title="使用 TpxUSD"
            description="将TpxUSD存入流动池参与清算，以优惠价格获取抵押品，或在生态系统中灵活使用您的TpxUSD"
            link="/earn"
          />
        </div>
      </section>
      
      {/* 参与协议奖励 */}
      <section className="mb-20 py-16 bg-primary/5 rounded-3xl text-center">
        <h2 className="text-3xl font-bold mb-2">
          TPX
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          参与越多，奖励越丰厚 — 让奖励源源不断！
        </p>
        
        <div className="flex justify-center">
          <Button size="lg" className="gap-2">
            <span>了解Triplex代币经济</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
      
      {/* 集成 */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            探索 TpxUSD 集成
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Triplex协议与多个项目和平台集成，扩展TpxUSD的使用场景
          </p>
        </div>
        
        <Tabs defaultValue="defi" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="defi">DeFi</TabsTrigger>
              <TabsTrigger value="games">游戏</TabsTrigger>
              <TabsTrigger value="infrastructure">基础设施</TabsTrigger>
              <TabsTrigger value="tools">工具</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="defi" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <IntegrationCard key={i} 
                  title={`DeFi项目 ${i}`} 
                  category="DeFi" 
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="games" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <IntegrationCard key={i} 
                  title={`游戏 ${i}`} 
                  category="游戏" 
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="infrastructure" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <IntegrationCard key={i} 
                  title={`基础设施 ${i}`} 
                  category="基础设施" 
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <IntegrationCard key={i} 
                  title={`工具 ${i}`} 
                  category="工具" 
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="gap-2">
            <span>查看更多集成</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
      
      {/* 如何开始 */}
      <section className="mb-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          开始使用 TpxUSD
        </h2>
        
        <div className="flex justify-center">
          <Button size="lg" asChild>
            <Link href="/mint-tpxusd">立即体验</Link>
          </Button>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            常见问题
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <FaqCard 
            question="什么是 Triplex 协议？" 
            answer="Triplex协议是一个去中心化合成资产协议，允许加密资产持有者通过将资产放入抵押债务头寸(CDP)，借出与美元挂钩的TpxUSD稳定币。Triplex协议通过强大的锚定机制确保TpxUSD稳定在1美元，使其成为Triplex网络上可靠的交换媒介。这种稳定性使用户能够高效地进行交易、增强流动性和管理资产，无需承担意外的利息支付。Triplex协议提供无缝体验，使TpxUSD成为导航生态系统的理想选择。" 
          />
          
          <FaqCard 
            question="如何确保 TpxUSD 的价格稳定在 $1？" 
            answer="Triplex协议采用多种机制确保TpxUSD的价格稳定在1美元:

・流动池: 作为维持系统偿付能力的主要防线，当抵押率低于最低抵押率(MCR)时清算资不足的头寸。清算的抵押品分配给存入TpxUSD的流动池贡献者。

・恢复模式: 当总抵押率(TCR)低于150%时触发，对抵押率在110%和当前TCR之间的头寸进行额外清算，鼓励增加存款提高系统稳定性。

・赎回机制: 允许以当前汇率全额赎回TpxUSD兑换抵押品，优先考虑风险最高的头寸，提高整体系统抵押并维持接近1美元的价格下限。

・稳定模块(PSM): 以1:1的兑换率维持TpxUSD与USDC/USDT的挂钩。用户可以将高于1美元的TpxUSD兑换为稳定币(创造卖压)，或者在低于1美元时购买TpxUSD(创造买压)，稳定其价值。" 
          />
          
          <FaqCard 
            question="Triplex协议的主要优势是什么？" 
            answer="Triplex协议为加密经济提供金融效率和稳定性的关键优势:

・固定利率流动性: 借款人以固定利率获取流动性，可在DeFi市场使用TpxUSD而无需担心利率波动。

・低抵押率(最低110%): 即时高效的清算确保快速清理抵押不足的头寸，支持低抵押率并维持系统稳定性。

・强价格锚定: 套利和稳定模块(PSM)等机制将TpxUSD锚定在1美元，支持TpxUSD与USDC和USDT等稳定币之间的1:1兑换。

・无治理运营: 所有参数预设并由算法控制，实现自主高效运行，无需治理干预。

・抗审查: 去中心化运营降低干扰或操纵风险。

・多抵押支持: 接受各种数字资产作为抵押，提供灵活性和增长潜力。

・闪电贷和闪电铸造服务: 提供套利机会，确保协议健康运行。" 
          />
          
          <FaqCard 
            question="借用/使用 TpxUSD 有什么好处？" 
            answer="用户可以通过四种主要方式参与Triplex协议获得多种优势: 激励借贷、通过质押赚取收益、参与流动池和跨项目使用TpxUSD。

・通过sTpxUSD赚取收益: 用户将TpxUSD存入质押池时，会收到sTpxUSD作为凭证。sTpxUSD通过TpxUSD储蓄率(TSR)获得固定回报，资金来源于Triplex协议的收入。

・激励借贷: 用户可以使用流动质押代币(LSTs)借TpxUSD并获得奖励，使借贷更具吸引力同时提供额外收益。

・参与流动池: 将TpxUSD存入流动池使用户能够贡献协议稳定性。当发生清算时，流动池使用TpxUSD偿还债务，获得折扣抵押品作为回报，确保TpxUSD保持超额抵押。此参与不仅支持系统稳定，还为用户提供切实利益。

・跨项目使用: TpxUSD可在生态系统内的各种项目中使用，增强其实用性，使其成为交易和其他应用的多功能资产。" 
          />
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="gap-2" asChild>
            <Link href="/help-center">
              <span>查看更多问题</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* 审计部分 */}
      <section className="mb-20">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">安全审计机构</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Triplex协议经过多家顶级安全审计机构的全面审计
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <span className="font-medium">CertiK</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <span className="font-medium">PeckShield</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <span className="font-medium">SlowMist</span>
          </div>
        </div>
      </section>
      
      {/* 合作伙伴 */}
      <section className="mb-20">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">合作伙伴</h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="w-32 h-16 bg-muted/50 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">合作伙伴 {i}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* 加入社区 */}
      <section className="text-center mb-20">
        <h2 className="text-3xl font-bold mb-6">
          加入我们的社区
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" size="lg" className="gap-2">
            <span>Twitter</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <span>Telegram</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <span>Discord</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <span>Medium</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

// 修改组件函数定义
function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="inline-flex justify-center mb-4">
            {icon}
          </div>
          <h3 className="text-3xl font-bold mb-1">{value}</h3>
          <p className="text-muted-foreground text-sm">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Button variant="link" className="px-0" asChild>
          <Link href={link}>
            了解更多 <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function IntegrationCard({ title, category }: IntegrationCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="h-20 bg-muted/50 rounded-md flex items-center justify-center mb-3">
          <span className="text-muted-foreground">{title}</span>
        </div>
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function FaqCard({ question, answer }: FaqCardProps) {
  return (
    <Card className="text-left h-full">
      <CardHeader>
        <CardTitle className="text-xl">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-line">
          {answer}
        </p>
      </CardContent>
    </Card>
  );
} 