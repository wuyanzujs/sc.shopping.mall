import type { CategoryListResponse, ProductListData, ProductQuery } from './types';
import { get, post } from '@/utils/request';
import { BU_URL } from '../config';

/** 获取商品列表 */
export const getProductListOrItemApi = (data: ProductQuery) => post<ProductListData>(`${BU_URL}/user_app/product/list`, { data });

/** 获取商品分类列表 */
export const getProductCategoryListApi = () => get<CategoryListResponse>(`${BU_URL}/user_app/product_type/list`);
