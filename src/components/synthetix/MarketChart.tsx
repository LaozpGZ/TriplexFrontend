import { useState, useEffect } from 'react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Card } from '@/components/ui/card'

// 颜色常量
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

interface MarketChartProps {
  type: 'line' | 'bar' | 'pie'
  height?: number
  data?: any
  title?: string
  timeRange?: string
}

interface ChartDataItem {
  name: string
  value: number
}

export function MarketChart({ type = 'line', height = 300, data, title, timeRange = '24h' }: MarketChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[] | null>(null)
  
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
    let mockData: ChartDataItem[] = []
    
    if (chartType === 'line') {
      // 生成折线图数据
      const dataPoints = range === '24h' ? 24 : range === '7d' ? 7 : range === '30d' ? 30 : 60
      const values: number[] = []
      let baseValue = 14000000
      
      for (let i = 0; i < dataPoints; i++) {
        // 随机波动，但保持一定趋势 (增长)
        baseValue = baseValue * (1 + (Math.random() * 0.06 - 0.03))
        values.push(baseValue)
      }
      
      // 为Recharts转换数据格式
      mockData = Array.from({ length: dataPoints }, (_, i) => ({
        name: range === '24h' ? `${i}:00` : 
              range === '7d' ? `Day ${i+1}` : 
              range === '30d' ? `Day ${i+1}` : `Day ${i+1}`,
        value: values[i]
      }))
    } else if (chartType === 'bar') {
      // 生成柱状图数据
      const dataPoints = range === '24h' ? 12 : range === '7d' ? 7 : range === '30d' ? 10 : 12
      const values: number[] = []
      
      for (let i = 0; i < dataPoints; i++) {
        values.push(Math.floor(Math.random() * 900000) + 100000)
      }
      
      // 为Recharts转换数据格式
      mockData = Array.from({ length: dataPoints }, (_, i) => ({
        name: range === '24h' ? `${i*2}:00` : 
              range === '7d' ? `Day ${i+1}` : 
              range === '30d' ? `Day ${i*3+1}` : `Day ${i+1}`,
        value: values[i]
      }))
    } else if (chartType === 'pie') {
      // 生成饼图数据，直接使用Recharts支持的格式
      mockData = [
        { name: 'tpxBTC', value: 45 },
        { name: 'tpxETH', value: 25 },
        { name: 'tpxGOLD', value: 15 },
        { name: 'tpxSOL', value: 10 },
        { name: '其他', value: 5 }
      ]
    }
    
    setChartData(mockData)
  }
  
  // 渲染折线图
  const renderLineChart = () => {
    if (!chartData) return null
    
    // 格式化数字显示
    const formatYAxis = (value: number) => {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    
    // 格式化tooltip
    const formatTooltip = (value: number) => {
      return [`$${value.toLocaleString()}`]
    }
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} 
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <YAxis 
            tickFormatter={formatYAxis}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <Tooltip 
            formatter={formatTooltip}
            contentStyle={{ 
              backgroundColor: '#1E293B', 
              borderColor: 'rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: 'white'
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            activeDot={{ r: 6 }}
            strokeWidth={2} 
            dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }
  
  // 渲染柱状图
  const renderBarChart = () => {
    if (!chartData) return null
    
    // 格式化数字显示
    const formatYAxis = (value: number) => {
      return value >= 1000000 
        ? `$${(value / 1000000).toFixed(1)}M` 
        : `$${(value / 1000).toFixed(0)}K`
    }
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <YAxis 
            tickFormatter={formatYAxis}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toLocaleString()}`]}
            contentStyle={{ 
              backgroundColor: '#1E293B', 
              borderColor: 'rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: 'white'
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
          />
          <Bar 
            dataKey="value" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  
  // 渲染饼图
  const renderPieChart = () => {
    if (!chartData) return null
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}`, '数量']}
            contentStyle={{ 
              backgroundColor: '#1E293B', 
              borderColor: 'rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: 'white'
            }}
          />
          <Legend 
            verticalAlign="middle" 
            align="right" 
            layout="vertical"
            iconType="circle"
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    )
  }
  
  return (
    <div className="relative h-full w-full" style={{ height: `${height}px` }}>
      {title && (
        <div className="absolute left-0 top-0 text-sm text-muted-foreground p-2 z-10">
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