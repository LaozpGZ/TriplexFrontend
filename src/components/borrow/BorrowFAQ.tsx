'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface FAQ {
  id: string
  question: string
  answer: string
  tags: string[]
}

export default function BorrowFAQ() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const faqs: FAQ[] = [
    {
      id: 'faq-1',
      question: '什么是合成资产借贷？',
      answer: '合成资产借贷是一种DeFi服务，允许用户通过抵押加密资产获得合成资产贷款。合成资产是跟踪现实世界资产价格的代币，如股票、商品或法币。这使得用户可以在不实际持有这些资产的情况下获得价格敞口。',
      tags: ['基础', '合成资产']
    },
    {
      id: 'faq-2',
      question: '健康因子是什么？如何计算？',
      answer: '健康因子是衡量借贷头寸安全性的指标，计算公式为：(抵押品价值 × 清算阈值) / 借款价值。健康因子大于1表示您的头寸安全，低于1则会面临清算风险。健康因子越高，头寸越安全。例如，健康因子为2意味着您的抵押品价值可以下跌50%才会面临清算。',
      tags: ['风险', '清算']
    },
    {
      id: 'faq-3',
      question: '如何避免清算？',
      answer: '避免清算的方法包括：1) 保持较高的抵押率，建议至少200%；2) 定期监控健康因子，保持在1.5以上；3) 设置健康因子警报；4) 在市场波动时添加更多抵押品；5) 偿还部分贷款减少风险；6) 使用自动还款功能在健康因子下降到危险水平时自动还款。',
      tags: ['风险', '清算', '管理']
    },
    {
      id: 'faq-4',
      question: '什么是浮动利率和固定利率贷款？',
      answer: '浮动利率贷款的利率会根据市场供需关系波动，在市场低迷时可能提供较低利率，但缺乏稳定性。固定利率贷款则在整个贷款期限内保持相同的利率，提供更稳定的还款计划，但通常比当前浮动利率略高。如果您预期市场利率会上升，选择固定利率可能更有利。',
      tags: ['利率', '贷款条款']
    },
    {
      id: 'faq-5',
      question: '贷款期限如何影响我的借贷成本？',
      answer: '贷款期限会影响您的总借贷成本和风险。较长的贷款期限通常有较低的利率，但总利息成本可能更高。较短的期限可能有较高的利率，但总成本可能更低，同时提供更大的灵活性。选择期限时应考虑您的资金需求时长、市场预期和风险承受能力。',
      tags: ['利率', '贷款条款']
    },
    {
      id: 'faq-6',
      question: '什么是清算？清算过程如何进行？',
      answer: '清算是当借款人的健康因子低于1时，系统自动出售部分抵押品以偿还贷款的过程。清算通常分步进行：首先触发清算阈值，然后系统会通知清算人，清算人购买抵押品并支付债务，获得一定比例的清算奖励(通常为5-10%)。被清算用户需支付清算费用并失去部分抵押品，但保留剩余抵押品和已借出的资产。',
      tags: ['风险', '清算']
    },
    {
      id: 'faq-7',
      question: '我可以提前偿还贷款吗？有额外费用吗？',
      answer: '是的，您可以随时提前偿还贷款。对于浮动利率贷款，通常没有提前还款费用。对于固定利率贷款，可能会收取少量费用(通常为剩余贷款金额的0.5-2%)，具体取决于贷款期限和提前还款时间。提前还款可以减少总利息支出并降低风险。',
      tags: ['还款', '费用']
    },
    {
      id: 'faq-8',
      question: '借贷协议收取哪些费用？',
      answer: '借贷协议通常收取以下费用：1) 发起费：开设贷款时收取的一次性费用，通常为贷款金额的0-1%；2) 利息：基于借款金额、期限和利率的主要成本；3) 清算费：发生清算时的罚金，约为被清算抵押品的5-10%；4) 提前还款费：固定利率贷款可能收取；5) 链上交易费用：与网络拥堵程度相关。具体费用请查看当前费率表。',
      tags: ['费用']
    },
    {
      id: 'faq-9',
      question: '如何增加我的借贷额度？',
      answer: '增加借贷额度的方法包括：1) 添加更多抵押品，直接增加可借额度；2) 切换到更高价值的抵押品，如蓝筹代币；3) 使用具有更高抵押率的抵押品；4) 在同一协议内建立良好的信用历史；5) 利用跨协议借贷计划以获得更高额度。请注意，增加借贷额度也意味着增加风险，应谨慎评估自己的风险承受能力。',
      tags: ['借贷额度', '管理']
    },
    {
      id: 'faq-10',
      question: 'Triplex借贷与其他DeFi借贷协议有何不同？',
      answer: 'Triplex借贷与传统DeFi借贷的主要区别在于：1) 专注于合成资产借贷，允许用户获得更广泛的资产敞口；2) 创新的风险管理系统，提供更精确的健康因子计算和风险预警；3) 多层级清算保护机制；4) 灵活的贷款期限和利率选择；5) 自动化风险管理工具；6) 更高的资本效率和更低的抵押要求；7) 跨链兼容性，支持多个区块链网络。',
      tags: ['基础', 'Triplex']
    }
  ]
  
  // 过滤FAQ根据搜索查询
  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  // 对FAQ进行分组
  const basicFAQs = filteredFAQs.filter(faq => faq.tags.includes('基础'))
  const riskFAQs = filteredFAQs.filter(faq => faq.tags.includes('风险') || faq.tags.includes('清算'))
  const loanTermFAQs = filteredFAQs.filter(faq => faq.tags.includes('利率') || faq.tags.includes('贷款条款'))
  const otherFAQs = filteredFAQs.filter(faq => 
    !faq.tags.includes('基础') && 
    !faq.tags.includes('风险') && 
    !faq.tags.includes('清算') &&
    !faq.tags.includes('利率') && 
    !faq.tags.includes('贷款条款')
  )
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-2">常见问题解答</h2>
      <p className="text-muted-foreground mb-6">了解有关Triplex借贷功能的常见问题</p>
      
      {/* 搜索栏 */}
      <div className="relative mb-8">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="搜索常见问题..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredFAQs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">未找到与"{searchQuery}"相关的问题</p>
          <p className="text-sm mt-2">尝试使用不同的关键词或浏览下方的所有问题</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 基础问题 */}
          {basicFAQs.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">基础知识</h3>
              <Accordion type="single" collapsible className="border rounded-lg">
                {basicFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-accent/50">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-muted-foreground">{faq.answer}</p>
                      <div className="flex gap-2 mt-3">
                        {faq.tags.map((tag) => (
                          <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          
          {/* 风险管理问题 */}
          {riskFAQs.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">风险管理</h3>
              <Accordion type="single" collapsible className="border rounded-lg">
                {riskFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-accent/50">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-muted-foreground">{faq.answer}</p>
                      <div className="flex gap-2 mt-3">
                        {faq.tags.map((tag) => (
                          <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          
          {/* 贷款条款问题 */}
          {loanTermFAQs.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">贷款条款</h3>
              <Accordion type="single" collapsible className="border rounded-lg">
                {loanTermFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-accent/50">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-muted-foreground">{faq.answer}</p>
                      <div className="flex gap-2 mt-3">
                        {faq.tags.map((tag) => (
                          <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          
          {/* 其他问题 */}
          {otherFAQs.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">其他问题</h3>
              <Accordion type="single" collapsible className="border rounded-lg">
                {otherFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-accent/50">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-muted-foreground">{faq.answer}</p>
                      <div className="flex gap-2 mt-3">
                        {faq.tags.map((tag) => (
                          <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      )}
    </Card>
  )
} 