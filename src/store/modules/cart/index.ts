import type { AddCartData, CartItem, CartListQuery, DeleteCartData } from '@/api/cart/types';

import { CartApi } from '@/api';
import { defineStore } from 'pinia';

interface CartState {
  items: CartItem[]; // 购物车
  loading: boolean; // 是否加载中
  loadingMore: boolean; // 是否加载更多
  noMoreData: boolean; //  是否没有更多数据
  page: number; // 当前页码
  pageSize: number; // 每页数量
  total: number; // 总数
  isAllSelected: boolean; // 是否全选
  needRefresh: boolean; // 新增：是否需要刷新
}

const useCartStore = defineStore({
  id: 'cart',
  state: (): CartState => ({
    items: [],
    loading: false,
    isAllSelected: false,
    loadingMore: false,
    noMoreData: false,
    page: 1,
    pageSize: 10,
    total: 0,
    needRefresh: false,
  }),

  getters: {
    // 购物车商品总数
    totalCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    // 选中的商品
    selectedItems: (state) => {
      return state.items.filter(item => item.selected);
    },

    // 选中商品数量
    selectedCount(): number {
      return this.selectedItems.length;
    },

    // 是否全选
    isAllSelected: (state) => {
      return state.items.length > 0 && state.items.every(item => item.selected);
    },

    // 总价格
    totalPrice(): number {
      return this.selectedItems.reduce((total, item) => {
        return total + (item.price_new * item.quantity);
      }, 0);
    },

    // 总优惠
    totalSavings(): number {
      return this.selectedItems.reduce((total, item) => {
        if (item.originalPrice && item.originalPrice > item.price_new) {
          return total + ((item.originalPrice - item.price_new) * item.quantity);
        }
        return total;
      }, 0);
    },

    // 是否有更多数据
    hasMore: (state) => {
      return state.page * state.pageSize < state.total;
    },
  },

  actions: {
    // 获取购物车列表
    async getCartList(refresh = false, userId: string) {
      if (refresh) {
        this.page = 1;
        this.noMoreData = false;
      }

      this.loading = refresh;
      this.loadingMore = !refresh;

      try {
        const query: CartListQuery = {
          userId,
          page: this.page,
          size: this.pageSize,
        };

        const res = await CartApi.getCartList(query);

        if (refresh) {
          this.items = res.data.list || [];
        }
        else {
          this.items.push(...(res.data.list || []));
        }

        this.total = res.data.totalCount || 0;
        this.page += 1;

        if (!res.data.list || res.data?.list.length < this.pageSize) {
          this.noMoreData = true;
        }

        // 刷新完成后，重置需要刷新标识
        this.needRefresh = false;
        this.saveToStorage();
      }
      catch (error) {
        console.error('获取购物车列表失败:', error);
        // 如果API失败，使用本地数据
        if (refresh) {
          this.loadFromStorage();
        }
        throw error;
      }
      finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },

    // 添加商品到购物车
    async addToCart(product: any, userId: string) {
      try {
        // 先检查本地是否已存在
        const existingItem = this.items.find(item =>
          item.productId === product.productId,
        );

        if (existingItem) {
          // 如果商品已存在，增加数量
          if (existingItem.quantity < existingItem.stock) {
            // await this.updateQuantity(existingItem.id, existingItem.specs, existingItem.quantity + product.quantity);
          }
          else {
            uni.showToast({
              title: '库存不足',
              icon: 'none',
            });
            return false;
          }
        }
        else {
          // 调用API添加新商品
          const addData: AddCartData = {
            productId: product.productId,
            quantity: product.quantity,
            userId,
          };

          await CartApi.addCart(addData);

          // 添加到本地状态
          this.items.push({
            ...product,
            selected: 1,
          });
        }

        // 添加成功后设置需要刷新标识
        this.needRefresh = true;
        this.saveToStorage();
        return true;
      }
      catch (error) {
        console.error('添加到购物车失败:', error);
        // API失败时，仍然添加到本地
        const existingItem = this.items.find(item =>
          item.id === product.id
          && JSON.stringify(item.specs) === JSON.stringify(product.specs),
        );

        if (existingItem) {
          if (existingItem.quantity < existingItem.stock) {
            existingItem.quantity += product.quantity;
          }
          else {
            uni.showToast({
              title: '库存不足',
              icon: 'none',
            });
            return false;
          }
        }
        else {
          this.items.push({
            ...product,
            selected: true,
          });
        }

        this.saveToStorage();
        return true;
      }
    },

    // 更新商品数量
    async updateQuantity(id: string, quantity: number, userId: string) {
      console.log('updateQuantity', id, quantity, userId);
      const item = this.items.find(item => item.productId === id);

      if (!item) return;

      if (quantity <= 0) {
        return;
      }

      if (quantity > item.stock) {
        uni.showToast({
          title: '库存不足',
          icon: 'none',
        });
        return;
      }
      try {
        await CartApi.addCart({ productId: id, quantity, userId });

        item.quantity = quantity;
        this.saveToStorage();
      }
      catch (error) {
        console.error('更新数量失败:', error);
        // API失败时，仍然更新本地状态
        item.quantity = quantity;
        this.saveToStorage();
      }
    },

    // 切换商品选中状态
    toggleItemSelect(id: string) {
      const item = this.items.find(item => item.id === id);

      if (item) {
        item.selected = !item.selected ? 1 : 0;
        this.saveToStorage();
      }
    },

    // 全选/取消全选
    toggleSelectAll() {
      const shouldSelectAll = !this.isAllSelected;
      this.items.forEach((item) => {
        item.selected = shouldSelectAll ? 1 : 0;
      });
      this.saveToStorage();
    },

    // 清空购物车
    async clearCart(userId: string) {
      try {
        const deleteData: DeleteCartData = {
          cartIds: [],
          userId,
        };
        await CartApi.deleteCart(deleteData);

        this.items = [];
        this.saveToStorage();
      }
      catch (error) {
        console.error('清空购物车失败:', error);
        this.items = [];
        this.saveToStorage();
      }
    },

    // 删除选中的商品
    async removeSelectedItems(userId: string) {
      try {
        const selectedIds = this.selectedItems.map(item => item.id);
        if (selectedIds.length > 0) {
          const deleteData: DeleteCartData = {
            cartIds: selectedIds,
            userId,
          };
          await CartApi.deleteCart(deleteData);
        }

        this.items = this.items.filter(item => !item.selected);
        this.saveToStorage();
      }
      catch (error) {
        console.error('删除选中商品失败:', error);
        this.items = this.items.filter(item => !item.selected);
        this.saveToStorage();
      }
    },

    // 保存到本地存储
    saveToStorage() {
      try {
        uni.setStorageSync('cart_items', this.items);
      }
      catch (error) {
        console.error('保存购物车数据失败:', error);
      }
    },

    // 从本地存储加载
    loadFromStorage() {
      try {
        const items = uni.getStorageSync('cart_items');
        if (items && Array.isArray(items)) {
          this.items = items;
        }
      }
      catch (error) {
        console.error('加载购物车数据失败:', error);
      }
    },
  },

  // 持久化配置
  persist: {
    key: 'cart-store',
    storage: {
      getItem: (key: string) => uni.getStorageSync(key),
      setItem: (key: string, value: any) => uni.setStorageSync(key, value),
    },
    // paths: ['items', 'total', 'page', 'pageSize', 'noMoreData'], // 需要持久化的数据
  },
});

export default useCartStore;
