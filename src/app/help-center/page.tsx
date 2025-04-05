'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Wallet, 
  Shield, 
  Settings, 
  BarChart 
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FAQAccordion } from '@/components/docs/FAQAccordion'

// FAQ分类
const faqCategories = [
  {
    id: 'general',
    name: '基础知识',
    icon: <HelpCircle className="h-4 w-4" />,
    description: '基本使用和平台概念'
  },
  {
    id: 'wallet',
    name: '钱包',
    icon: <Wallet className="h-4 w-4" />,
    description: '钱包连接和管理问题'
  },
  {
    id: 'trading',
    name: '交易',
    icon: <BarChart className="h-4 w-4" />,
    description: '关于交易和头寸的信息'
  },
  {
    id: 'security',
    name: '安全',
    icon: <Shield className="h-4 w-4" />,
    description: '帐户和资金安全'
  },
  {
    id: 'technical',
    name: '技术问题',
    icon: <Settings className="h-4 w-4" />,
    description: '技术和故障排除'
  }
]

// FAQ问题列表
const faqItems = [
  {
    id: 'faq-1',
    question: '什么是Triplex？',
    answer: 'Triplex是一个去中心化合成资产交易平台，允许用户创建和交易与现实世界资产价格挂钩的代币，同时无需实际持有这些资产。它使用区块链技术提供透明、无需信任的交易环境。',
    category: 'general',
    tags: ['基础', '入门'],
    isPopular: true
  },
  {
    id: 'faq-2',
    question: '如何连接我的钱包？',
    answer: '要连接您的钱包，请点击页面右上角的"连接钱包"按钮。我们支持多种钱包，包括MetaMask、WalletConnect和Coinbase Wallet等。选择您的钱包类型并按照屏幕上的指示完成连接过程。',
    category: 'wallet',
    tags: ['钱包', '连接'],
    isPopular: true
  },
  {
    id: 'faq-3',
    question: '什么是合成资产？',
    answer: '合成资产是代表其他资产价值的衍生品代币。在Triplex上，这些代币反映了传统金融市场中资产的价格，如股票、商品或加密货币，但不需要实际持有这些资产。合成资产允许用户对这些资产的价格波动进行投机，而无需离开区块链生态系统。',
    category: 'general',
    tags: ['合成资产', '基础知识'],
    isPopular: true
  },
  {
    id: 'faq-4',
    question: '如何添加抵押品以避免清算？',
    answer: '要添加抵押品，请导航到"仪表板"页面，然后点击您的头寸详情视图中的"添加抵押品"按钮。选择您要添加的资产和数量，然后确认交易。确保您的抵押率保持在安全水平以上，以避免清算风险。',
    category: 'trading',
    tags: ['抵押品', '清算'],
    isPopular: false
  },
  {
    id: 'faq-5',
    question: '交易手续费是多少？',
    answer: 'Triplex收取0.1%的交易手续费。对于大宗交易者和长期用户，可能有额外的费用折扣。抵押品存款和取款不收取任何费用，但用户仍需支付网络燃气费。完整的费用明细可以在我们的文档中找到。',
    category: 'trading',
    tags: ['费用', '交易'],
    isPopular: true
  },
  {
    id: 'faq-6',
    question: '如果我忘记了钱包密码怎么办？',
    answer: 'Triplex无法帮助恢复您的钱包密码或助记词。这些信息由您的钱包提供商管理，不存储在我们的系统中。如果您忘记了密码，请参考钱包提供商的恢复流程。这就是为什么我们强烈建议您安全备份您的助记词和密码。',
    category: 'security',
    tags: ['钱包', '安全', '密码恢复'],
    isPopular: false
  },
  {
    id: 'faq-7',
    question: '平台支持哪些区块链网络？',
    answer: '目前，Triplex支持以太坊主网、Arbitrum、Optimism和Polygon网络。我们计划在未来扩展到更多的Layer 2解决方案和EVM兼容链，以提供更低的费用和更快的交易速度。',
    category: 'technical',
    tags: ['网络', '区块链'],
    isPopular: true
  },
  {
    id: 'faq-8',
    question: '如何设置止损单？',
    answer: '要设置止损单，请在创建新头寸时或通过编辑现有头寸使用风险管理选项。在交易表单中，找到"风险管理"部分并启用"止损"选项。然后输入您希望头寸自动关闭的价格水平。您还可以设置追踪止损，它会随着价格向有利方向移动而调整。',
    category: 'trading',
    tags: ['风险管理', '止损', '交易'],
    isPopular: false
  },
  {
    id: 'faq-9',
    question: 'Triplex是如何保证价格准确性的？',
    answer: 'Triplex使用去中心化预言机网络来获取资产价格，主要依赖Chainlink等可靠的预言机服务。我们使用多个数据源和中位数机制来确保价格准确且防操纵。此外，平台还实施了偏差检测算法，以识别和缓解潜在的价格异常。',
    category: 'technical',
    tags: ['预言机', '价格', '安全'],
    isPopular: false
  },
  {
    id: 'faq-10',
    question: '我可以使用哪些抵押品类型？',
    answer: 'Triplex目前接受以下资产作为抵押品：ETH、WBTC、USDC、USDT和DAI。不同类型的抵押品有不同的抵押因子，这会影响您可以铸造的合成资产数量。稳定币通常具有较高的抵押因子，而波动性较大的资产则较低。您可以在仪表板上查看每种资产的当前抵押因子。',
    category: 'trading',
    tags: ['抵押品', '资产'],
    isPopular: true
  }
]

export default function HelpCenterPage() {
  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">帮助中心</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          查找有关Triplex平台的常见问题和解答。如果您找不到所需的信息，请随时联系我们的支持团队。
        </p>
      </div>
      
      <Tabs defaultValue="faq">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="faq" className="flex-1">
            <HelpCircle className="h-4 w-4 mr-2" />
            常见问题
          </TabsTrigger>
          <TabsTrigger value="glossary" className="flex-1">
            <BookOpen className="h-4 w-4 mr-2" />
            术语表
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            使用指南
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq">
          <FAQAccordion 
            faqs={faqItems} 
            categories={faqCategories} 
          />
        </TabsContent>
        
        <TabsContent value="glossary">
          <p className="text-center py-12 text-text-secondary">
            术语表内容正在建设中...
          </p>
        </TabsContent>
        
        <TabsContent value="guides">
          <p className="text-center py-12 text-text-secondary">
            使用指南内容正在建设中...
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
} 