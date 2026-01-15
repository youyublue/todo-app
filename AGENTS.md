# AGENTS.md

本文件用于指导在此仓库中工作的代理式编码助手。
请遵循其中的命令、风格与约定。

---

## 项目概览
- Vite + React + TypeScript 应用。
- Tailwind CSS 用于样式。
- 状态管理：Zustand。
- 后端：Supabase。
- 路由：React Router。

仓库根目录：`D:\todo-app`

---

## 命令（构建 / Lint / 测试）

### 安装
- `npm install`

### 开发
- `npm run dev`
  - 启动 Vite 开发服务器。

### 构建
- `npm run build`
  - 依次运行 `tsc -b` 和 `vite build`。
  - 输出目录为 `dist/`。

### 预览
- `npm run preview`
  - 预览生产构建结果。

### Lint
- `npm run lint`
  - 运行 ESLint（扁平化配置）。
  - 配置目标为 `**/*.{ts,tsx}`。

### 测试
- 未发现测试框架或 `test` 脚本。
- 不存在单测运行命令。
- 若未来添加测试，请在此补充测试框架与单测运行方式。

---

## 环境与密钥
- 仓库根目录存在 `.env`。
- 使用 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`。
- 未经明确要求不要提交密钥或 `.env` 变更。

---

## 工具与配置文件
- ESLint：`eslint.config.js`（扁平配置）。
- TypeScript：`tsconfig.json`、`tsconfig.app.json`、`tsconfig.node.json`。
- Vite：`vite.config.ts`。
- Tailwind：`tailwind.config.js`。
- PostCSS：`postcss.config.js`。
- 仓库根目录无 Prettier 配置。
- 仓库根目录无 `.editorconfig`。

Cursor / Copilot 规则：
- `.cursor/rules/`：未找到。
- `.cursorrules`：未找到。
- `.github/copilot-instructions.md`：未找到。

---

## TypeScript 与构建设置
- app 与 node 配置均为 `strict: true`。
- `noUnusedLocals: true` 与 `noUnusedParameters: true`。
- `noFallthroughCasesInSwitch: true`。
- `noUncheckedSideEffectImports: true`。
- 模块解析：`bundler`。
- `allowImportingTsExtensions: true`。
- `verbatimModuleSyntax: true`。
- JSX：`react-jsx`。

影响：
- 保持 import 必要且被使用，未使用的 import 会导致构建/lint 失败。
- 推断不明确时优先显式类型。
- 避免非必要的副作用 import。

---

## ESLint 规则（有效配置）
- 基础：`@eslint/js` 推荐配置。
- TypeScript：`typescript-eslint` 推荐配置。
- React Hooks：`eslint-plugin-react-hooks` 推荐配置。
- React Refresh：`eslint-plugin-react-refresh` Vite 配置。
- 忽略：`dist/`。

实用建议：
- 遵守 hooks 规则（依赖数组、禁止条件性调用）。
- 组件与 hooks 使用 TypeScript。

---

## 代码风格约定

### 通用
- 代码库中分号与引号风格混用。
- 编辑时遵循当前文件的既有风格。
- 变更尽量小且在文件内保持一致。

### 导入
- 通常顺序：外部库 → 本地模块 → 样式。
- 按已有惯例使用相对路径导入。
- Vite 别名 `@` 指向 `src`，但目前使用不多。

### 命名
- 组件：`PascalCase`（如 `TodoList`）。
- Hooks：`useX`（如 `useAuth`）。
- 函数/变量：`camelCase`。
- 类型/接口：`PascalCase`。

### React
- 使用函数组件与 hooks。
- 页面懒加载使用 `React.lazy` 与 `Suspense`。
- 错误处理使用 `src/components/ui/ErrorBoundary.tsx`。

### 样式
- 使用 Tailwind 工具类布局与视觉样式。
- 共享 UI 组件位于 `src/components/ui`。
- 使用 `src/lib/utils.ts` 中的 `cn` 合并类名。
- UI 组件优先使用 `class-variance-authority` 的模式。

### 目录结构
- `src/components/`：可复用组件。
- `src/pages/`：路由级页面。
- `src/hooks/`：自定义 hooks。
- `src/contexts/`：React Context。
- `src/lib/`：工具函数与客户端。
- `src/types/`：共享 TypeScript 类型。

---

## 错误处理模式
- UI 错误由 `ErrorBoundary` 捕获。
- 意外错误使用 `console.error` 记录（见 `ErrorBoundary`）。
- 优先显式错误状态，不要静默失败。

---

## 变更建议流程
1. 找到最接近的既有模式。
2. 匹配当前文件的格式与风格。
3. 除非要求，否则避免大规模重构。
4. 如需验证，运行 `npm run lint`。
5. 若未来新增测试框架，更新此文件。

---

## 给代理的注意事项
- 当前环境下此仓库不是 git 仓库。
- 若出现新的 `AGENTS.md`，需遵循其作用域。
- 不要杜撰不存在的命令或工具。

---

## 单测运行指南（占位）
当前未配置测试框架。
若未来引入测试，请补充：
- `npm run test` 的基础命令
- 单测文件运行命令
- 单测用例名称/正则运行命令
- Watch 模式命令

---

## 快速参考
- Dev：`npm run dev`
- Build：`npm run build`
- Lint：`npm run lint`
- Preview：`npm run preview`
- Env：`.env`（Supabase 配置）

---

## 已确认的文件引用
- `package.json`
- `eslint.config.js`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `tailwind.config.js`
- `postcss.config.js`
- `vite.config.ts`
- `src/main.tsx`
- `src/App.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/ErrorBoundary.tsx`
- `src/lib/utils.ts`
