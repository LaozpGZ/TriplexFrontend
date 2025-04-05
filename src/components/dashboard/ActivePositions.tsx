'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  AlertTriangle,
  ShieldAlert
} from "lucide-react"
import { useState } from "react"

interface Position {
  id: string
  type: 'long' | 'short'
  asset: string
  symbol: string
  amount: string
  entryPrice: string
  currentPrice: string
  pnl: number
  pnlPercentage: number
  collateralAmount: string
  collateralSymbol: string
  healthFactor: number
  liquidationPrice: string
}

interface ActivePositionsProps {
  positions: Position[]
}

export function ActivePositions({ positions = [] }: ActivePositionsProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">活跃头寸</h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          新建头寸
        </Button>
      </div>
      
      {positions.length > 0 ? (
        <div className="space-y-4">
          {positions.map((position) => (
            <PositionItem key={position.id} position={position} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary">
          暂无活跃头寸
        </div>
      )}
    </Card>
  )
}

interface PositionItemProps {
  position: Position
}

function PositionItem({ position }: PositionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const toggleExpand = () => setIsExpanded(!isExpanded)
  
  const isRisky = position.healthFactor < 1.5
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div 
        className={`p-4 flex flex-wrap items-center gap-4 cursor-pointer ${isRisky ? 'bg-error/5' : ''}`}
        onClick={toggleExpand}
      >
        {/* 头寸基本信息 */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={`px-2 py-0.5 rounded text-xs font-medium ${position.type === 'long' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
              {position.type === 'long' ? '多头' : '空头'}
            </div>
            <div className="font-medium">{position.asset}</div>
            {isRisky && (
              <div className="text-error flex items-center gap-1 text-xs">
                <AlertTriangle className="h-3 w-3" />
                <span>清算风险</span>
              </div>
            )}
          </div>
          <div className="text-sm text-text-secondary mt-1">
            {position.amount} {position.symbol}
          </div>
        </div>
        
        {/* 盈亏信息 */}
        <div className="text-right">
          <div className={`font-medium ${position.pnl >= 0 ? 'text-success' : 'text-error'}`}>
            {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)} USD
          </div>
          <div className={`text-sm ${position.pnl >= 0 ? 'text-success' : 'text-error'}`}>
            {position.pnl >= 0 ? '+' : ''}{position.pnlPercentage.toFixed(2)}%
          </div>
        </div>
        
        {/* 展开/收起图标 */}
        <button className="p-1 hover:bg-card-foreground/5 rounded">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-text-secondary" />
          ) : (
            <ChevronDown className="h-5 w-5 text-text-secondary" />
          )}
        </button>
      </div>
      
      {/* 展开详情 */}
      {isExpanded && (
        <div className="p-4 bg-card-foreground/5 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm text-text-secondary">入场价格</div>
              <div className="font-medium">{position.entryPrice}</div>
            </div>
            <div>
              <div className="text-sm text-text-secondary">当前价格</div>
              <div className="font-medium">{position.currentPrice}</div>
            </div>
            <div>
              <div className="text-sm text-text-secondary">清算价格</div>
              <div className="font-medium">{position.liquidationPrice}</div>
            </div>
            <div>
              <div className="text-sm text-text-secondary">抵押品</div>
              <div className="font-medium">
                {position.collateralAmount} {position.collateralSymbol}
              </div>
            </div>
            <div>
              <div className="text-sm text-text-secondary">健康因子</div>
              <div className={`font-medium flex items-center ${
                position.healthFactor >= 2 ? 'text-success' : 
                position.healthFactor >= 1.5 ? 'text-warning' : 'text-error'
              }`}>
                <ShieldAlert className="h-4 w-4 mr-1" />
                {position.healthFactor.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              添加抵押品
            </Button>
            <Button variant="outline" size="sm">
              <Minus className="h-4 w-4 mr-1" />
              减少抵押品
            </Button>
            <Button variant="destructive" size="sm">
              关闭头寸
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 