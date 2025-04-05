'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Bell, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { WalletButton } from '@/components/wallet/WalletButton'

interface NavItem {
  name: string
  path: string
  isExternal?: boolean
}

const navItems: NavItem[] = [
  { name: '首页', path: '/' },
  { name: '仪表盘', path: '/dashboard' },
  { name: '借贷', path: '/borrow' },
  { name: '抵押管理', path: '/collateral-management' },
  { name: '合成资产', path: '/synthetic-assets' },
  { name: '流动性挖矿', path: '/liquidity-mining' },
  { name: '治理', path: '/governance' },
  { name: '数据分析', path: '/analytics' },
  { name: '帮助中心', path: '/help-center' },
]

const userItems: NavItem[] = [
  { name: '个人中心', path: '/user-profile' },
  { name: '通知', path: '/notifications' },
  { name: '奖励中心', path: '/rewards-center' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <header className="border-b border-border py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
              T
            </div>
            <span>Triplex</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              target={item.isExternal ? '_blank' : undefined}
              rel={item.isExternal ? 'noopener noreferrer' : undefined}
              className="text-sm hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop User Links */}
        <div className="hidden lg:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                <span>用户</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {userItems.map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <Link href={item.path}>{item.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          <WalletButton />
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden flex items-center"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background pt-16">
            <div className="container mx-auto px-4">
              <button 
                className="absolute top-4 right-4"
                onClick={toggleMobileMenu}
                aria-label="关闭菜单"
              >
                <X size={24} />
              </button>

              <nav className="flex flex-col gap-4 mb-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={toggleMobileMenu}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    className="py-2 border-b border-border hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-4">
                <h3 className="font-medium">用户</h3>
                {userItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={toggleMobileMenu}
                    className="py-2 border-b border-border hover:text-primary transition-colors pl-4"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="mt-8">
                <WalletButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 