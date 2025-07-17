// 导出支付相关的类型
export * from './index';

// 扩展的支付配置
export interface ExtendedPaymentConfig {
  // 是否自动跳转到订单详情
  autoNavigateToOrder?: boolean;
  // 支付成功后的跳转路径
  successRedirectUrl?: string;
  // 是否清除购物车
  clearCart?: boolean;
  // 自定义加载文案
  loadingText?: {
    creating?: string;
    paying?: string;
    confirming?: string;
  };
}
