
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


export const AccountPopup: typeof import("../app/components/AccountPopup.vue")['default']
export const Footer: typeof import("../app/components/Footer.vue")['default']
export const Header: typeof import("../app/components/Header.vue")['default']
export const HeaderGraphs: typeof import("../app/components/HeaderGraphs.vue")['default']
export const HomeSection: typeof import("../app/components/HomeSection.vue")['default']
export const LoginComponentRegisterFlow: typeof import("../app/components/LoginComponent/RegisterFlow.vue")['default']
export const LoginComponentRegisterProgress: typeof import("../app/components/LoginComponent/RegisterProgress.vue")['default']
export const LoginComponentRegisterStepCountry: typeof import("../app/components/LoginComponent/RegisterStepCountry.vue")['default']
export const LoginComponentRegisterStepProfile: typeof import("../app/components/LoginComponent/RegisterStepProfile.vue")['default']
export const LoginComponentRegisterStepPurpose: typeof import("../app/components/LoginComponent/RegisterStepPurpose.vue")['default']
export const LoginComponentAuth: typeof import("../app/components/LoginComponent/auth.vue")['default']
export const OrderToast: typeof import("../app/components/OrderToast.vue")['default']
export const RefillBalancePopup: typeof import("../app/components/RefillBalancePopup.vue")['default']
export const Sidebar: typeof import("../app/components/Sidebar.vue")['default']
export const UserInformationComponentsBalanceCard: typeof import("../app/components/UserInformationComponents/BalanceCard.vue")['default']
export const UserInformationComponentsGoalTargetCard: typeof import("../app/components/UserInformationComponents/GoalTargetCard.vue")['default']
export const UserInformationComponentsLatestDealsCard: typeof import("../app/components/UserInformationComponents/LatestDealsCard.vue")['default']
export const UserInformationComponentsMyHoldingsCard: typeof import("../app/components/UserInformationComponents/MyHoldingsCard.vue")['default']
export const UserInformationComponentsTransactionTotalCard: typeof import("../app/components/UserInformationComponents/TransactionTotalCard.vue")['default']
export const UserInformationComponentsTransactionsCircleCard: typeof import("../app/components/UserInformationComponents/TransactionsCircleCard.vue")['default']
export const UserInformationComponentsTrendingStocksCard: typeof import("../app/components/UserInformationComponents/TrendingStocksCard.vue")['default']
export const WithdrawBalancePopup: typeof import("../app/components/WithdrawBalancePopup.vue")['default']
export const ChoicEofGraphicsComponentStocksHoverPreview: typeof import("../app/components/choicEofGraphicsComponent/StocksHoverPreview.vue")['default']
export const GraficComponentsAdvancedMarketChart: typeof import("../app/components/graficComponents/AdvancedMarketChart.vue")['default']
export const GraficComponentsBuyOrderForm: typeof import("../app/components/graficComponents/BuyOrderForm.vue")['default']
export const GraficComponentsMarketChartCard: typeof import("../app/components/graficComponents/MarketChartCard.vue")['default']
export const GraficComponentsMarketStatsBar: typeof import("../app/components/graficComponents/MarketStatsBar.vue")['default']
export const GraficComponentsOrderConfirmPopup: typeof import("../app/components/graficComponents/OrderConfirmPopup.vue")['default']
export const GraficComponentsOrdersBoard: typeof import("../app/components/graficComponents/OrdersBoard.vue")['default']
export const GraficComponentsSellOrderForm: typeof import("../app/components/graficComponents/SellOrderForm.vue")['default']
export const GraficComponentsStocksTickerTape: typeof import("../app/components/graficComponents/StocksTickerTape.vue")['default']
export const GraficComponentsTradeOrdersPanel: typeof import("../app/components/graficComponents/TradeOrdersPanel.vue")['default']
export const Test: typeof import("../app/components/test.vue")['default']
export const TestComponentsPortfolioBalans: typeof import("../app/components/testComponents/PortfolioBalans.vue")['default']
export const TestComponentsPortfolioHistory: typeof import("../app/components/testComponents/PortfolioHistory.vue")['default']
export const TestComponentsPortfolioOverview: typeof import("../app/components/testComponents/PortfolioOverview.vue")['default']
export const TestComponentsPortfolioSettings: typeof import("../app/components/testComponents/PortfolioSettings.vue")['default']
export const TestComponentsPortfolioTarget: typeof import("../app/components/testComponents/PortfolioTarget.vue")['default']
export const TestComponentsTradingSection: typeof import("../app/components/testComponents/TradingSection.vue")['default']
export const UseAdvancedMarketChart: typeof import("../app/components/useAdvancedMarketChart")['default']
export const UseMarketStats: typeof import("../app/components/useMarketStats")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAccountPopup: LazyComponent<typeof import("../app/components/AccountPopup.vue")['default']>
export const LazyFooter: LazyComponent<typeof import("../app/components/Footer.vue")['default']>
export const LazyHeader: LazyComponent<typeof import("../app/components/Header.vue")['default']>
export const LazyHeaderGraphs: LazyComponent<typeof import("../app/components/HeaderGraphs.vue")['default']>
export const LazyHomeSection: LazyComponent<typeof import("../app/components/HomeSection.vue")['default']>
export const LazyLoginComponentRegisterFlow: LazyComponent<typeof import("../app/components/LoginComponent/RegisterFlow.vue")['default']>
export const LazyLoginComponentRegisterProgress: LazyComponent<typeof import("../app/components/LoginComponent/RegisterProgress.vue")['default']>
export const LazyLoginComponentRegisterStepCountry: LazyComponent<typeof import("../app/components/LoginComponent/RegisterStepCountry.vue")['default']>
export const LazyLoginComponentRegisterStepProfile: LazyComponent<typeof import("../app/components/LoginComponent/RegisterStepProfile.vue")['default']>
export const LazyLoginComponentRegisterStepPurpose: LazyComponent<typeof import("../app/components/LoginComponent/RegisterStepPurpose.vue")['default']>
export const LazyLoginComponentAuth: LazyComponent<typeof import("../app/components/LoginComponent/auth.vue")['default']>
export const LazyOrderToast: LazyComponent<typeof import("../app/components/OrderToast.vue")['default']>
export const LazyRefillBalancePopup: LazyComponent<typeof import("../app/components/RefillBalancePopup.vue")['default']>
export const LazySidebar: LazyComponent<typeof import("../app/components/Sidebar.vue")['default']>
export const LazyUserInformationComponentsBalanceCard: LazyComponent<typeof import("../app/components/UserInformationComponents/BalanceCard.vue")['default']>
export const LazyUserInformationComponentsGoalTargetCard: LazyComponent<typeof import("../app/components/UserInformationComponents/GoalTargetCard.vue")['default']>
export const LazyUserInformationComponentsLatestDealsCard: LazyComponent<typeof import("../app/components/UserInformationComponents/LatestDealsCard.vue")['default']>
export const LazyUserInformationComponentsMyHoldingsCard: LazyComponent<typeof import("../app/components/UserInformationComponents/MyHoldingsCard.vue")['default']>
export const LazyUserInformationComponentsTransactionTotalCard: LazyComponent<typeof import("../app/components/UserInformationComponents/TransactionTotalCard.vue")['default']>
export const LazyUserInformationComponentsTransactionsCircleCard: LazyComponent<typeof import("../app/components/UserInformationComponents/TransactionsCircleCard.vue")['default']>
export const LazyUserInformationComponentsTrendingStocksCard: LazyComponent<typeof import("../app/components/UserInformationComponents/TrendingStocksCard.vue")['default']>
export const LazyWithdrawBalancePopup: LazyComponent<typeof import("../app/components/WithdrawBalancePopup.vue")['default']>
export const LazyChoicEofGraphicsComponentStocksHoverPreview: LazyComponent<typeof import("../app/components/choicEofGraphicsComponent/StocksHoverPreview.vue")['default']>
export const LazyGraficComponentsAdvancedMarketChart: LazyComponent<typeof import("../app/components/graficComponents/AdvancedMarketChart.vue")['default']>
export const LazyGraficComponentsBuyOrderForm: LazyComponent<typeof import("../app/components/graficComponents/BuyOrderForm.vue")['default']>
export const LazyGraficComponentsMarketChartCard: LazyComponent<typeof import("../app/components/graficComponents/MarketChartCard.vue")['default']>
export const LazyGraficComponentsMarketStatsBar: LazyComponent<typeof import("../app/components/graficComponents/MarketStatsBar.vue")['default']>
export const LazyGraficComponentsOrderConfirmPopup: LazyComponent<typeof import("../app/components/graficComponents/OrderConfirmPopup.vue")['default']>
export const LazyGraficComponentsOrdersBoard: LazyComponent<typeof import("../app/components/graficComponents/OrdersBoard.vue")['default']>
export const LazyGraficComponentsSellOrderForm: LazyComponent<typeof import("../app/components/graficComponents/SellOrderForm.vue")['default']>
export const LazyGraficComponentsStocksTickerTape: LazyComponent<typeof import("../app/components/graficComponents/StocksTickerTape.vue")['default']>
export const LazyGraficComponentsTradeOrdersPanel: LazyComponent<typeof import("../app/components/graficComponents/TradeOrdersPanel.vue")['default']>
export const LazyTest: LazyComponent<typeof import("../app/components/test.vue")['default']>
export const LazyTestComponentsPortfolioBalans: LazyComponent<typeof import("../app/components/testComponents/PortfolioBalans.vue")['default']>
export const LazyTestComponentsPortfolioHistory: LazyComponent<typeof import("../app/components/testComponents/PortfolioHistory.vue")['default']>
export const LazyTestComponentsPortfolioOverview: LazyComponent<typeof import("../app/components/testComponents/PortfolioOverview.vue")['default']>
export const LazyTestComponentsPortfolioSettings: LazyComponent<typeof import("../app/components/testComponents/PortfolioSettings.vue")['default']>
export const LazyTestComponentsPortfolioTarget: LazyComponent<typeof import("../app/components/testComponents/PortfolioTarget.vue")['default']>
export const LazyTestComponentsTradingSection: LazyComponent<typeof import("../app/components/testComponents/TradingSection.vue")['default']>
export const LazyUseAdvancedMarketChart: LazyComponent<typeof import("../app/components/useAdvancedMarketChart")['default']>
export const LazyUseMarketStats: LazyComponent<typeof import("../app/components/useMarketStats")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
