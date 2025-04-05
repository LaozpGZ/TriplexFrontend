'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ThumbsUp, 
  ThumbsDown,
  MessageSquare,
  BookOpen,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

// FAQ问题类型
interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  isPopular?: boolean
}

// FAQ分类
interface FAQCategory {
  id: string
  name: string
  description?: string
  icon?: React.ReactNode
}

interface FAQAccordionProps {
  faqs: FAQItem[]
  categories: FAQCategory[]
  className?: string
}

export function FAQAccordion({
  faqs = [],
  categories = [],
  className
}: FAQAccordionProps) {
  // 状态
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [helpfulFaqs, setHelpfulFaqs] = useState<Set<string>>(new Set())
  const [unhelpfulFaqs, setUnhelpfulFaqs] = useState<Set<string>>(new Set())
  
  // 加载保存的反馈
  useEffect(() => {
    try {
      const savedHelpful = localStorage.getItem('helpfulFaqs')
      const savedUnhelpful = localStorage.getItem('unhelpfulFaqs')
      
      if (savedHelpful) {
        setHelpfulFaqs(new Set(JSON.parse(savedHelpful)))
      }
      
      if (savedUnhelpful) {
        setUnhelpfulFaqs(new Set(JSON.parse(savedUnhelpful)))
      }
    } catch (error) {
      console.error('加载FAQ反馈数据失败:', error)
    }
  }, [])
  
  // 切换FAQ展开状态
  const toggleFaq = (faqId: string) => {
    const newExpanded = new Set(expandedFaqs)
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId)
    } else {
      newExpanded.add(faqId)
    }
    setExpandedFaqs(newExpanded)
  }
  
  // 标记FAQ有帮助
  const markHelpful = (faqId: string) => {
    const newHelpful = new Set(helpfulFaqs)
    const newUnhelpful = new Set(unhelpfulFaqs)
    
    // 如果之前标记为无帮助，则移除
    if (newUnhelpful.has(faqId)) {
      newUnhelpful.delete(faqId)
    }
    
    // 添加或移除有帮助标记
    if (newHelpful.has(faqId)) {
      newHelpful.delete(faqId)
    } else {
      newHelpful.add(faqId)
    }
    
    setHelpfulFaqs(newHelpful)
    setUnhelpfulFaqs(newUnhelpful)
    
    // 保存到本地存储
    localStorage.setItem('helpfulFaqs', JSON.stringify(Array.from(newHelpful)))
    localStorage.setItem('unhelpfulFaqs', JSON.stringify(Array.from(newUnhelpful)))
  }
  
  // 标记FAQ无帮助
  const markUnhelpful = (faqId: string) => {
    const newHelpful = new Set(helpfulFaqs)
    const newUnhelpful = new Set(unhelpfulFaqs)
    
    // 如果之前标记为有帮助，则移除
    if (newHelpful.has(faqId)) {
      newHelpful.delete(faqId)
    }
    
    // 添加或移除无帮助标记
    if (newUnhelpful.has(faqId)) {
      newUnhelpful.delete(faqId)
    } else {
      newUnhelpful.add(faqId)
    }
    
    setHelpfulFaqs(newHelpful)
    setUnhelpfulFaqs(newUnhelpful)
    
    // 保存到本地存储
    localStorage.setItem('helpfulFaqs', JSON.stringify(Array.from(newHelpful)))
    localStorage.setItem('unhelpfulFaqs', JSON.stringify(Array.from(newUnhelpful)))
  }
  
  // 过滤FAQ
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      // 搜索过滤
      const matchesSearch = searchQuery === '' || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      // 分类过滤
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [faqs, searchQuery, selectedCategory])
  
  // 热门问题
  const popularFaqs = useMemo(() => {
    return faqs.filter(faq => faq.isPopular)
  }, [faqs])
  
  // 获取类别图标
  const getCategoryIcon = (categoryId: string): React.ReactNode => {
    const category = categories.find(c => c.id === categoryId)
    return category?.icon || <HelpCircle className="h-5 w-5" />
  }
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          常见问题解答 (FAQ)
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="搜索常见问题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              所有分类
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center"
              >
                {category.icon && <span className="mr-1">{category.icon}</span>}
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="all" className="flex-1">所有问题</TabsTrigger>
            <TabsTrigger value="popular" className="flex-1">热门问题</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                没有找到匹配的问题
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map(faq => (
                  <div key={faq.id} className="border border-border rounded-md overflow-hidden">
                    <div 
                      className={cn(
                        "flex items-center justify-between p-4 cursor-pointer transition-colors",
                        expandedFaqs.has(faq.id) 
                          ? "bg-background-card border-b border-border" 
                          : "hover:bg-background-card/50"
                      )}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <div className="flex items-center">
                        <div className="font-medium">{faq.question}</div>
                        {faq.isPopular && (
                          <Badge className="ml-2 bg-primary/20">热门</Badge>
                        )}
                      </div>
                      <ChevronDown className={cn(
                        "h-5 w-5 text-text-secondary transition-transform",
                        expandedFaqs.has(faq.id) && "transform rotate-180"
                      )} />
                    </div>
                    
                    {expandedFaqs.has(faq.id) && (
                      <div className="p-4 bg-background-card">
                        <div className="prose prose-sm dark:prose-invert">
                          <div className="whitespace-pre-line">{faq.answer}</div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <div className="flex flex-wrap gap-2">
                            {faq.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="bg-background-input">
                                {tag}
                              </Badge>
                            ))}
                            <Badge variant="outline" className="bg-background-input flex items-center">
                              {getCategoryIcon(faq.category)}
                              <span className="ml-1">
                                {categories.find(c => c.id === faq.category)?.name || faq.category}
                              </span>
                            </Badge>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="text-sm text-text-secondary mr-2">这是否有帮助？</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-8 w-8", 
                                helpfulFaqs.has(faq.id) ? "text-success" : "text-text-secondary"
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                markHelpful(faq.id)
                              }}
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-8 w-8", 
                                unhelpfulFaqs.has(faq.id) ? "text-danger" : "text-text-secondary"
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                markUnhelpful(faq.id)
                              }}
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="popular">
            {popularFaqs.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                没有热门问题
              </div>
            ) : (
              <div className="space-y-4">
                {popularFaqs.map(faq => (
                  <div key={faq.id} className="border border-border rounded-md overflow-hidden">
                    <div 
                      className={cn(
                        "flex items-center justify-between p-4 cursor-pointer transition-colors",
                        expandedFaqs.has(faq.id) 
                          ? "bg-background-card border-b border-border" 
                          : "hover:bg-background-card/50"
                      )}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <div className="flex items-center">
                        <div className="font-medium">{faq.question}</div>
                        <Badge className="ml-2 bg-primary/20">热门</Badge>
                      </div>
                      <ChevronDown className={cn(
                        "h-5 w-5 text-text-secondary transition-transform",
                        expandedFaqs.has(faq.id) && "transform rotate-180"
                      )} />
                    </div>
                    
                    {expandedFaqs.has(faq.id) && (
                      <div className="p-4 bg-background-card">
                        <div className="prose prose-sm dark:prose-invert">
                          <div className="whitespace-pre-line">{faq.answer}</div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <div className="flex flex-wrap gap-2">
                            {faq.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="bg-background-input">
                                {tag}
                              </Badge>
                            ))}
                            <Badge variant="outline" className="bg-background-input flex items-center">
                              {getCategoryIcon(faq.category)}
                              <span className="ml-1">
                                {categories.find(c => c.id === faq.category)?.name || faq.category}
                              </span>
                            </Badge>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="text-sm text-text-secondary mr-2">这是否有帮助？</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-8 w-8", 
                                helpfulFaqs.has(faq.id) ? "text-success" : "text-text-secondary"
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                markHelpful(faq.id)
                              }}
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-8 w-8", 
                                unhelpfulFaqs.has(faq.id) ? "text-danger" : "text-text-secondary"
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                markUnhelpful(faq.id)
                              }}
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 p-4 bg-background-card rounded-md border border-border">
          <div className="flex items-start">
            <BookOpen className="h-5 w-5 mr-3 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium">没有找到您需要的答案？</h3>
              <p className="text-sm text-text-secondary mt-1">
                访问我们的文档中心获取更详细的指南和教程。
              </p>
              <Button className="mt-3" variant="outline" size="sm">
                浏览文档中心
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 