import Link from 'next/link'
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin,
  Github
} from 'lucide-react'

interface FooterLink {
  name: string
  href: string
  isExternal?: boolean
}

interface FooterLinkGroup {
  title: string
  links: FooterLink[]
}

const productLinks: FooterLink[] = [
  { name: '借贷', href: '/borrow' },
  { name: '抵押管理', href: '/collateral-management' },
  { name: '合成资产', href: '/synthetic-assets' },
  { name: '流动性挖矿', href: '/liquidity-mining' },
  { name: '治理', href: '/governance' },
  { name: '数据分析', href: '/analytics' },
]

const accountLinks: FooterLink[] = [
  { name: '个人中心', href: '/user-profile' },
  { name: '交易历史', href: '/transaction-history' },
  { name: '奖励中心', href: '/rewards-center' },
  { name: '安全中心', href: '/security-center' },
  { name: '邀请返佣', href: '/referral' },
]

const supportLinks: FooterLink[] = [
  { name: '帮助中心', href: '/help-center' },
  { name: '预言机数据', href: '/oracle-data' },
  { name: '开发文档', href: '/docs' },
  { name: '常见问题', href: '/help-center?tab=faq' },
]

const socialLinks = [
  { icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com', name: 'Twitter' },
  { icon: <Facebook className="h-5 w-5" />, href: 'https://facebook.com', name: 'Facebook' },
  { icon: <Instagram className="h-5 w-5" />, href: 'https://instagram.com', name: 'Instagram' },
  { icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com', name: 'LinkedIn' },
  { icon: <Github className="h-5 w-5" />, href: 'https://github.com', name: 'GitHub' },
]

const linkGroups: FooterLinkGroup[] = [
  { title: '产品', links: productLinks },
  { title: '账户', links: accountLinks },
  { title: '支持', links: supportLinks },
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="text-xl font-bold text-primary">Triplex</span>
            </div>
            
            <p className="text-text-secondary mb-6">
              去中心化合成资产协议，让任何人都能够参与全球市场。
            </p>
            
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-medium mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-text-secondary hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border pt-6 text-center text-sm text-text-secondary">
          <p>© {currentYear} Triplex Protocol. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  )
} 