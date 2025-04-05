'use client'

import { Card } from '@/components/ui/card'
import { AlertTriangle, Info, Shield, Zap } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function RiskManagementGuide() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">风险管理指南</h2>
      </div>
      
      <div className="mb-6">
        <p className="text-muted-foreground">了解借贷风险并学习如何保护您的资产安全。</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-3 p-4 border rounded-lg bg-amber-500/5 border-amber-500/20">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">清算风险提示</h3>
            <p className="text-sm text-muted-foreground">
              当您的健康因子低于 1.0 时，您的抵押品将面临清算风险。清算过程会收取额外的罚金，并可能导致您的部分抵押品被出售以偿还贷款。
            </p>
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="risks">
            <AccordionTrigger className="text-base font-medium">常见借贷风险</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pl-5 list-disc text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">清算风险</span>：当抵押品价值下跌或借款资产价值上涨导致健康因子低于清算阈值时，您的抵押品可能被清算。
                </li>
                <li>
                  <span className="font-medium text-foreground">利率风险</span>：浮动利率可能随市场条件变化，增加您的借款成本。
                </li>
                <li>
                  <span className="font-medium text-foreground">价格波动风险</span>：加密货币价格的高波动性可能导致抵押品价值迅速变化。
                </li>
                <li>
                  <span className="font-medium text-foreground">合约风险</span>：智能合约可能存在漏洞或被黑客攻击的风险。
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="tips">
            <AccordionTrigger className="text-base font-medium">风险管理建议</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pl-5 list-disc text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">保持健康因子高于 2.0</span>：给您的头寸足够的安全边际，防止市场波动导致清算。
                </li>
                <li>
                  <span className="font-medium text-foreground">多元化抵押品</span>：不要将所有鸡蛋放在一个篮子里，使用多种资产作为抵押可以降低单一资产价格波动的影响。
                </li>
                <li>
                  <span className="font-medium text-foreground">设置预警通知</span>：配置健康因子预警，当接近风险阈值时及时收到通知。
                </li>
                <li>
                  <span className="font-medium text-foreground">定期监控头寸</span>：市场变化迅速，定期检查您的借贷头寸状态。
                </li>
                <li>
                  <span className="font-medium text-foreground">使用风险模拟器</span>：评估市场价格变动对您头寸的潜在影响。
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="liquidation">
            <AccordionTrigger className="text-base font-medium">清算机制详解</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>清算是一种安全机制，确保借款人始终维持足够的抵押品来支持其借款。</p>
                
                <div className="pl-5 space-y-2">
                  <p className="font-medium text-foreground">清算过程：</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>当健康因子 &lt; 1.0 时，清算触发</li>
                    <li>清算机器人可以偿还部分或全部债务</li>
                    <li>作为回报，清算机器人以折扣价获得相应价值的抵押品</li>
                    <li>清算折扣通常为5-10%，作为清算机器人的奖励</li>
                    <li>借款人支付额外的清算费用，通常为1-2%</li>
                  </ol>
                </div>
                
                <p className="mt-2">
                  <span className="inline-flex items-center bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-xs font-medium">
                    <Info className="h-3 w-3 mr-1" /> 清算阈值 = 总抵押品价值 / 总借款价值 &lt; 最低抵押率
                  </span>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="health">
            <AccordionTrigger className="text-base font-medium">健康因子计算方法</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>健康因子是评估您借贷头寸健康状况的关键指标。</p>
                
                <div className="p-3 bg-secondary rounded-md">
                  <p className="font-mono text-center">健康因子 = (抵押品价值 × 清算阈值) ÷ 借款价值</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="p-2 border rounded-md">
                    <p className="font-medium text-foreground text-center text-sm">健康因子 &gt; 1.5</p>
                    <p className="text-center text-xs mt-1 text-green-500">安全</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <p className="font-medium text-foreground text-center text-sm">健康因子 1.2 - 1.5</p>
                    <p className="text-center text-xs mt-1 text-amber-500">注意</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <p className="font-medium text-foreground text-center text-sm">健康因子 1.0 - 1.2</p>
                    <p className="text-center text-xs mt-1 text-orange-500">警告</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <p className="font-medium text-foreground text-center text-sm">健康因子 &lt; 1.0</p>
                    <p className="text-center text-xs mt-1 text-red-500">清算</p>
                  </div>
                </div>
                
                <p className="text-xs mt-2">
                  <span className="font-medium text-foreground">示例：</span> 如果您抵押了价值$1000的ETH，借了$500的USDC，清算阈值为80%，则健康因子 = ($1000 × 0.8) ÷ $500 = 1.6
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="flex gap-3 p-4 border rounded-lg bg-primary/5">
          <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">安全建议</h3>
            <p className="text-sm text-muted-foreground">
              为了降低清算风险，我们建议将健康因子维持在1.8以上。在波动性较大的市场环境中，可能需要更高的安全边际。您可以通过增加抵押品或偿还部分贷款来提高健康因子。
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
} 