import type { CreateOrderData, OrderListQuery, OrderListResponse, PayResponse } from './types';
import { get, post } from '@/utils/request';
import { BU_URL, WX_URL } from '../config';

export function getOrderList(query: OrderListQuery) {
  return get<OrderListResponse>(`${BU_URL}/user_app/order_agent/list?userId=${query.userId}&page=${query.page}&size=${query.size}`);
}

// 创建订单
export function createOrder(data: CreateOrderData) {
  return post<PayResponse>(`${WX_URL}/mch/prepay-agent`, { data });
}
