<template>
  <view class="order-item">
    <!-- 订单头部 -->
    <view class="order-header">
      <view class="seller-info">
        <image class="seller-avatar" src="/static/images/logo.png" mode="aspectFill" />
        <text class="seller-name">
          数创医疗
        </text>
      </view>
      <view class="order-status" :class="getStatusClass(order.status)">
        {{ getStatusText(order.status) }}
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="product-info" @click="$emit('action', 'detail', order)">
      <image class="product-image" :src="order.productImage" mode="aspectFill" />
      <view class="product-details">
        <text class="product-name">
          {{ order.productName }}
        </text>
        <text class="product-desc">
          {{ order.productDesc }}
        </text>
        <view class="price-info">
          <text class="price">
            ¥{{ order.price }}
          </text>
          <text class="quantity">
            x{{ order.quantity }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { OrderProduct } from '@/api/order/types';

interface Props {
  order: OrderProduct;
}

defineProps<Props>();
defineEmits<{
  action: [action: string, order: OrderProduct];
}>();

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待付款',
    paid: '待发货',
    shipped: '待收货',
    delivered: '待评价',
    completed: '交易成功',
    cancelled: '已取消',
    refunding: '退款中',
    refunded: '已退款',
  };
  return statusMap[status] || '未知状态';
};

// 获取状态样式类
const getStatusClass = (status: string) => {
  return {
    'status-success': ['completed'].includes(status),
    'status-warning': ['pending', 'paid', 'shipped'].includes(status),
    'status-danger': ['cancelled', 'refunded'].includes(status),
    'status-info': ['delivered', 'refunding'].includes(status),
  };
};
</script>

<style scoped lang="scss">
.order-item {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.seller-info {
  display: flex;
  align-items: center;
}

.seller-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.seller-name {
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
}

.recommend-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 4rpx 16rpx;
}

.tag-text {
  font-size: 20rpx;
  color: #fff;
}

.order-status {
  font-size: 28rpx;
  font-weight: 600;

  &.status-success {
    color: #52c41a;
  }

  &.status-warning {
    color: #faad14;
  }

  &.status-danger {
    color: #ff4d4f;
  }

  &.status-info {
    color: #1890ff;
  }
}

.product-info {
  display: flex;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.product-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.price-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  font-size: 32rpx;
  color: #ff6b35;
  font-weight: 600;
}

.quantity {
  font-size: 28rpx;
  color: #666;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  padding: 30rpx;
  gap: 20rpx;
}
</style>
