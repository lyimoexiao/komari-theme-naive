# Komari Theme Naive

**Vue 3 + Vite + UnoCSS + Naive UI** 的 Komari 主题

## 环境要求

- Node.js: `^20.19.0` 或 `>=22.12.0`
- pnpm: `^10.28.0`

## 开发环境

```bash
# 安装依赖
pnpm install

# 启动开发服务器（热重载）
pnpm dev

# 类型检查
pnpm type-check

# 代码检查
pnpm lint
```

## 构建

```bash
# 类型检查 + 生产构建
pnpm build

# 仅构建（无类型检查）
pnpm build-only

# 预览生产构建
pnpm preview
```

## 项目结构

```
src/
├── App.vue              # 根组件，定义布局结构
├── main.ts              # 应用入口
├── components/
│   ├── Provider.vue     # Naive UI 全局配置
│   ├── Header.vue       # 页面头部
│   ├── Footer.vue       # 页面底部
│   ├── LoginDialog.vue  # 登录对话框
│   ├── LoadingCover.vue # 加载遮罩
│   ├── NodeCard.vue     # 节点信息卡片
│   └── NodeGeneralCards.vue  # 节点概览卡片
├── router/
│   └── index.ts         # 路由配置
├── stores/
│   ├── app.ts           # 应用状态（主题、语言、用户）
│   └── nodes.ts         # 节点状态管理
├── styles/
│   └── main.scss        # 全局样式
├── types/
│   └── global.d.ts      # 全局类型声明
├── utils/
│   ├── api.ts           # REST API 客户端
│   ├── rpc.ts           # JSON-RPC 2.0 客户端
│   ├── init.ts          # 应用初始化管理
│   ├── osImageHelper.ts # 操作系统图标映射
│   └── regionHelper.ts  # 地区代码映射
└── views/
    └── HomeView.vue     # 首页视图
```

## 功能清单

### ✅ 已完成

- **首页**
  - 节点分组切换（自动记忆上次选择）
  - 节点搜索（支持名称、地区、系统、标签）
  - 响应式网格布局

- **主机卡片显示**
  - 国家/地区旗帜图标
  - 在线状态标签
  - 操作系统图标与架构
  - CPU 占用率（进度条 + 状态颜色）
  - 内存占用（百分比 + 已用/总量）
  - 硬盘占用（百分比 + 已用/总量）
  - 总流量（上传/下载）
  - 网络速率（上传/下载）
  - 运行时间

- **用户认证**
  - 用户名密码登录
  - 两步验证（2FA）支持
  - OAuth2 登录
  - 登录状态持久化

- **实时数据**
  - WebSocket 实时更新
  - POST 模式自动回落
  - 连接状态监控

### 🚧 进行中

- **I18N 国际化** (PR WANTED)
- **主机列表显示** - 表格视图模式

### 📋 计划中

- **主机详细信息**
  - CPU 历史图表
  - 内存历史图表
  - 网络流量历史图表

- **延迟图表**
  - Ping 延迟监控
  - 历史延迟趋势

## 配置

### UnoCSS 自定义字体

项目使用 `TCloud Number VF` 可变字体用于数字显示，字体文件位于 `public/fonts/`。

使用方式：

```html
<div class="font-tcloud-number">12345</div>
```

## 参考

- [Komari 项目](https://www.komari.wiki/)
- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [UnoCSS 官方文档](https://unocss.dev/)
- [Naive UI 官方文档](https://www.naiveui.com/)

## 部分引用

- [Komari Next](https://github.com/tonyliuzj/komari-next)

## 贡献

欢迎提交 Issue 和 Pull Request！

## License

[MIT](LICENSE)
