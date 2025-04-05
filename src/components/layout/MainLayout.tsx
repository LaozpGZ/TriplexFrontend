"use client";

import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { WalletButton } from "@/components/wallet/WalletButton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="font-bold text-xl">
              Triplex
            </Link>
            <nav className="hidden md:flex ml-10 space-x-6">
              <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
                控制面板
              </Link>
              <Link href="/borrow" className="text-sm hover:text-primary transition-colors">
                借贷
              </Link>
              <Link href="/collateral" className="text-sm hover:text-primary transition-colors">
                抵押品管理
              </Link>
              <Link href="/synthetix" className="text-sm hover:text-primary transition-colors">
                合成资产
              </Link>
              <Link href="/mint-tpxusd" className="text-sm hover:text-primary transition-colors">
                铸造TpxUSD
              </Link>
              <Link href="/farm" className="text-sm hover:text-primary transition-colors">
                农场
              </Link>
              <Link href="/triplexliquiditymining" className="text-sm hover:text-primary transition-colors">
                流动性挖矿
              </Link>
              <Link href="/governance" className="text-sm hover:text-primary transition-colors">
                治理
              </Link>
              <Link href="/help-center" className="text-sm hover:text-primary transition-colors">
                帮助中心
              </Link>
              <Link
                href="/about"
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/about"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                关于我们
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <WalletButton />
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Triplex Protocol. All rights reserved.
        </div>
      </footer>
    </div>
  )
} 