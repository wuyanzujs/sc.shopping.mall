export interface CommonReq {
  [key: string]: any;
}

export interface CommonRes {
  [key: string]: any;
}

export interface UploadRes {
  file: string;
  url: string;
}

export interface SendCodeReq {
  phone: number;
  code: number;
}

export interface SendCodeRes {
  code: number;
}

export interface ProvinceItem {
  label: string; // 省份名称，如 "湖南省"
  value: string; // 省份代码，如 "430000"
  children?: CityItem[];
}

export interface CityItem {
  label: string; // 城市名称，如 "长沙市"
  value: string; // 城市代码，如 "430100"
  children?: DistrictItem[];
}

export interface DistrictItem {
  label: string; // 区县名称，如 "芙蓉区"
  value: string; // 区县代码，如 "430102"
}

// 省市区数据类型
export type ProvinceData = ProvinceItem[];

// 基础分页查询参数
export interface PaginationQuery {
  /**
   * 页码，从1开始
   */
  page: number;
  /**
   * 每页条数
   */
  size: number;
}

// 分页响应数据
export interface PaginatedData<T> extends PaginationQuery {
  rows: T[];
  total: number;
}

// 标准API响应格式
export interface ApiResult<T = any> {
  code: number;
  data: T;
  message: string;
}

// 基础实体字段
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 商品基础信息
export interface ProductInfo {
  productId: string;
  productName: string;
  price: number;
  quantity: number; // 库存数量
}

// 用户基础信息
export interface UserInfo {
  userId: string;
}
