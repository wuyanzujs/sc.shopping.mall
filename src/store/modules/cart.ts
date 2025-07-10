import { defineStore } from 'pinia';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  stock: number;
  selected: boolean;
  specs?: Record<string, string>;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
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
        return total + (item.price * item.quantity);
      }, 0);
    },

    // 总优惠
    totalSavings(): number {
      return this.selectedItems.reduce((total, item) => {
        if (item.originalPrice && item.originalPrice > item.price) {
          return total + ((item.originalPrice - item.price) * item.quantity);
        }
        return total;
      }, 0);
    },
  },

  actions: {
    // 添加商品到购物车
    addToCart(product: Omit<CartItem, 'selected'>) {
      const existingItem = this.items.find(item =>
        item.id === product.id
        && JSON.stringify(item.specs) === JSON.stringify(product.specs),
      );

      if (existingItem) {
        // 如果商品已存在，增加数量
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
        // 添加新商品
        this.items.push({
          ...product,
          selected: true,
        });
      }

      this.saveToStorage();
      return true;
    },

    // 更新商品数量
    updateQuantity(id: string, specs: Record<string, string> | undefined, quantity: number) {
      const item = this.items.find(item =>
        item.id === id
        && JSON.stringify(item.specs) === JSON.stringify(specs),
      );

      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(id, specs);
        }
        else if (quantity <= item.stock) {
          item.quantity = quantity;
          this.saveToStorage();
        }
        else {
          uni.showToast({
            title: '库存不足',
            icon: 'none',
          });
        }
      }
    },

    // 切换商品选中状态
    toggleItemSelect(id: string, specs: Record<string, string> | undefined) {
      const item = this.items.find(item =>
        item.id === id
        && JSON.stringify(item.specs) === JSON.stringify(specs),
      );

      if (item) {
        item.selected = !item.selected;
        this.saveToStorage();
      }
    },

    // 全选/取消全选
    toggleSelectAll() {
      const shouldSelectAll = !this.isAllSelected;
      this.items.forEach((item) => {
        item.selected = shouldSelectAll;
      });
      this.saveToStorage();
    },

    // 从购物车移除商品
    removeFromCart(id: string, specs: Record<string, string> | undefined) {
      const index = this.items.findIndex(item =>
        item.id === id
        && JSON.stringify(item.specs) === JSON.stringify(specs),
      );

      if (index > -1) {
        this.items.splice(index, 1);
        this.saveToStorage();
      }
    },

    // 清空购物车
    clearCart() {
      this.items = [];
      this.saveToStorage();
    },

    // 删除选中的商品
    removeSelectedItems() {
      this.items = this.items.filter(item => !item.selected);
      this.saveToStorage();
    },

    // 保存到本地存储
    saveToStorage() {
      uni.setStorageSync('cart_items', this.items);
    },

    // 从本地存储加载
    loadFromStorage() {
      try {
        const items = uni.getStorageSync('cart_items');
        if (items) {
          this.items = items;
        }
      }
      catch (error) {
        console.error('加载购物车数据失败:', error);
      }
    },
  },
});
