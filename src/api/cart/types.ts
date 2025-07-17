export interface CartListQuery {
  userId: string;
  page: number;
  size: number;
}

export interface AddCartData {
  productId: string; // 商品id
  quantity?: number; // 数量
  userId: string; // 用户id
  selected?: number;
  specs?: Record<string, string>; // 可选 规格
}

export interface UpdateCartData {
  cartId: string;
  quantity: number;
  userId: string;
}

export interface DeleteCartData {
  cartIds: string[];
  userId: string;
}

export interface ProductItem {
  id: string; // 购物车id
  title: string; // 商品名称
  price: number; // 价格
  originalPrice?: number; // 原价
  image: string; // 商品图片
  productImage: string[]; // 商品图片
  quantity: number; // 数量
  stock: number; // 库存
  selected: boolean; // 是否选中
  specs?: Record<string, string>; // 规格
  productId?: string; // 商品id
}

export interface CartItem {
  id: string;
  productName: string;
  productId: string;
  price_new: number;
  productImage: string[];
  quantity: number;
  selected: number;
  stock: number; // 库存
  agent_id: string; // 代理商ID
  // 以下后端没有返回
  specs?: Record<string, string>; // 规格
  originalPrice?: number; // 原价
}

// export interface CartListResponse {
//   data: ProductItem[];
//   total: number;
//   page: number;
//   size: number;
// }

export interface CartListResponse {
  data: CartList;
  code: number;
}

export interface CartList {
  list: CartItem[];
  totalCount: number;
  totalPrice: number;
}
