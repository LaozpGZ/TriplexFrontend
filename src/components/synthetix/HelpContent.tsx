'use client'

import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  RefreshCw,
  Landmark,
  Layers
} from 'lucide-react'

interface HelpContentProps {
  topic?: string
}

export function HelpContent({ topic = 'all' }: HelpContentProps) {
  // 帮助主题内容
  const helpTopics = {
    // 基础介绍
    introduction: {
      title: '什么是合成资产？',
      icon: <Layers className="h-5 w-5 text-primary" />,
      content: (
        <>
          <p className="mb-3">
            合成资产是通过智能合约创建的数字资产，它们的价值与真实世界的资产挂钩，如加密货币、大宗商品、股票等，但不需要实际持有这些资产。
          </p>
          <p className="mb-3">
            在Triplex平台上，您可以铸造和交易各种合成资产，实现对多种市场的无缝接入，无需考虑传统市场的限制和跨境问题。
          </p>
          <div className="mt-4 rounded-md bg-muted p-3">
            <h4 className="font-medium">主要优势：</h4>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>无需KYC验证，保护隐私</li>
              <li>全天候交易，没有市场休市时间</li>
              <li>降低交易费用</li>
              <li>一站式访问全球多种资产类别</li>
            </ul>
          </div>
        </>
      )
    },
    
    // 铸造过程
    minting: {
      title: '如何铸造合成资产？',
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      content: (
        <>
          <p className="mb-3">
            铸造合成资产是创建新合成代币的过程，这些代币会跟踪实际资产的价格。
          </p>
          <div className="mt-2 space-y-3">
            <div className="rounded-md bg-muted p-3">
              <h4 className="font-medium">铸造步骤：</h4>
              <ol className="mt-2 list-decimal pl-5 text-sm">
                <li>提供足够的抵押品（当前支持USDC、USDT、DAI和APT）</li>
                <li>维持最低抵押率150%以上</li>
                <li>支付铸造费用（目前为0.3%）</li>
                <li>确认交易并签名</li>
              </ol>
            </div>
            
            <div className="rounded-md bg-primary/10 p-3">
              <h4 className="font-medium text-primary">提示：</h4>
              <p className="mt-1 text-sm">
                建议保持较高的抵押率（200%以上），以避免市场波动导致的清算风险。您可以随时添加抵押品来提高抵押率。
              </p>
            </div>
          </div>
        </>
      )
    },
    
    // 价格机制
    pricing: {
      title: '价格如何确定？',
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      content: (
        <>
          <p className="mb-3">
            合成资产的价格由去中心化预言机网络提供，确保价格数据的准确性和可靠性。
          </p>
          <p className="mb-3">
            Triplex使用多种预言机服务的组合，包括Chainlink、Pyth和内部聚合器，以提供更准确的价格数据。
          </p>
          <div className="mt-4 rounded-md bg-muted p-3">
            <h4 className="font-medium">价格更新频率：</h4>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li><span className="font-medium">加密货币</span>：每5分钟更新一次</li>
              <li><span className="font-medium">商品</span>：每30分钟更新一次</li>
              <li><span className="font-medium">外汇</span>：每60分钟更新一次</li>
              <li><span className="font-medium">股票</span>：在交易时间内每15分钟更新一次</li>
            </ul>
          </div>
        </>
      )
    },
    
    // 清算风险
    liquidation: {
      title: '了解清算风险',
      icon: <Shield className="h-5 w-5 text-primary" />,
      content: (
        <>
          <p className="mb-3">
            如果您的抵押率低于最低要求（150%），您的头寸将面临清算风险。清算会自动出售部分抵押品以偿还债务，并收取清算罚金。
          </p>
          <div className="mt-2 space-y-3">
            <div className="rounded-md bg-destructive/10 p-3">
              <h4 className="font-medium text-destructive">风险提示：</h4>
              <p className="mt-1 text-sm">
                市场波动可能导致资产价格快速变化，增加清算风险。建议持续监控您的抵押率，并在必要时添加更多抵押品。
              </p>
            </div>
            
            <div className="rounded-md bg-muted p-3">
              <h4 className="font-medium">避免清算的策略：</h4>
              <ul className="mt-2 list-disc pl-5 text-sm">
                <li>保持较高的抵押率（建议200%以上）</li>
                <li>启用价格警报通知</li>
                <li>分散持有不同类型的合成资产</li>
                <li>准备额外资金以便快速添加抵押品</li>
              </ul>
            </div>
          </div>
        </>
      )
    },
    
    // 交易和转账
    trading: {
      title: '交易和转账',
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      content: (
        <>
          <p className="mb-3">
            合成资产可以像普通代币一样自由交易和转账，支持在各种DEX上交易，或点对点转账给其他钱包地址。
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-md bg-muted p-3">
              <h4 className="font-medium">交易选项：</h4>
              <ul className="mt-2 list-disc pl-5 text-sm">
                <li><span className="font-medium">DEX交易</span>：在Uniswap、PancakeSwap等去中心化交易所进行交易</li>
                <li><span className="font-medium">直接转账</span>：将合成资产转账给任何钱包地址</li>
                <li><span className="font-medium">流动性提供</span>：为交易对提供流动性并赚取奖励</li>
              </ul>
            </div>
            
            <div className="rounded-md bg-primary/10 p-3">
              <h4 className="font-medium text-primary">提示：</h4>
              <p className="mt-1 text-sm">
                交易前请检查流动性情况，低流动性的合成资产可能导致较大的滑点。考虑使用限价单功能来设置您愿意接受的最低价格。
              </p>
            </div>
          </div>
        </>
      )
    },
    
    // 赎回流程
    redemption: {
      title: '赎回合成资产',
      icon: <RefreshCw className="h-5 w-5 text-primary" />,
      content: (
        <>
          <p className="mb-3">
            当您想要收回抵押品时，可以通过赎回功能销毁合成资产，释放相应的抵押品。
          </p>
          <div className="mt-2 space-y-3">
            <div className="rounded-md bg-muted p-3">
              <h4 className="font-medium">赎回步骤：</h4>
              <ol className="mt-2 list-decimal pl-5 text-sm">
                <li>前往"资产管理"页面</li>
                <li>选择要赎回的合成资产</li>
                <li>输入要赎回的数量</li>
                <li>支付赎回费用（目前为0.3%）</li>
                <li>确认交易并签名</li>
              </ol>
            </div>
            
            <div className="rounded-md bg-primary/10 p-3">
              <h4 className="font-medium text-primary">提示：</h4>
              <p className="mt-1 text-sm">
                赎回后，您将获得等值于合成资产价值的抵押品，减去赎回费用。赎回不会立即降低您的抵押率，因为资产和债务同时减少。
              </p>
            </div>
          </div>
        </>
      )
    },
    
    // 收益与风险
    rewards: {
      title: '收益与风险',
      icon: <Landmark className="h-5 w-5 text-primary" />,
      content: (
        <>
          <p className="mb-3">
            通过铸造和交易合成资产，您可以获得不同类型的收益，但也需要了解相关风险。
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-md bg-muted p-3">
              <h4 className="font-medium">潜在收益：</h4>
              <ul className="mt-2 list-disc pl-5 text-sm">
                <li>通过资产价格上涨获得资本增值</li>
                <li>提供流动性获得交易费分享</li>
                <li>参与治理并获得代币奖励</li>
                <li>通过杠杆效应放大收益</li>
              </ul>
            </div>
            
            <div className="rounded-md bg-destructive/10 p-3">
              <h4 className="font-medium text-destructive">潜在风险：</h4>
              <ul className="mt-2 list-disc pl-5 text-sm">
                <li>资产价格波动导致的损失</li>
                <li>清算风险和清算罚金</li>
                <li>智能合约风险</li>
                <li>预言机故障或延迟风险</li>
                <li>市场流动性风险</li>
              </ul>
            </div>
          </div>
        </>
      )
    }
  }
  
  // 如果指定了特定主题则显示该主题内容，否则显示全部主题
  if (topic !== 'all' && helpTopics[topic as keyof typeof helpTopics]) {
    const selectedTopic = helpTopics[topic as keyof typeof helpTopics]
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {selectedTopic.icon}
          <h3 className="text-xl font-medium">{selectedTopic.title}</h3>
        </div>
        <div className="text-sm">{selectedTopic.content}</div>
      </div>
    )
  }
  
  // 显示所有主题摘要
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">合成资产帮助中心</h3>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(helpTopics).map(([key, topic]) => (
          <div 
            key={key} 
            className="rounded-lg border p-4 hover:border-primary/50 hover:bg-accent transition-colors"
          >
            <div className="mb-2 flex items-center gap-2">
              {topic.icon}
              <h4 className="font-medium">{topic.title}</h4>
            </div>
            <div className="text-sm text-muted-foreground">
              {Array.isArray(topic.content) 
                ? topic.content[0].props.children 
                : topic.content.props.children[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 