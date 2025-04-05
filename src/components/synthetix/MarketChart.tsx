import { useState, useEffect } from 'react'

interface MarketChartProps {
  type: 'line' | 'bar' | 'pie'
  height?: number
  data?: any
  title?: string
  timeRange?: string
}

export function MarketChart({ type = 'line', height = 300, data, title, timeRange = '24h' }: MarketChartProps) {
  const [chartData, setChartData] = useState<any>(null)
  
  useEffect(() => {
    // 如果有提供数据，使用提供的数据；否则生成模拟数据
    if (data) {
      setChartData(data)
      return
    }
    
    // 生成模拟数据
    generateMockData(type, timeRange)
  }, [type, data, timeRange])
  
  // 生成模拟数据
  const generateMockData = (chartType: string, range: string) => {
    let mockData: any = {}
    
    if (chartType === 'line') {
      // 生成折线图数据
      const dataPoints = range === '24h' ? 24 : range === '7d' ? 7 : range === '30d' ? 30 : 60
      const values = []
      let baseValue = 14000000
      
      for (let i = 0; i < dataPoints; i++) {
        // 随机波动，但保持一定趋势 (增长)
        baseValue = baseValue * (1 + (Math.random() * 0.06 - 0.03))
        values.push(baseValue)
      }
      
      mockData = {
        values,
        labels: Array.from({ length: dataPoints }, (_, i) => {
          if (range === '24h') return `${i}:00`
          if (range === '7d') return `Day ${i+1}`
          if (range === '30d') return `Day ${i+1}`
          return `Day ${i+1}`
        })
      }
    } else if (chartType === 'bar') {
      // 生成柱状图数据
      const dataPoints = range === '24h' ? 12 : range === '7d' ? 7 : range === '30d' ? 10 : 12
      const values = []
      
      for (let i = 0; i < dataPoints; i++) {
        values.push(Math.floor(Math.random() * 900000) + 100000)
      }
      
      mockData = {
        values,
        labels: Array.from({ length: dataPoints }, (_, i) => {
          if (range === '24h') return `${i*2}:00`
          if (range === '7d') return `Day ${i+1}`
          if (range === '30d') return `Day ${i*3+1}`
          return `Day ${i+1}`
        })
      }
    } else if (chartType === 'pie') {
      // 生成饼图数据
      mockData = {
        values: [45, 25, 15, 10, 5],
        labels: ['tpxBTC', 'tpxETH', 'tpxGOLD', 'tpxSOL', '其他']
      }
    }
    
    setChartData(mockData)
  }
  
  // 渲染折线图
  const renderLineChart = () => {
    if (!chartData) return null
    
    const { values, labels } = chartData
    const maxValue = Math.max(...values) * 1.05
    const minValue = Math.min(...values) * 0.95
    const range = maxValue - minValue
    
    // 生成路径点
    const points = values.map((value: number, index: number) => {
      const x = (index / (values.length - 1)) * 100
      const y = 100 - ((value - minValue) / range) * 100
      return `${x},${y}`
    }).join(' ')
    
    return (
      <div className="relative h-full w-full">
        {/* 背景网格 */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border-t border-l border-gray-200 dark:border-gray-800"></div>
          ))}
        </div>
        
        {/* 轴标签 */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-muted-foreground">
          {labels.filter((_, i) => i % Math.max(1, Math.floor(labels.length / 5)) === 0).map((label, i) => (
            <div key={i}>{label}</div>
          ))}
        </div>
        
        {/* 价格标签 */}
        <div className="absolute right-2 top-0 bottom-6 flex flex-col justify-between text-xs text-muted-foreground">
          <div>${Math.floor(maxValue).toLocaleString()}</div>
          <div>${Math.floor(minValue + range * 0.75).toLocaleString()}</div>
          <div>${Math.floor(minValue + range * 0.5).toLocaleString()}</div>
          <div>${Math.floor(minValue + range * 0.25).toLocaleString()}</div>
          <div>${Math.floor(minValue).toLocaleString()}</div>
        </div>
        
        {/* 折线图 */}
        <svg className="absolute inset-0 h-full w-full overflow-visible p-2" preserveAspectRatio="none" viewBox="0 0 100 100">
          {/* 填充区域 */}
          <path
            d={`M0,100 ${points} 100,100 Z`}
            fill="rgba(59, 130, 246, 0.1)"
            stroke="none"
          />
          {/* 线条 */}
          <polyline
            points={points}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 数据点 */}
          {values.map((value: number, index: number) => {
            const x = (index / (values.length - 1)) * 100
            const y = 100 - ((value - minValue) / range) * 100
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill="rgb(59, 130, 246)"
                stroke="white"
                strokeWidth="0.5"
              />
            )
          })}
        </svg>
      </div>
    )
  }
  
  // 渲染柱状图
  const renderBarChart = () => {
    if (!chartData) return null
    
    const { values, labels } = chartData
    const maxValue = Math.max(...values) * 1.1
    
    return (
      <div className="relative h-full w-full">
        {/* 背景网格 */}
        <div className="absolute inset-0 grid grid-cols-1 grid-rows-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-t border-gray-200 dark:border-gray-800"></div>
          ))}
        </div>
        
        {/* 柱状图 */}
        <div className="absolute inset-0 flex h-full items-end justify-around px-2 pb-6">
          {values.map((value: number, index: number) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-8 rounded-t-sm bg-primary transition-all duration-500"
                style={{ height: `${(value / maxValue) * 100}%` }}
              ></div>
              <div className="mt-2 text-xs text-muted-foreground">
                {labels[index]}
              </div>
            </div>
          ))}
        </div>
        
        {/* 价格标签 */}
        <div className="absolute right-2 top-0 bottom-6 flex flex-col justify-between text-xs text-muted-foreground">
          <div>${Math.floor(maxValue).toLocaleString()}</div>
          <div>${Math.floor(maxValue * 0.75).toLocaleString()}</div>
          <div>${Math.floor(maxValue * 0.5).toLocaleString()}</div>
          <div>${Math.floor(maxValue * 0.25).toLocaleString()}</div>
          <div>$0</div>
        </div>
      </div>
    )
  }
  
  // 渲染饼图
  const renderPieChart = () => {
    if (!chartData) return null
    
    const { values, labels } = chartData
    const total = values.reduce((sum: number, value: number) => sum + value, 0)
    
    // 计算饼图各部分
    let cumulativePercentage = 0
    const slices = values.map((value: number, index: number) => {
      const percentage = (value / total) * 100
      const startAngle = cumulativePercentage * 3.6 // 转换为角度
      cumulativePercentage += percentage
      const endAngle = cumulativePercentage * 3.6
      
      // 计算SVG路径
      const startX = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180))
      const startY = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180))
      const endX = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180))
      const endY = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180))
      
      const largeArcFlag = percentage > 50 ? 1 : 0
      
      // 饼图颜色
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      
      return {
        path: `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
        color: colors[index % colors.length],
        label: labels[index],
        percentage
      }
    })
    
    return (
      <div className="relative h-full w-full">
        {/* 饼图 */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
          {slices.map((slice, index) => (
            <path
              key={index}
              d={slice.path}
              fill={slice.color}
              stroke="white"
              strokeWidth="1"
            />
          ))}
        </svg>
        
        {/* 图例 */}
        <div className="absolute inset-y-0 right-0 w-1/3 flex flex-col justify-center space-y-2 text-xs">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: slice.color }}
              ></div>
              <span className="ml-2">
                {slice.label} ({slice.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative h-full w-full" style={{ height: `${height}px` }}>
      {title && (
        <div className="absolute left-0 top-0 text-sm text-muted-foreground p-2">
          {title}
        </div>
      )}
      
      {!chartData ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : type === 'line' ? (
        renderLineChart()
      ) : type === 'bar' ? (
        renderBarChart()
      ) : (
        renderPieChart()
      )}
    </div>
  )
} 