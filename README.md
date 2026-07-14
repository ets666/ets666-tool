# ETS666 Tool

基于 Vue 3 + Vite + Electron + TypeScript 的桌面应用程序。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **桌面应用**: Electron 29
- **UI 框架**: Element Plus 2.6
- **路由**: Vue Router 4
- **状态管理**: Pinia 2
- **国际化**: Vue I18n 9
- **语言**: TypeScript 5.4

## 项目结构

\`\`\`
ets666-tool/
├── electron/              # Electron 相关文件
│   ├── main.ts            # 主进程
│   └── preload/           # 预加载脚本
│       └── index.ts
├── src/                   # 源代码
│   ├── i18n/              # 国际化
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en-US.ts
│   │       └── zh-CN.ts
│   ├── router/            # 路由配置
│   │   └── index.ts
│   ├── stores/            # Pinia 状态管理
│   │   └── index.ts
│   ├── styles/            # 全局样式
│   │   └── index.css
│   ├── views/             # 页面组件
│   │   ├── Home.vue
│   │   └── About.vue
│   ├── App.vue            # 根组件
│   ├── main.ts            # 应用入口
│   └── vite-env.d.ts      # 类型声明
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── tsconfig.node.json     # Node TypeScript 配置
├── vite.config.ts         # Vite 配置
└── electron-builder.json5 # Electron 打包配置
\`\`\`

## 开发指南

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 开发模式

\`\`\`bash
# 仅启动 Web 开发服务器
npm run dev

# 启动 Electron 开发环境
npm run electron:dev
\`\`\`

### 构建应用

\`\`\`bash
# 构建 Web 应用
npm run build

# 构建 Electron 应用
npm run electron:build
\`\`\`

## 功能特性

- ✅ Vue 3 Composition API
- ✅ TypeScript 支持
- ✅ Vue Router 路由管理
- ✅ Pinia 状态管理
- ✅ Element Plus UI 组件库
- ✅ Vue I18n 国际化（支持中英文切换）
- ✅ Electron 桌面应用
- ✅ Vite 快速构建
- ✅ 组件自动导入
- ✅ API 自动导入

## 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## License

MIT