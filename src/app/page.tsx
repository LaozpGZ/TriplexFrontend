"use client";

import { useEffect, useState } from "react";
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
import { AlertCircle } from "lucide-react";
import Image from "next/image";
// Imports for registering a browser extension wallet plugin on page load
import { MyWallet } from "@/utils/standardWallet";
import { registerWallet } from "@aptos-labs/wallet-standard";
import { CCTPTransfer } from "@/components/CCTPTransfer";
import Link from 'next/link'
import { 
  DollarSign, 
  BarChart3, 
  Clock, 
  Users, 
  ChevronRight,
  Twitter,
  Facebook,
  Instagram,
  Linkedin
} from 'lucide-react'
import { Button } from '@/components/ui/button'

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

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      <div className="hero text-center py-16 md:py-24 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          解锁更广阔的合成资产世界
        </h1>
        <p className="text-lg text-text-secondary mb-8">
          Triplex是一个去中心化合成资产协议，允许用户铸造、交易和管理与现实世界资产挂钩的合成资产，无需直接拥有底层资产。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/dashboard">立即开始</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/help-center">了解更多</Link>
          </Button>
        </div>
      </div>
      
      <div className="stats-bar grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 p-6 bg-card rounded-xl border border-border">
        <div className="stat-item text-center">
          <div className="flex justify-center mb-2 text-primary">
            <DollarSign size={24} />
          </div>
          <div className="stat-value text-2xl font-bold mb-1">$1.2亿</div>
          <div className="stat-label text-sm text-text-secondary">总锁仓价值</div>
        </div>
        <div className="stat-item text-center">
          <div className="flex justify-center mb-2 text-primary">
            <BarChart3 size={24} />
          </div>
          <div className="stat-value text-2xl font-bold mb-1">$4.5千万</div>
          <div className="stat-label text-sm text-text-secondary">总交易量</div>
        </div>
        <div className="stat-item text-center">
          <div className="flex justify-center mb-2 text-primary">
            <Clock size={24} />
          </div>
          <div className="stat-value text-2xl font-bold mb-1">15+</div>
          <div className="stat-label text-sm text-text-secondary">合成资产种类</div>
        </div>
        <div className="stat-item text-center">
          <div className="flex justify-center mb-2 text-primary">
            <Users size={24} />
          </div>
          <div className="stat-value text-2xl font-bold mb-1">25,000+</div>
          <div className="stat-label text-sm text-text-secondary">活跃用户</div>
        </div>
      </div>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-2">核心功能</h2>
        <p className="text-center text-text-secondary mb-10 max-w-2xl mx-auto">
          Triplex协议提供的一系列强大功能
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            title="合成资产铸造" 
            description="通过抵押加密资产，铸造与现实世界资产价格挂钩的合成资产，如股票、商品和法币。"
            icon={<DollarSign className="h-6 w-6 text-primary" />}
            href="/synthetic-assets"
          />
          <FeatureCard 
            title="抵押品管理" 
            description="灵活管理抵押品，随时添加或提取，优化资本效率，降低清算风险。"
            icon={<BarChart3 className="h-6 w-6 text-primary" />}
            href="/collateral"
          />
          <FeatureCard 
            title="流动性挖矿" 
            description="为合成资产池提供流动性，赚取交易费和TPX代币奖励，参与协议生态发展。"
            icon={<Clock className="h-6 w-6 text-primary" />}
            href="/liquidity-mining"
          />
          <FeatureCard 
            title="社区治理" 
            description="持有TPX代币参与协议治理，对关键参数变更、新合成资产上线和协议更新进行投票。"
            icon={<Users className="h-6 w-6 text-primary" />}
            href="/governance"
          />
          <FeatureCard 
            title="风险管理" 
            description="透明的清算机制和先进的风险指标，帮助用户有效管理头寸风险，保障系统稳定。"
            icon={<BarChart3 className="h-6 w-6 text-primary" />}
            href="/liquidation-risk"
          />
          <FeatureCard 
            title="实时数据分析" 
            description="全面的数据仪表板，实时监控协议指标、个人头寸和市场动态，做出明智决策。"
            icon={<BarChart3 className="h-6 w-6 text-primary" />}
            href="/analytics"
          />
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-2">如何开始使用</h2>
        <p className="text-center text-text-secondary mb-10 max-w-2xl mx-auto">
          通过几个简单步骤开始使用Triplex
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard 
            number={1}
            title="连接钱包" 
            description="使用MetaMask或其他支持的钱包连接到Triplex协议，确保您有足够的代币支付Gas费用。" 
          />
          <StepCard 
            number={2}
            title="存入抵押品" 
            description="将您的加密资产存入Triplex协议作为抵押品，为您的合成资产铸造提供担保。" 
          />
          <StepCard 
            number={3}
            title="铸造合成资产" 
            description="基于您的抵押品，铸造您想要的合成资产，如trxUSD、trxBTC或者其他合成资产。" 
          />
          <StepCard 
            number={4}
            title="交易和管理" 
            description="使用您的合成资产进行交易，或者参与流动性挖矿，赚取收益，同时管理您的风险。" 
          />
        </div>
      </section>
      
      <section className="mb-16 bg-card rounded-xl border border-border p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">准备好探索合成资产世界了吗？</h2>
        <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
          加入Triplex生态系统，铸造、交易和管理合成资产，参与DeFi创新的未来。
        </p>
        <Button size="lg" asChild>
          <Link href="/dashboard">立即开始</Link>
        </Button>
      </section>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-2">生态系统合作伙伴</h2>
        <p className="text-center text-text-secondary mb-10 max-w-2xl mx-auto">
          与行业领先机构共同构建更强大的DeFi生态
        </p>
        
        <div className="flex flex-wrap justify-center gap-6">
          {[1, 2, 3, 4, 5, 6].map((partner) => (
            <div 
              key={partner} 
              className="w-32 h-16 bg-card/50 rounded-lg flex items-center justify-center text-text-secondary border border-border"
            >
              Partner {partner}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

function FeatureCard({ title, description, icon, href }: FeatureCardProps) {
  return (
    <Link 
      href={href}
      className="block group bg-card hover:bg-card/80 border border-border rounded-xl p-6 transition-all hover:shadow-md hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <ChevronRight className="h-5 w-5 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </Link>
  )
}

interface StepCardProps {
  number: number
  title: string
  description: string
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 relative">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mt-4 mb-3 text-center">{title}</h3>
      <p className="text-text-secondary text-center">{description}</p>
    </div>
  )
}
