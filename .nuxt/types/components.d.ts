
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  AccountPopup: typeof import("../../app/components/AccountPopup.vue")['default']
  Footer: typeof import("../../app/components/Footer.vue")['default']
  Header: typeof import("../../app/components/Header.vue")['default']
  HeaderGraphs: typeof import("../../app/components/HeaderGraphs.vue")['default']
  HomeSection: typeof import("../../app/components/HomeSection.vue")['default']
  LoginComponentRegisterFlow: typeof import("../../app/components/LoginComponent/RegisterFlow.vue")['default']
  LoginComponentRegisterProgress: typeof import("../../app/components/LoginComponent/RegisterProgress.vue")['default']
  LoginComponentRegisterStepCountry: typeof import("../../app/components/LoginComponent/RegisterStepCountry.vue")['default']
  LoginComponentRegisterStepProfile: typeof import("../../app/components/LoginComponent/RegisterStepProfile.vue")['default']
  LoginComponentRegisterStepPurpose: typeof import("../../app/components/LoginComponent/RegisterStepPurpose.vue")['default']
  LoginComponentAuth: typeof import("../../app/components/LoginComponent/auth.vue")['default']
  OrderToast: typeof import("../../app/components/OrderToast.vue")['default']
  RefillBalancePopup: typeof import("../../app/components/RefillBalancePopup.vue")['default']
  Sidebar: typeof import("../../app/components/Sidebar.vue")['default']
  UserInformationComponentsBalanceCard: typeof import("../../app/components/UserInformationComponents/BalanceCard.vue")['default']
  UserInformationComponentsGoalTargetCard: typeof import("../../app/components/UserInformationComponents/GoalTargetCard.vue")['default']
  UserInformationComponentsLatestDealsCard: typeof import("../../app/components/UserInformationComponents/LatestDealsCard.vue")['default']
  UserInformationComponentsMyHoldingsCard: typeof import("../../app/components/UserInformationComponents/MyHoldingsCard.vue")['default']
  UserInformationComponentsTransactionTotalCard: typeof import("../../app/components/UserInformationComponents/TransactionTotalCard.vue")['default']
  UserInformationComponentsTransactionsCircleCard: typeof import("../../app/components/UserInformationComponents/TransactionsCircleCard.vue")['default']
  UserInformationComponentsTrendingStocksCard: typeof import("../../app/components/UserInformationComponents/TrendingStocksCard.vue")['default']
  WithdrawBalancePopup: typeof import("../../app/components/WithdrawBalancePopup.vue")['default']
  ChoicEofGraphicsComponentStocksHoverPreview: typeof import("../../app/components/choicEofGraphicsComponent/StocksHoverPreview.vue")['default']
  GraficComponentsAdvancedMarketChart: typeof import("../../app/components/graficComponents/AdvancedMarketChart.vue")['default']
  GraficComponentsBuyOrderForm: typeof import("../../app/components/graficComponents/BuyOrderForm.vue")['default']
  GraficComponentsMarketChartCard: typeof import("../../app/components/graficComponents/MarketChartCard.vue")['default']
  GraficComponentsMarketStatsBar: typeof import("../../app/components/graficComponents/MarketStatsBar.vue")['default']
  GraficComponentsOrderConfirmPopup: typeof import("../../app/components/graficComponents/OrderConfirmPopup.vue")['default']
  GraficComponentsOrdersBoard: typeof import("../../app/components/graficComponents/OrdersBoard.vue")['default']
  GraficComponentsSellOrderForm: typeof import("../../app/components/graficComponents/SellOrderForm.vue")['default']
  GraficComponentsStocksTickerTape: typeof import("../../app/components/graficComponents/StocksTickerTape.vue")['default']
  GraficComponentsTradeOrdersPanel: typeof import("../../app/components/graficComponents/TradeOrdersPanel.vue")['default']
  Test: typeof import("../../app/components/test.vue")['default']
  TestComponentsPortfolioBalans: typeof import("../../app/components/testComponents/PortfolioBalans.vue")['default']
  TestComponentsPortfolioHistory: typeof import("../../app/components/testComponents/PortfolioHistory.vue")['default']
  TestComponentsPortfolioOverview: typeof import("../../app/components/testComponents/PortfolioOverview.vue")['default']
  TestComponentsPortfolioSettings: typeof import("../../app/components/testComponents/PortfolioSettings.vue")['default']
  TestComponentsPortfolioTarget: typeof import("../../app/components/testComponents/PortfolioTarget.vue")['default']
  TestComponentsTradingSection: typeof import("../../app/components/testComponents/TradingSection.vue")['default']
  UseAdvancedMarketChart: typeof import("../../app/components/useAdvancedMarketChart")['default']
  UseMarketStats: typeof import("../../app/components/useMarketStats")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyAccountPopup: LazyComponent<typeof import("../../app/components/AccountPopup.vue")['default']>
  LazyFooter: LazyComponent<typeof import("../../app/components/Footer.vue")['default']>
  LazyHeader: LazyComponent<typeof import("../../app/components/Header.vue")['default']>
  LazyHeaderGraphs: LazyComponent<typeof import("../../app/components/HeaderGraphs.vue")['default']>
  LazyHomeSection: LazyComponent<typeof import("../../app/components/HomeSection.vue")['default']>
  LazyLoginComponentRegisterFlow: LazyComponent<typeof import("../../app/components/LoginComponent/RegisterFlow.vue")['default']>
  LazyLoginComponentRegisterProgress: LazyComponent<typeof import("../../app/components/LoginComponent/RegisterProgress.vue")['default']>
  LazyLoginComponentRegisterStepCountry: LazyComponent<typeof import("../../app/components/LoginComponent/RegisterStepCountry.vue")['default']>
  LazyLoginComponentRegisterStepProfile: LazyComponent<typeof import("../../app/components/LoginComponent/RegisterStepProfile.vue")['default']>
  LazyLoginComponentRegisterStepPurpose: LazyComponent<typeof import("../../app/components/LoginComponent/RegisterStepPurpose.vue")['default']>
  LazyLoginComponentAuth: LazyComponent<typeof import("../../app/components/LoginComponent/auth.vue")['default']>
  LazyOrderToast: LazyComponent<typeof import("../../app/components/OrderToast.vue")['default']>
  LazyRefillBalancePopup: LazyComponent<typeof import("../../app/components/RefillBalancePopup.vue")['default']>
  LazySidebar: LazyComponent<typeof import("../../app/components/Sidebar.vue")['default']>
  LazyUserInformationComponentsBalanceCard: LazyComponent<typeof import("../../app/components/UserInformationComponents/BalanceCard.vue")['default']>
  LazyUserInformationComponentsGoalTargetCard: LazyComponent<typeof import("../../app/components/UserInformationComponents/GoalTargetCard.vue")['default']>
  LazyUserInformationComponentsLatestDealsCard: LazyComponent<typeof import("../../app/components/UserInformationComponents/LatestDealsCard.vue")['default']>
  LazyUserInformationComponentsMyHoldingsCard: LazyComponent<typeof import("../../app/components/UserInformationComponents/MyHoldingsCard.vue")['default']>
  LazyUserInformationComponentsTransactionTotalCard: LazyComponent<typeof import("../../app/components/UserInformationComponents/TransactionTotalCard.vue")['default']>
  LazyUserInformationComponentsTransactionsCircleCard: LazyComponent<typeof import("../../app/components/UserInformationComponents/TransactionsCircleCard.vue")['default']>
  LazyUserInformationComponentsTrendingStocksCard: LazyComponent<typeof import("../../app/components/UserInformationComponents/TrendingStocksCard.vue")['default']>
  LazyWithdrawBalancePopup: LazyComponent<typeof import("../../app/components/WithdrawBalancePopup.vue")['default']>
  LazyChoicEofGraphicsComponentStocksHoverPreview: LazyComponent<typeof import("../../app/components/choicEofGraphicsComponent/StocksHoverPreview.vue")['default']>
  LazyGraficComponentsAdvancedMarketChart: LazyComponent<typeof import("../../app/components/graficComponents/AdvancedMarketChart.vue")['default']>
  LazyGraficComponentsBuyOrderForm: LazyComponent<typeof import("../../app/components/graficComponents/BuyOrderForm.vue")['default']>
  LazyGraficComponentsMarketChartCard: LazyComponent<typeof import("../../app/components/graficComponents/MarketChartCard.vue")['default']>
  LazyGraficComponentsMarketStatsBar: LazyComponent<typeof import("../../app/components/graficComponents/MarketStatsBar.vue")['default']>
  LazyGraficComponentsOrderConfirmPopup: LazyComponent<typeof import("../../app/components/graficComponents/OrderConfirmPopup.vue")['default']>
  LazyGraficComponentsOrdersBoard: LazyComponent<typeof import("../../app/components/graficComponents/OrdersBoard.vue")['default']>
  LazyGraficComponentsSellOrderForm: LazyComponent<typeof import("../../app/components/graficComponents/SellOrderForm.vue")['default']>
  LazyGraficComponentsStocksTickerTape: LazyComponent<typeof import("../../app/components/graficComponents/StocksTickerTape.vue")['default']>
  LazyGraficComponentsTradeOrdersPanel: LazyComponent<typeof import("../../app/components/graficComponents/TradeOrdersPanel.vue")['default']>
  LazyTest: LazyComponent<typeof import("../../app/components/test.vue")['default']>
  LazyTestComponentsPortfolioBalans: LazyComponent<typeof import("../../app/components/testComponents/PortfolioBalans.vue")['default']>
  LazyTestComponentsPortfolioHistory: LazyComponent<typeof import("../../app/components/testComponents/PortfolioHistory.vue")['default']>
  LazyTestComponentsPortfolioOverview: LazyComponent<typeof import("../../app/components/testComponents/PortfolioOverview.vue")['default']>
  LazyTestComponentsPortfolioSettings: LazyComponent<typeof import("../../app/components/testComponents/PortfolioSettings.vue")['default']>
  LazyTestComponentsPortfolioTarget: LazyComponent<typeof import("../../app/components/testComponents/PortfolioTarget.vue")['default']>
  LazyTestComponentsTradingSection: LazyComponent<typeof import("../../app/components/testComponents/TradingSection.vue")['default']>
  LazyUseAdvancedMarketChart: LazyComponent<typeof import("../../app/components/useAdvancedMarketChart")['default']>
  LazyUseMarketStats: LazyComponent<typeof import("../../app/components/useMarketStats")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
