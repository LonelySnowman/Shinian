# 时念 (Sena)

AI-ready 纪念日与生活事件助手。V1 为完全离线应用，无后端、无登录、无云同步。

## 技术栈

- React Native (Expo SDK 57)
- TypeScript
- Expo Router
- NativeWind
- Zustand（UI 状态）
- React Hook Form + Zod
- MMKV（本地持久化，Web 降级为 localStorage）

## 当前进度（Phase 1 MVP）

- [x] Clean Architecture 目录结构
- [x] Core Domain（实体、值对象、Repository Ports）
- [x] MMKV Storage + Repository 实现
- [x] Anniversary CRUD / 归档 Use Cases
- [x] Countdown 计算
- [x] Expo Router 导航（Tabs + 详情/创建/编辑/归档）
- [x] 首页列表 + 创建/编辑/详情 UI
- [ ] 本地通知
- [ ] 日历同步
- [ ] Widget
- [ ] Live Activity

## 开发

```bash
npm install
npm start
```

## 架构

```
app/                  # Expo Router 路由层
src/
  core/               # 跨 Feature 领域内核
  features/           # 按功能垂直切分
  storage/            # MMKV 实现
  infrastructure/     # DI 容器
  shared/             # UI 组件
```

业务代码通过 Repository Port 访问数据，UI 通过 Use Case 修改状态，为后续 Supabase 云同步预留迁移路径。
