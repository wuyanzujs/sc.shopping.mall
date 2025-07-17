import type { ProductListData, ProductQuery } from './types';
import { post } from '@/utils/request';
import { BU_URL } from '../config';

/** 获取商品列表 */
export const getProductListOrItemApi = (data: ProductQuery) => post<ProductListData>(`${BU_URL}/user_app/product/list`, { data });
