'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FilterOption {
  value: string
  label: string
  group?: string
}

interface SearchFilterProps {
  onSearchChange: (value: string) => void
  onFiltersChange: (filters: string[]) => void
  filterOptions: FilterOption[]
  className?: string
  placeholder?: string
  debounceMs?: number
}

export default function SearchFilter({
  onSearchChange,
  onFiltersChange,
  filterOptions,
  className,
  placeholder = '搜索...',
  debounceMs = 300
}: SearchFilterProps) {
  const [searchInput, setSearchInput] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  
  // 分组选项
  const groupedOptions = filterOptions.reduce<Record<string, FilterOption[]>>((acc, option) => {
    const group = option.group || '默认'
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(option)
    return acc
  }, {})
  
  // 防抖搜索
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchInput)
    }, debounceMs)
    
    return () => clearTimeout(handler)
  }, [searchInput, onSearchChange, debounceMs])
  
  // 过滤器变更
  useEffect(() => {
    onFiltersChange(selectedFilters)
  }, [selectedFilters, onFiltersChange])
  
  // 切换过滤器
  const toggleFilter = (value: string) => {
    setSelectedFilters(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value) 
        : [...prev, value]
    )
  }
  
  // 清除所有过滤器
  const clearFilters = () => {
    setSelectedFilters([])
  }
  
  // 删除单个过滤器
  const removeFilter = (value: string) => {
    setSelectedFilters(prev => prev.filter(v => v !== value))
  }
  
  // 获取过滤器标签
  const getFilterLabel = (value: string) => {
    return filterOptions.find(option => option.value === value)?.label || value
  }
  
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
        {searchInput && (
          <button 
            onClick={() => setSearchInput('')}
            className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-10"
        onClick={() => setShowFilterMenu(!showFilterMenu)}
      >
        <Filter className="h-4 w-4 mr-2" />
        筛选
        {selectedFilters.length > 0 && (
          <Badge variant="secondary" className="ml-2 px-1 min-w-4 text-center">
            {selectedFilters.length}
          </Badge>
        )}
      </Button>
      
      {/* 简化版的筛选菜单 */}
      {showFilterMenu && (
        <div className="absolute top-[70px] right-[20px] z-50 bg-background border rounded-md shadow-md w-[250px] p-2">
          <div className="p-2">
            <h3 className="font-medium mb-2">选择筛选条件</h3>
            <div className="max-h-[300px] overflow-y-auto">
              {Object.entries(groupedOptions).map(([group, options]) => (
                <div key={group} className="mb-3">
                  <h4 className="text-xs text-muted-foreground mb-1">{group}</h4>
                  <div className="space-y-1">
                    {options.map((option) => {
                      const isSelected = selectedFilters.includes(option.value)
                      return (
                        <div 
                          key={option.value}
                          className={cn(
                            "flex items-center justify-between p-1.5 rounded cursor-pointer hover:bg-muted",
                            isSelected && "bg-muted"
                          )}
                          onClick={() => toggleFilter(option.value)}
                        >
                          <span className="text-sm">{option.label}</span>
                          {isSelected && <Check className="h-4 w-4" />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {selectedFilters.length > 0 && (
              <div className="border-t mt-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-sm"
                  onClick={() => {
                    clearFilters()
                    setShowFilterMenu(false)
                  }}
                >
                  清除全部筛选项
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 已选筛选器 */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 w-full">
          {selectedFilters.map(filter => (
            <Badge 
              key={filter} 
              variant="secondary"
              className="flex items-center h-6"
            >
              {getFilterLabel(filter)}
              <button 
                onClick={() => removeFilter(filter)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
} 