<template>
  <view class="pending-page">
    <!-- 待支付订单列表 -->
    <scroll-view
      class="pending-list"
      scroll-y
      lower-threshold="150"
      @scrolltolower="loadMore"
    >
      <!-- 订单列表 -->
      <PendingItem
        v-for="order in pendingOrders"
        :key="order.id"
        :order="order"
        @pay="handlePay"
        @cancel="handleCancel"
      />

      <!-- 加载更多状态 -->
      <view v-if="loadingMore" class="loading-more">
        <text class="loading-text">
          正在加载更多订单...
        </text>
      </view>

      <view v-else-if="noMoreData" class="no-more-data">
        <text class="no-more-text">
          我也是有底线的~
        </text>
      </view>

      <!-- 空状态 -->
      <view v-if="pendingOrders.length === 0 && !loadingMore" class="empty-state">
        <text class="empty-text">
          暂无待支付订单
        </text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import PendingItem from './components/pendding-item.vue';

// 触底加载状态
const loadingMore = ref(false);
const noMoreData = ref(false);
const page = ref(1);

// 模拟待支付订单数据
const pendingOrders = ref([
  {
    id: 'PO001',
    orderNo: '202312150001',
    createTime: '2023-12-15 14:30:25',
    totalAmount: 299.80,
    items: [
      {
        id: '1',
        title: 'iPhone 15 Pro Max 256GB',
        price: 9999.00,
        quantity: 1,
        image: 'https://picsum.photos/200/200?random=1',
        specs: '深空黑色 256GB',
      },
    ],
    countdown: 1800, // 30分钟倒计时（秒）
  },
  {
    id: 'PO002',
    orderNo: '202312150002',
    createTime: '2023-12-15 15:20:10',
    totalAmount: 158.90,
    items: [
      {
        id: '2',
        title: '【云仓】双钱龟苓膏50g',
        price: 9.90,
        quantity: 2,
        image: 'https://picsum.photos/200/200?random=2',
        specs: '原味 50g',
      },
      {
        id: '3',
        title: '聚欣鲜 鲜冻黄花鱼500g',
        price: 39.90,
        quantity: 3,
        image: 'https://picsum.photos/200/200?random=3',
        specs: '500g 1条装',
      },
    ],
    countdown: 2400, // 40分钟倒计时（秒）
  },
]);

// 生成模拟订单数据
function generateMockOrder() {
  const orderNo = `2023121500${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
  const products = [
    { title: 'iPhone 15 Pro Max', price: 9999.00, specs: '深空黑色 256GB' },
    { title: 'MacBook Air M2', price: 8999.00, specs: '13英寸 256GB' },
    { title: '【云仓】双钱龟苓膏', price: 9.90, specs: '原味 50g' },
    { title: '聚欣鲜 鲜冻黄花鱼', price: 39.90, specs: '500g 1条装' },
    { title: '圣农脆皮鸡排', price: 9.90, specs: '原味 300g' },
  ];

  const itemCount = Math.floor(Math.random() * 3) + 1;
  const items = [];
  let totalAmount = 0;

  for (let i = 0; i < itemCount; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const item = {
      id: Date.now() + i,
      title: product.title,
      price: product.price,
      quantity,
      image: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`,
      specs: product.specs,
    };
    items.push(item);
    totalAmount += product.price * quantity;
  }

  return {
    id: `PO${Date.now()}`,
    orderNo,
    createTime: new Date().toLocaleString('zh-CN'),
    totalAmount: Number(totalAmount.toFixed(2)),
    items,
    countdown: Math.floor(Math.random() * 3600) + 600, // 10-70分钟倒计时
  };
}

// 触底加载更多
async function loadMore() {
  if (loadingMore.value || noMoreData.value) {
    return;
  }

  loadingMore.value = true;

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 模拟分页逻辑，假设总共有20个订单
  const totalItems = 20;
  const currentTotal = pendingOrders.value.length;

  if (currentTotal >= totalItems) {
    noMoreData.value = true;
    loadingMore.value = false;
    return;
  }

  // 生成2-4个新订单
  const newOrdersCount = Math.floor(Math.random() * 3) + 2;
  const newOrders = [];

  for (let i = 0; i < newOrdersCount; i++) {
    if (currentTotal + newOrders.length >= totalItems) {
      break;
    }
    newOrders.push(generateMockOrder());
  }

  // 添加到现有列表
  pendingOrders.value.push(...newOrders);
  page.value++;
  loadingMore.value = false;

  // 检查是否已加载完所有数据
  if (pendingOrders.value.length >= totalItems) {
    noMoreData.value = true;
  }
}

// 处理支付
function handlePay(order) {
  uni.showModal({
    title: '确认支付',
    content: `确认支付订单 ${order.orderNo}，金额 ¥${order.totalAmount.toFixed(2)}？`,
    success: (res) => {
      if (res.confirm) {
        // 模拟支付成功
        uni.showToast({
          title: '支付成功',
          icon: 'success',
        });
        // 从列表中移除已支付订单
        const index = pendingOrders.value.findIndex(item => item.id === order.id);
        if (index > -1) {
          pendingOrders.value.splice(index, 1);
        }
      }
    },
  });
}

// 处理取消订单
function handleCancel(order) {
  uni.showModal({
    title: '确认取消',
    content: `确认取消订单 ${order.orderNo}？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '订单已取消',
          icon: 'success',
        });
        // 从列表中移除已取消订单
        const index = pendingOrders.value.findIndex(item => item.id === order.id);
        if (index > -1) {
          pendingOrders.value.splice(index, 1);
        }
      }
    },
  });
}
</script>

<style scoped lang='scss'>
.pending-page {
  background-color: #f5f5f5;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.pending-list {
  flex: 1;
  height: 0;
}

// 加载状态样式
.loading-more {
  padding: 40rpx 0;
  text-align: center;

  .loading-text {
    font-size: 28rpx;
    color: #999;
  }
}

.no-more-data {
  padding: 40rpx 0;
  text-align: center;

  .no-more-text {
    font-size: 28rpx;
    color: #ccc;
  }
}

.empty-state {
  padding: 200rpx 0;
  text-align: center;

  .empty-text {
    font-size: 32rpx;
    color: #999;
  }
}
</style>
