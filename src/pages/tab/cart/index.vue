<template>
  <view class="cart-page">
    <!-- 购物车列表 -->
    <view class="cart-list">
      <!-- 商品列表 -->
      <ProductItem
        v-for="item in mockCartItems" :key="item.id" :item="item"
        @select-change="(value) => toggleItemSelect(item, value)" @quantity-decrease="decreaseQuantity(item)"
        @quantity-increase="increaseQuantity(item)"
      />
    </view>

    <!-- 底部结算栏 -->
    <view class="bottom-bar">
      <view class="select-all">
        <Checkbox :model-value="isAllSelected" label="全选" @change="toggleSelectAll" />
      </view>

      <view class="total-info">
        <view class="total-text">
          <text class="total-label">
            合计：
          </text>
          <text class="total-price">
            ¥{{ totalPrice.toFixed(2) }}
          </text>
        </view>
      </view>

      <view class="checkout-btn" @click="checkout">
        <text class="checkout-text">
          去结算
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import Checkbox from '@/components/checkbox/index.vue';
import { computed, ref } from 'vue';
import ProductItem from './components/product-item.vue';

// 响应式数据
// const showNotice = ref(true);

// 模拟购物车数据
const mockCartItems = ref([
  {
    id: '1',
    title: '【云仓】双钱龟苓膏50g',
    price: 9.90,
    image: 'https://picsum.photos/200/200?random=1',
    quantity: 1,
    selected: true,
    specs: '原味 50g',
  },
  {
    id: '2',
    title: '聚欣鲜 鲜冻黄花鱼500g(1条装)',
    price: 39.90,
    image: 'https://picsum.photos/200/200?random=2',
    quantity: 1,
    selected: true,
    specs: '500g 1条装',
  },
  {
    id: '3',
    title: '圣农脆皮鸡排(原味)300g',
    price: 9.90,
    image: 'https://picsum.photos/200/200?random=3',
    quantity: 1,
    selected: true,
    specs: '原味 300g',
  },
  {
    id: '4',
    title: '黑土地黄糯玉米(8穗)/1.6kg',
    price: 49.00,
    image: 'https://picsum.photos/200/200?random=4',
    quantity: 1,
    selected: true,
    specs: '8穗装 1.6kg',
  },
  {
    id: '5',
    title: '【云仓】双钱龟苓膏50g',
    price: 9.90,
    image: 'https://picsum.photos/200/200?random=5',
    quantity: 1,
    selected: true,
    specs: '原味 50g',
  },
  {
    id: '6',
    title: '【云仓】双钱龟苓膏50g',
    price: 9.90,
    image: 'https://picsum.photos/200/200?random=6',
    quantity: 1,
    selected: true,
    specs: '原味 50g',
  },
  {
    id: '7',
    title: '【云仓】双钱龟苓膏50g',
    price: 9.90,
    image: 'https://picsum.photos/200/200?random=7',
    quantity: 1,
    selected: true,
    specs: '原味 50g',
  },
]);

// 计算属性
const totalPrice = computed(() => {
  return mockCartItems.value
    .filter(item => item.selected)
    .reduce((total, item) => total + (item.price * item.quantity), 0);
});

const selectedCount = computed(() => {
  return mockCartItems.value.filter(item => item.selected).length;
});

const isAllSelected = computed({
  get: () => mockCartItems.value.length > 0 && mockCartItems.value.every(item => item.selected),
  set: (value) => {
    mockCartItems.value.forEach((item) => {
      item.selected = value;
    });
  },
});

// 方法
// function openLocation() {
//   uni.showToast({
//     title: '正在开启定位权限...',
//     icon: 'loading',
//   });
// }

// function closeNotice() {
//   showNotice.value = false;
// }

function toggleItemSelect(item, value) {
  item.selected = value;
}

function toggleSelectAll() {
  // 通过计算属性的 setter 处理
  isAllSelected.value = !isAllSelected.value;
  // 或者直接赋值
  mockCartItems.value.forEach(item => item.selected = isAllSelected.value);
}

function decreaseQuantity(item) {
  if (item.quantity > 1) {
    item.quantity--;
  }
}

function increaseQuantity(item) {
  item.quantity++;
}

function checkout() {
  if (selectedCount.value === 0) {
    uni.showToast({
      title: '请选择要结算的商品',
      icon: 'none',
    });
    return;
  }

  uni.showToast({
    title: `已选择${selectedCount.value}件商品，总计¥${totalPrice.value.toFixed(2)}`,
    icon: 'none',
    duration: 2000,
  });
}
</script>

<style scoped lang='scss'>
.cart-page {
  background-color: #f5f5f5;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: 160rpx;
  overflow-y: auto;
}

.cart-list {
  margin-top: 20rpx;
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
    display: flex;
    align-items: center;
    margin-right: 30rpx;

    .select-all-text {
      margin-left: 16rpx;
      font-size: 28rpx;
      color: #333;
    }
  }

  .total-info {
    flex: 1;
    text-align: right;

    .total-text {
      .total-label {
        font-size: 28rpx;
        color: #333;
      }

      .total-price {
        font-size: 36rpx;
        font-weight: 600;
        color: #ff4757;
      }
    }
  }

  .checkout-btn {
    background-color: #4F95FF;
    padding: 24rpx 40rpx;
    border-radius: 50rpx;
    margin-left: 30rpx;

    .checkout-text {
      font-size: 32rpx;
      color: #fff;
      font-weight: 500;
    }

    &:active {
      background-color: #1eb88a;
    }
  }
}
</style>
