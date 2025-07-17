<template>
  <view class="cart-page">
    <!-- 顶部操作栏 -->
    <view class="cart-header">
      <view class="header-left">
        <text class="cart-title">
          购物车
        </text>
        <text class="cart-count">
          ({{ cartStore.totalCount }})
        </text>
      </view>
      <view class="header-right">
        <text
          v-if="cartStore.selectedCount > 0"
          class="delete-btn"
          @click="handleDeleteSelected"
        >
          删除选中
        </text>
        <text
          v-if="cartStore.items.length > 0"
          class="clear-btn"
          @click="handleClearCart"
        >
          清空购物车
        </text>
      </view>
    </view>

    <!-- 购物车列表 -->
    <scroll-view
      class="cart-list"
      scroll-y
      lower-threshold="150"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @scrolltolower="loadMore"
      @refresherrefresh="onRefresh"
    >
      <!-- 商品列表 -->
      <ProductItem
        v-for="item in cartStore.items"
        :key="item.id"
        :item="item"
        @select-change="(value) => handleSelectChange(item, value)"
        @quantity-decrease="() => handleQuantityChange(item.productId, item.quantity - 1)"
        @quantity-increase="() => handleQuantityChange(item.productId, item.quantity + 1)"
      />

      <!-- 空状态 -->
      <view v-if="cartStore.items.length === 0 && !cartStore.loading" class="empty-cart">
        <image class="empty-image" src="/static/images/empty-cart.png" mode="aspectFit" />
        <text class="empty-text">
          购物车空空如也
        </text>
        <text class="empty-desc">
          快去挑选心仪的商品吧~
        </text>
        <up-button
          size="normal"
          custom-style="margin-top: 40rpx; width: 300rpx; background-color: #4F95FF; color: #fff; font-size: 32rpx;"
          @click="goShopping"
        >
          去逛逛
        </up-button>
      </view>

      <!-- 加载更多状态 -->
      <view v-if="cartStore.items.length > 0" class="load-more">
        <view v-if="cartStore.loadingMore" class="loading">
          <up-loading-icon mode="circle" size="24" />
          <text class="loading-text">
            加载中...
          </text>
        </view>
        <view v-else-if="cartStore.noMoreData" class="no-more">
          <text class="no-more-text">
            我也是有底线的~
          </text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部结算栏 -->
    <view v-if="cartStore.items.length > 0" class="bottom-bar">
      <view class="select-all">
        <Checkbox
          :model-value="cartStore.isAllSelected"
          label="全选"
          @change="handleSelectAll"
        />
      </view>

      <view class="total-info">
        <view class="total-text">
          <text class="total-label">
            合计：
          </text>
          <text class="total-price">
            ¥{{ cartStore.totalPrice.toFixed(2) }}
          </text>
        </view>
        <view v-if="cartStore.totalSavings > 0" class="savings">
          <text class="savings-text">
            已优惠 ¥{{ cartStore.totalSavings.toFixed(2) }}
          </text>
        </view>
      </view>

      <view
        class="checkout-btn"
        :class="{ disabled: cartStore.selectedCount === 0 }"
        @click="handleCheckout"
      >
        <text class="checkout-text">
          去结算({{ cartStore.selectedCount }})
        </text>
      </view>
    </view>

    <!-- 加载遮罩 -->
    <up-loading-page
      :loading="cartStore.loading"
      loading-text="加载中..."
    />
  </view>
</template>

<script setup lang="ts">
import type { CartItem } from '@/api/cart/types';
import Checkbox from '@/components/checkbox/index.vue';
import { useCartStore, useUserStore } from '@/store';
import { ref } from 'vue';
import ProductItem from './components/product-item.vue';

const cartStore = useCartStore();
const userStore = useUserStore();
const refreshing = ref(false);

// 页面加载时获取数据
onShow(async () => {
  // 如果需要刷新或者没有数据，则重新获取
  if (cartStore.needRefresh || cartStore.items.length === 0) {
    await loadData(true);
  }
});

// 刷新购物车数据
const onRefresh = async () => {
  refreshing.value = true;
  try {
    await loadData(true);
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
    });
  }
  catch (error: any) {
    console.log('[ error ] >', error);
  }
  finally {
    refreshing.value = false;
  }
};

// 加载数据
const loadData = async (refresh = false) => {
  try {
    await cartStore.getCartList(refresh, userStore.uuid);
  }
  catch (error: any) {
    console.log('[ error ] >', error);
    uni.showToast({
      title: error.message || '获取购物车数据失败',
      icon: 'error',
    });
  }
};

// 触底加载更多
const loadMore = async () => {
  if (!cartStore.hasMore || cartStore.loadingMore) return;

  try {
    await cartStore.getCartList(false, userStore.uuid);
  }
  catch (error: any) {
    uni.showToast({
      title: error.message || '加载更多失败',
      icon: 'error',
    });
  }
};

// 处理商品选中状态变化
const handleSelectChange = (item: CartItem, value: boolean) => {
  console.log('value', value);
  cartStore.toggleItemSelect(item.id);
};

// 处理全选
const handleSelectAll = () => {
  cartStore.toggleSelectAll();
};

// 处理数量变化
const handleQuantityChange = async (id: string, newQuantity: number) => {
  try {
    await cartStore.updateQuantity(id, newQuantity, userStore.uuid);
  }
  catch (error: any) {
    uni.showToast({
      title: error.message || '更新数量失败',
      icon: 'error',
    });
  }
};

// 删除选中商品
const handleDeleteSelected = () => {
  if (cartStore.selectedCount === 0) {
    uni.showToast({
      title: '请选择要删除的商品',
      icon: 'none',
    });
    return;
  }

  uni.showModal({
    title: '确认删除',
    content: `确定要删除选中的${cartStore.selectedCount}件商品吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          await cartStore.removeSelectedItems(userStore.uuid);
          uni.showToast({
            title: '删除成功',
            icon: 'success',
          });
        }
        catch (error: any) {
          uni.showToast({
            title: error.message || '删除失败',
            icon: 'error',
          });
        }
      }
    },
  });
};

// 清空购物车
const handleClearCart = () => {
  uni.showModal({
    title: '确认清空',
    content: '确定要清空购物车吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await cartStore.clearCart(userStore.uuid);
          uni.showToast({
            title: '清空成功',
            icon: 'success',
          });
        }
        catch (error: any) {
          uni.showToast({
            title: error.message || '清空失败',
            icon: 'error',
          });
        }
      }
    },
  });
};

// 去购物
const goShopping = () => {
  uni.switchTab({
    url: '/pages/tab/home/index',
  });
};

// 去结算
const handleCheckout = () => {
  if (cartStore.selectedCount === 0) {
    uni.showToast({
      title: '请选择要结算的商品',
      icon: 'none',
    });
    return;
  }

  // 跳转到结算页面
  uni.navigateTo({
    url: '/pages/confirm/index',
  });
};
</script>

<style scoped lang="scss">
.cart-page {
  background-color: #f5f5f5;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.cart-header {
  background-color: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #f0f0f0;

  .header-left {
    display: flex;
    align-items: center;

    .cart-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .cart-count {
      font-size: 24rpx;
      color: #999;
      margin-left: 10rpx;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .delete-btn,
    .clear-btn {
      font-size: 28rpx;
      color: #4F95FF;
      padding: 10rpx 20rpx;
      border-radius: 8rpx;
      background-color: #f2fbff;
    }
  }
}

.cart-list {
  flex: 1;
  padding: 20rpx 20rpx 0;
  box-sizing: border-box;
  height: 0;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
  text-align: center;

  .empty-image {
    width: 300rpx;
    height: 300rpx;
    margin-bottom: 40rpx;
  }

  .empty-text {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 20rpx;
  }

  .empty-desc {
    font-size: 28rpx;
    color: #999;
  }
}

.load-more {
  padding: 40rpx 0;
  text-align: center;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.loading-text {
  font-size: 24rpx;
  color: #666;
}

.no-more {
  padding: 20rpx 0;
}

.no-more-text {
  font-size: 24rpx;
  color: #999;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  z-index: 100;

  .select-all {
    margin-right: 30rpx;
  }

  .total-info {
    flex: 1;
    text-align: right;

    .total-text {
      display: flex;
      align-items: baseline;
      justify-content: flex-end;

      .total-label {
        font-size: 28rpx;
        color: #333;
      }

      .total-price {
        font-size: 36rpx;
        font-weight: 600;
        color: #ff4757;
        margin-left: 10rpx;
      }
    }

    .savings {
      margin-top: 5rpx;

      .savings-text {
        font-size: 24rpx;
        color: #ff4757;
      }
    }
  }

  .checkout-btn {
    background-color: #4F95FF;
    color: #fff;
    padding: 20rpx 40rpx;
    border-radius: 20rpx;
    margin-left: 30rpx;
    transition: all 0.3s ease;

    &.disabled {
      background-color: #9bc3ff;
      color: #fff;
    }

    .checkout-text {
      font-size: 28rpx;
      font-weight: 600;
    }
  }
}
</style>
