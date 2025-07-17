import type { AddCartData, CartListQuery, CartListResponse, DeleteCartData } from './types';

import { get, post } from '@/utils/request';
import { BU_URL } from '../config';

// 获取购物车列表
export function getCartList(query: CartListQuery): Promise<CartListResponse> {
  return get(`${BU_URL}/user_app/cart/list?userId=${query.userId}&page=${query.page}&size=${query.size}`);
}

// 添加商品到购物车
export function addCart(data: AddCartData) {
  return post(`${BU_URL}/user_app/cart/add`, { data });
}

// 删除购物车商品
export function deleteCart(data: DeleteCartData) {
  return post(`${BU_URL}/user_app/cart/delete`, { data });
}

// 清空购物车
export function clearCart(userId: string) {
  return post(`${BU_URL}/user_app/cart/clear`, { data: { userId } });
}

// 批量更新选中状态
export function updateCartSelection(data: { cartIds: string[]; selected: boolean; userId: string }) {
  return post(`${BU_URL}/user_app/cart/selection`, { data });
}

// 获取购物车统计信息
export function getCartStats(userId: string) {
  return get(`${BU_URL}/user_app/cart/stats`, {
    params: { userId },
  });
}
