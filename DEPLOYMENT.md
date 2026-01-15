# 部署指南

本文档介绍如何将 Todo 应用部署到 Cloudflare Pages 并绑定自定义域名。

## 前置要求

- GitHub 账号（用于代码托管）
- Cloudflare 账号（已有域名）
- Supabase 项目（已配置）

## 部署步骤

### 1. 推送代码到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 在 GitHub 创建新仓库后，执行：
git remote add origin https://github.com/你的用户名/todo-app.git
git branch -M main
git push -u origin main
```

### 2. 在 Cloudflare Pages 部署

#### 2.1 连接 GitHub

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create application** → **Pages**
3. 选择 **Connect to Git**
4. 授权 Cloudflare 访问你的 GitHub

#### 2.2 配置构建设置

在 **Import a project** 页面：

- **Repository**: 选择你的 `todo-app` 仓库
- **Project name**: `todo-app` (或自定义)
- **Production branch**: `main`
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

点击 **Save and Deploy**

### 3. 配置环境变量

在部署后页面，进入 **Settings** → **Environment variables**，添加：

```
VITE_SUPABASE_URL = 你的_supabase_project_url
VITE_SUPABASE_ANON_KEY = 你的_supabase_anon_key
```

然后点击 **Deployments** → **Retry deployment** 重新部署。

### 4. 绑定自定义域名

#### 4.1 在 Cloudflare Pages 添加域名

1. 在项目页面进入 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名（如 `todo.yourdomain.com` 或 `yourdomain.com`）
4. 点击 **Continue**

#### 4.2 配置 DNS 记录

Cloudflare 会自动为你添加 DNS 记录。如果需要手动添加：

进入 **DNS** → **Records** → **Add record**：

- **Type**: `CNAME`
- **Name**: `todo` (子域名) 或 `@` (根域名)
- **Target**: `你的项目.pages.dev`
- **Proxy status**: ✅ Proxied (橙色云朵)
- **TTL**: Auto

#### 4.3 配置 SSL/TLS

Cloudflare 会自动为你的域名签发 SSL 证书。在 **SSL/TLS** → **Overview**：

- 加密模式：选择 **Full (strict)** 或 **Full**

### 5. 验证部署

1. 等待几分钟让 DNS 生效
2. 访问你的域名：`https://todo.yourdomain.com`
3. 测试登录、创建 todo 等功能

## 其他部署选项

### Vercel (推荐备选)

如果你更喜欢使用 Vercel：

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 **New Project**
4. 选择你的 GitHub 仓库
5. 配置：
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. 在 Environment Variables 添加环境变量
7. 点击 **Deploy**

**绑定域名到 Vercel**：
1. 在项目 Settings → Domains 添加域名
2. 在 Cloudflare DNS 添加 CNAME 记录指向 `cname.vercel-dns.com`

### Netlify

1. 访问 [netlify.com](https://netlify.com)
2. 点击 **Add new site** → **Import an existing project**
3. 连接 GitHub 仓库
4. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 在 Site settings → Environment variables 添加环境变量
6. 在 Domain settings 添加自定义域名

## 常见问题

### 环境变量不生效？

确保：
1. 变量名以 `VITE_` 开头（Vite 要求）
2. 重新部署了项目
3. 没有拼写错误

### 路由 404 错误？

在 Cloudflare Pages：
1. 进入 **Settings** → **Single-page application**
2. 将 **Directory fallback** 设置为 `/index.html`

### Supabase CORS 错误？

在 Supabase Dashboard：
1. 进入 **Settings** → **API**
2. 在 **CORS allowed origins** 添加你的域名：
   - `https://yourdomain.com`
   - `https://todo.yourdomain.com`
   - `http://localhost:5173` (开发环境)

### 域名无法访问？

1. 检查 DNS 记录是否正确
2. 等待 DNS 传播（可能需要 5-60 分钟）
3. 清除浏览器缓存
4. 使用 `ping` 命令测试域名解析
5. 检查 Cloudflare SSL/TLS 设置

## 性能优化建议

### 1. 启用 Cloudflare 缓存

在 **Caching** → **Configuration**：
- Browser Cache TTL: 1 year
- Caching Level: Standard

### 2. 启用压缩

在 **Speed** → **Optimization**：
- 启用 Auto Minify (CSS, JS, HTML)
- 启用 Brotli 压缩

### 3. 配置构建优化

在 `vite.config.ts` 中已有：
- 代码分割
- Tree shaking
- Terser 压缩

## 安全建议

1. **环境变量保护**：
   - 永远不要在代码中硬编码密钥
   - 使用 `.env.local` 文件（本地开发）
   - 在部署平台配置生产环境变量

2. **Supabase RLS**：
   - 确保启用了 Row Level Security
   - 检查所有表的 RLS 策略

3. **Cloudflare 安全功能**：
   - 启用 Bot Fight Mode
   - 配置 Firewall Rules
   - 开启 Security Level (Medium/High)

## 监控和分析

1. **Cloudflare Analytics**：
   - 查看访问量、带宽使用
   - 监控性能指标

2. **Supabase Logs**：
   - Dashboard → Logs
   - 监控数据库查询和错误

3. **错误追踪**：
   - 考虑集成 Sentry 进行错误追踪

## 更新部署

每次推送到 `main` 分支时，Cloudflare Pages 会自动部署新版本。

如需手动触发部署：
1. 进入项目页面
2. 点击 **Deployments** → **Create deployment**
3. 选择分支和提交
4. 点击 **Save and Deploy**

## 成本估算

### Cloudflare Pages
- **免费版**：无限带宽，500 次构建/月
- **Pro 版**：$20/月，更多构建次数和高级功能

### Supabase
- **免费版**：500MB 数据库，1GB 存储，50,000 MAU
- **Pro 版**：$25/月，8GB 数据库，更多功能

对于个人项目和小型应用，免费版完全够用！

## 备份策略

1. **GitHub**：代码已备份
2. **Supabase**：
   - 定期导出数据库（Database → Backups）
   - 配置自动备份（Pro 版）
3. **Cloudflare**：
   - DNS 配置已自动保存
   - 考虑使用 Cloudflare 的 Terraform 集成进行基础设施即代码

## 需要帮助？

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Supabase 文档](https://supabase.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/build.html)
