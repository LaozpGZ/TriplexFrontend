# Vercel 部署指南

本项目已经配置为可以直接在 Vercel 上部署。以下是部署步骤：

## 步骤一：准备项目

1. 项目已经通过 `pnpm build` 成功构建
2. 静态文件已生成到 `out` 目录
3. 已添加 `vercel.json` 配置文件用于路由处理

## 步骤二：连接 GitHub 仓库到 Vercel

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project" 按钮
3. 导入你的 GitHub 仓库
4. 选择本项目

## 步骤三：配置部署设置

1. **构建命令**：无需设置，因为我们已经在本地构建了项目
2. **输出目录**：设置为 `out`
3. **框架预设**：选择 `Other`

## 步骤四：环境变量

如果你的项目需要环境变量，请在 Vercel 部署设置中添加。

## 步骤五：部署

点击 "Deploy" 按钮开始部署。

## 部署成功后

一旦部署成功，Vercel 会提供一个域名用于访问你的应用。你也可以配置自定义域名。

## 注意事项

- 项目使用了静态导出 (`output: "export"`)，所以不支持 Next.js 的服务端功能
- 如需更新应用，重新构建并推送到 GitHub，Vercel 会自动重新部署
- 对于 API 路由或服务端渲染，需要修改 `next.config.mjs` 中的 `output` 配置
