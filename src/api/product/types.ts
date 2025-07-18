import type { UserInfo } from '../common/types';

// 商品查询参数
export interface ProductQuery {
  /**
   * 分类ID
   */
  categoryId?: string;
  /**
   * 关键词搜索
   */
  keyword?: string;
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页条数
   */
  size?: number;
}

// 商品详情
export interface Product {
  uuid: string;
  name: string;
  price_new: number;
  price_old: number;
  description: string;
  specs: string; // 规格
  stock: number; // 库存
  images: string[];
  create_tm: string;
  update_tm: string | null;
  category: string | null;
  deleted: boolean;
  type: number;
  type_id: string;
  agent_id: string; // 代理商ID
}

// 商品列表响应（保持与现有API兼容）
export interface ProductListData {
  rows: Product[];
  total: number;
}

// 添加到购物车参数
export interface AddToCartRequest extends UserInfo {
  productId: string;
  quantity: number;
}

// 添加到购物车响应
export interface CartItem {
  id?: string;
  productId?: string;
  quantity?: number;
}

// 商品分类中的商品信息
export interface CategoryProduct {
  uuid: string;
  name: string;
  description: string;
  price_new: number;
  price_old: number;
  images: string[];
  specs: string[];
  stock: number;
  type: number;
  type_id: string;
  agent_id: string;
  create_tm: string;
  update_tm: string | null;
  deleted: string | null;
}

// 商品分类
export interface ProductCategory {
  id: string;
  type_name: string;
  type_code: string;
  status: number;
  children: CategoryProduct[];
}

// 分类列表响应
export interface CategoryListResponse {
  code: number;
  data: ProductCategory[];
}
