'use client'

import { Card } from "@/components/ui/card"

interface Asset {
  name: string
  symbol: string
  value: number
  color: string
  percentage: number
}

interface AssetAllocationProps {
  assets: Asset[]
  totalValue: string
}

export function AssetAllocation({ 
  assets = [], 
  totalValue = "$0.00" 
}: AssetAllocationProps) {
  const calculateTotal = assets.reduce((acc, asset) => acc + asset.value, 0)
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-medium mb-4">资产配置</h3>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* 饼图 */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="relative w-48 h-48">
            {/* 创建简单的饼图 */}
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-inner flex relative">
              {assets.length > 0 ? (
                <>
                  {assets.map((asset, index) => {
                    // 计算各段的偏移角度
                    let rotation = 0
                    for (let i = 0; i < index; i++) {
                      rotation += (assets[i].percentage / 100) * 360
                    }
                    
                    return (
                      <div
                        key={asset.symbol}
                        className="absolute inset-0"
                        style={{
                          clipPath: `conic-gradient(from ${rotation}deg, ${asset.color} 0deg, ${asset.color} ${(asset.percentage / 100) * 360}deg, transparent ${(asset.percentage / 100) * 360}deg, transparent 360deg)`,
                          backgroundColor: asset.color
                        }}
                      />
                    )
                  })}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background w-32 h-32 rounded-full flex flex-col items-center justify-center">
                      <div className="text-sm text-text-secondary">总资产</div>
                      <div className="text-xl font-bold mt-1">{totalValue}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full rounded-full bg-card-foreground/5 flex items-center justify-center">
                  <span className="text-text-secondary">暂无资产</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 资产列表 */}
        <div className="w-full md:w-2/3">
          <div className="space-y-4">
            {assets.length > 0 ? (
              assets.map((asset) => (
                <AssetItem 
                  key={asset.symbol}
                  asset={asset}
                  total={calculateTotal}
                />
              ))
            ) : (
              <div className="text-center py-6 text-text-secondary">
                暂无资产数据
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

interface AssetItemProps {
  asset: Asset
  total: number
}

function AssetItem({ asset, total }: AssetItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div 
        className="w-3 h-3 rounded-full" 
        style={{ backgroundColor: asset.color }}
      />
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <div className="font-medium">
            {asset.name} <span className="text-text-secondary">({asset.symbol})</span>
          </div>
          <div className="font-medium">${asset.value.toLocaleString()}</div>
        </div>
        <div className="w-full bg-background rounded-full h-1.5">
          <div 
            className="h-1.5 rounded-full" 
            style={{ 
              width: `${asset.percentage}%`,
              backgroundColor: asset.color
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <div className="text-sm text-text-secondary">
            {asset.percentage.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  )
} 