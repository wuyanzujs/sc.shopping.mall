<template>
  <view class="order-page">
    <!-- 订单列表 -->
    <scroll-view
      class="order-list"
      scroll-y
      lower-threshold="150"
      @scrolltolower="reachBottom"
    >
      <OrderItem
        v-for="order in orderList"
        :key="order.id"
        :order="order"
        @action="handleOrderAction"
      />

      <!-- 加载更多 -->
      <view v-if="loading" class="loading">
        <u-loading-icon mode="spinner" size="24" />
        <text class="loading-text">
          加载中...
        </text>
      </view>

      <!-- 没有更多数据 -->
      <view v-if="!hasMore && orderList.length > 0" class="no-more">
        我也是有底线的~
      </view>

      <!-- 空状态 -->
      <view v-if="orderList.length === 0 && !loading" class="empty">
        <up-empty text="暂无订单" mode="order" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import type { OrderProduct } from '@/api/order/types';
import { onMounted, ref } from 'vue';
import OrderItem from './components/order-item.vue';

const orderList = ref<OrderProduct[]>([]);
const loading = ref(false);
const hasMore = ref(true);
const page = ref(1);
// const size = 10;

// 加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) return;

  loading.value = true;
  page.value++;
};

// 处理订单操作
const handleOrderAction = (action: string, order: OrderProduct) => {
  switch (action) {
    case 'pay':
      // 去支付
      break;
    case 'cancel':
      // 取消订单
      break;
    case 'confirm':
      // 确认收货
      break;
    case 'refund':
      // 申请退款
      break;
    case 'detail':
      // 查看详情
      uni.navigateTo({
        url: `/pages/order/detail?id=${order.id}`,
      });
      break;
  }
};

// 触底加载
const reachBottom = () => {
  if (loading.value) return;
  loadMore();
};

onMounted(() => {
  // 初始化时不需要加载，已经有mock数据
});
</script>

<style scoped lang="scss">
.order-page {
  background-color: #f5f5f5;
  height: 100vh;
  box-sizing: border-box;
  position: relative;
}

.order-list {
  height: 100%;
  box-sizing: border-box;
  padding: 20rpx 30rpx;
}

.pull-refresh {
  position: absolute;
  top: -80rpx;
  left: 0;
  right: 0;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  z-index: 10;

  .refresh-content {
    display: flex;
    align-items: center;

    .refresh-text {
      margin-left: 10rpx;
      font-size: 28rpx;
      color: #666;
    }
  }
}

.order-list {
  padding: 20rpx 30rpx;
  min-height: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}

.header-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
}

.status-tabs {
  display: flex;
  background-color: #fff;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.status-tab {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;

  &.active {
    color: #ff6b35;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 4rpx;
      background-color: #ff6b35;
      border-radius: 2rpx;
    }
  }
}

.order-list {
  flex: 1;
  box-sizing: border-box;
  padding: 20rpx 30rpx;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}

.loading-text {
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #999;
}

.no-more {
  text-align: center;
  padding: 40rpx 0;
  font-size: 28rpx;
  color: #999;
}

.empty {
  margin-top: 40%;
  padding: 100rpx 0;
}
</style>
