# TransitDashboard

```bash
npm install
npm run dev
```

访问地址：http://localhost:38409

## 项目类型标签

数据可视化大屏（纯前端）

TransitDashboard 是面向城市交通管理部门的实时监控可视化大屏，通过 Mock WebSocket 展示车辆位置、充电桩状态、路线运行和订单分析，并支持高德地图 API 集成。

## 环境变量

在项目根目录创建 `.env`，不要提交到 Git：

```bash
VITE_AMAP_KEY=your_amap_key_here
```

未配置 `VITE_AMAP_KEY` 时，系统会自动展示模拟地理网格，方便本地验证页面与数据流。

## 主要功能

- `/` 主屏：三栏大屏，展示车辆统计、充电桩状态、地图态势、订单趋势和收入卡片。
- `/vehicles` 车辆监控屏：车辆地图、车型筛选、状态分布、24 小时在线率趋势。
- `/charging` 充电桩监控屏：利用率仪表盘、排队趋势、故障告警、今日收入和收入趋势。
- `/routes` 路线监控屏：路线列表、站点地图、准点率仪表盘、速度/负载卡片和客流热力图。
- `/orders` 订单分析屏：实时订单流水、完成率仪表盘、订单类型分布、日/周/月趋势切换。

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Vue 3 + TypeScript + Composition API |
| 构建 | Vite |
| 状态 | Pinia |
| 路由 | Vue Router 4 |
| 图表 | ECharts 5 |
| 地图 | @amap/amap-jsapi-loader |
| 样式 | SCSS + CSS 变量 |
| HTTP | Axios 响应拦截器 |
| 实时数据 | 前端 Mock WebSocket |

## 项目目录结构

```text
src/
├── stores/
├── types/
├── constants/
├── components/
│   ├── charts/
│   └── common/
├── hooks/
├── pages/
├── mock/
├── router/
├── utils/
├── styles/
├── App.vue
└── main.ts
```

## 枚举定义与使用位置对照表

| 枚举 | 定义位置 | 使用位置 |
| --- | --- | --- |
| VehicleType | `src/constants/enums.ts` | `src/types/vehicle.d.ts`、`src/types/order.d.ts`、`src/mock/vehicleMock.ts`、`src/mock/orderMock.ts`、`src/mock/routeMock.ts`、`src/stores/vehicleStore.ts`、`src/components/charts/VehicleMap.vue`、`src/pages/MainScreen.vue`、`src/pages/VehicleMonitor.vue`、`src/pages/OrderAnalysis.vue` |
| VehicleStatus | `src/constants/enums.ts` | `src/types/vehicle.d.ts`、`src/mock/vehicleMock.ts`、`src/stores/vehicleStore.ts`、`src/pages/VehicleMonitor.vue` |
| PileType | `src/constants/enums.ts` | `src/types/charging.d.ts`、`src/mock/chargingMock.ts` |
| PileStatus | `src/constants/enums.ts` | `src/types/charging.d.ts`、`src/mock/chargingMock.ts`、`src/stores/chargingStore.ts`、`src/components/charts/ChargingStatusChart.vue`、`src/pages/VehicleMonitor.vue`、`src/pages/OrderAnalysis.vue` |

## 横切关注点

WebSocket 数据流：`src/mock/wsServer.ts` 在前端进程内模拟服务端推送；`src/hooks/useWebSocket.ts` 统一管理连接、断开、错误和重连；各实体 store 接收并分发数据，页面不直接操作原始 mock 数据。

大屏适配：以 1920x1080 为基准，`src/components/common/ScreenAdapter.vue` 和 `src/hooks/useAutoResize.ts` 维护缩放变量；ECharts 组件通过 `useChartTheme()` 监听窗口 resize。

高德地图集成：`src/components/common/MapContainer.vue` 通过 `@amap/amap-jsapi-loader` 读取 `import.meta.env.VITE_AMAP_KEY` 加载地图；缺少 Key 时使用模拟地理网格作为降级视图。

异常处理与审计：`src/utils/request.ts` 封装 Axios 响应拦截器；`src/utils/audit-log.ts` 记录 WebSocket 状态变更、告警确认和数据导出操作。

## 文件结构强制清单

```text
src/stores/vehicleStore.ts
src/stores/chargingStore.ts
src/stores/orderStore.ts
src/stores/routeStore.ts
src/types/vehicle.d.ts
src/types/charging.d.ts
src/types/order.d.ts
src/types/route.d.ts
src/constants/enums.ts
src/constants/chart-theme.ts
src/constants/map-config.ts
src/components/charts/VehicleMap.vue
src/components/charts/ChargingStatusChart.vue
src/components/charts/OrderTrendChart.vue
src/components/charts/PassengerHeatMap.vue
src/components/charts/SpeedGauge.vue
src/components/common/DataCard.vue
src/components/common/AlertBanner.vue
src/components/common/AnimatedNumber.vue
src/components/common/ScreenAdapter.vue
src/components/common/MapContainer.vue
src/hooks/useWebSocket.ts
src/hooks/useAutoResize.ts
src/hooks/useChartTheme.ts
src/pages/MainScreen.vue
src/pages/VehicleMonitor.vue
src/pages/ChargingMonitor.vue
src/pages/RouteMonitor.vue
src/pages/OrderAnalysis.vue
src/mock/vehicleMock.ts
src/mock/chargingMock.ts
src/mock/orderMock.ts
src/mock/routeMock.ts
src/mock/wsServer.ts
src/router/index.ts
src/utils/request.ts
src/utils/audit-log.ts
src/utils/format.ts
src/styles/global.scss
src/styles/variables.scss
src/App.vue
src/main.ts
```

## License

MIT
