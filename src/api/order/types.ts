import type {
  ApiResult,
  BaseEntity,
  PaginatedData,
  PaginationQuery,
  ProductInfo,
  UserInfo,
} from '../common/types';

// 订单状态枚举
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded',
}

// 订单基础信息
interface OrderBase extends BaseEntity {
  orderNo: string;
  status: OrderStatus;
  totalAmount: number;// 总金额
  totalQuantity: number; // 总数量
}

// 订单项
export interface OrderItem extends OrderBase { }

// 订单详情
export interface OrderDetail extends OrderBase {
  items: OrderItem[];
}

// 订单商品信息
export interface OrderProduct extends OrderBase, ProductInfo {
  productDesc: string;
  productImage: string;
  paidAt?: string;// 支付时间
  shippedAt?: string;// 发货时间
  deliveredAt?: string;// 收货时间
  cancelledAt?: string;// 取消时间
  refundedAt?: string;// 退款时间
}

// 查询订单列表参数
export interface OrderListQuery extends PaginationQuery, UserInfo {
  status?: OrderStatus;
}

// 订单列表响应
export interface OrderListData extends PaginatedData<OrderProduct> { }

// API响应类型
export type OrderListResult = ApiResult<{ items: OrderItem[] }>;
export type OrderDetailResult = ApiResult<OrderDetail>;
export type OrderListResponse = ApiResult<OrderListData>;

// 创建订单参数
export interface CreateOrderData {
  /**
   * 地址uuid
   */
  address_id: string;
  /**
   * 代理商uuid
   */
  agent_id: string[];
  /**
   * 订单金额
   */
  amount: string;
  /**
   * 请求来源
   */
  appid: string;
  /**
   * 订单描述
   */
  description: string;
  /**
   * 支付人微信openid
   */
  openid: string;
  /**
   * 支付人uuid
   */
  payer: string;
  /**
   * 商品uuid
   */
  product_id: string[];
  /**
   * 数量，订单购买数量
   */
  quantity: number[];
}

// 支付响应
export interface PayResponse {
  success: boolean;
  message: string;
  payment: {
    orderNo: string;
    paySign: string;
  };
  orderno: string; // 订单号
}
