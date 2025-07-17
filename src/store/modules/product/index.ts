import type { Product, ProductQuery } from '@/api/product/types';
import { ProductApi } from '@/api';
import { defineStore } from 'pinia';

interface ProductStoreState {
  // 商品列表
  productList: Product[];
  // 加载状态
  loading: boolean;
  // 分页信息
  pagination: {
    current: number;
    total: number;
    pageSize: number;
  };
  // 缓存时间戳
  lastFetchTime: number;
}

const useProductStore = defineStore('product', {
  state: (): ProductStoreState => ({
    productList: [],
    loading: false,
    pagination: {
      current: 1,
      total: 0,
      pageSize: 20,
    },
    lastFetchTime: 0,
  }),

  getters: {
    // 获取商品列表
    products: state => state.productList,
    // 是否有更多数据
    hasMore: (state) => {
      const { current, pageSize, total } = state.pagination;
      return current * pageSize < total;
    },
    // 是否需要刷新数据（5分钟缓存）
    needRefresh: (state) => {
      return Date.now() - state.lastFetchTime > 5 * 60 * 1000;
    },
  },

  actions: {
    // 获取商品列表
    async getProductListOrItem(params: ProductQuery, refresh = false) {
      // 如果不是刷新且有缓存数据，直接返回
      if (!refresh && this.productList.length > 0 && !this.needRefresh) {
        return this.productList;
      }

      this.loading = true;
      try {
        const res = await ProductApi.getProductListOrItemApi({
          page: 1,
          size: this.pagination.pageSize,
          ...params,
        });

        this.productList = res.rows;
        this.pagination.total = res.total;
        this.pagination.current = 1;
        this.lastFetchTime = Date.now();

        return res.rows;
      }
      catch (error) {
        console.error('获取商品列表失败:', error);
        throw error;
      }
      finally {
        this.loading = false;
      }
    },

    // 加载更多商品
    async loadMoreProducts(params: Omit<ProductQuery, 'page' | 'size'> = {}) {
      if (!this.hasMore || this.loading) return;

      this.loading = true;
      try {
        const res = await ProductApi.getProductListOrItemApi({
          page: this.pagination.current + 1,
          size: this.pagination.pageSize,
          ...params,
        });

        this.productList.push(...res.rows);
        this.pagination.current += 1;

        return res.rows;
      }
      catch (error) {
        console.error('加载更多商品失败:', error);
        throw error;
      }
      finally {
        this.loading = false;
      }
    },

    // 清空商品列表
    clearProducts() {
      this.productList = [];
      this.pagination.current = 1;
      this.pagination.total = 0;
      this.lastFetchTime = 0;
    },
  },
});

export default useProductStore;
