# Triplex Protocol Frontend

基于 Next.js 和 shadcn/ui 构建的 Triplex Protocol 前端应用，支持多链钱包连接和跨链资产管理。

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **钱包支持**: 
  - Aptos
  - Ethereum
  - Solana
  - 跨链支持

## 快速开始

1. 安装依赖:
```bash
pnpm install
```

2. 启动开发服务器:
```bash
pnpm dev
```

3. 访问应用:
打开 [https://localhost:3088](https://localhost:3088)

## 项目结构

```
triplex-protocol-frontend/
├── src/
│   ├── app/          # Next.js 应用路由
│   ├── components/   # React 组件
│   └── styles/       # 全局样式
├── public/           # 静态资源
└── ...配置文件
```

## 相关项目

- [Triplex Protocol Contract](https://github.com/TriplexProtocol/TriplexContract) - Move 智能合约
- [Triplex Protocol Frontend](https://github.com/TriplexProtocol/TriplexFrontend) - 前端应用

## 开发

- 使用 `pnpm` 作为包管理器
- 支持 HTTPS 开发环境（用于安全的钱包连接）
- 完整的 TypeScript 支持
- 集成 ESLint 和 Prettier

## 许可证

MIT
