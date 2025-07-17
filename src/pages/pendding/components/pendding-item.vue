<template>
  <view class="pending-item">
    <!-- 订单头部 -->
    <view class="order-header">
      <view class="order-info">
        <text class="order-no">
          订单号：{{ order.orderNo }}
        </text>
        <text class="create-time">
          {{ order.createTime }}
        </text>
      </view>
      <view class="countdown">
        <text class="countdown-text">
          {{ formatCountdown(countdown) }}
        </text>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="product-list">
      <view v-for="item in order.items" :key="item.id" class="product-item">
        <view class="product-image">
          <up-image :src="item.image" width="120rpx" height="120rpx" border-radius="8rpx" />
        </view>
        <view class="product-info">
          <view class="product-title">
            {{ item.title }}
          </view>
          <view class="product-specs">
            {{ item.specs }}
          </view>
          <view class="product-price">
            <text class="price-symbol">
              ¥
            </text>
            <text class="price-value">
              {{ item.price.toFixed(2) }}
            </text>
            <text class="quantity">
              ×{{ item.quantity }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 订单总价 -->
    <view class="order-total">
      <text class="total-label">
        合计：
      </text>
      <text class="total-price">
        ¥{{ order.totalAmount.toFixed(2) }}
      </text>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <view class="cancel-btn" @click="handleCancel">
        <text class="btn-text">
          取消订单
        </text>
      </view>
      <view class="pay-btn" @click="handlePay">
        <text class="btn-text">
          立即支付
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['pay', 'cancel']);

const countdown = ref(props.order.countdown);
let timer = null;

// 格式化倒计时
function formatCountdown(seconds) {
  if (seconds <= 0) {
    return '已超时';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// 开始倒计时
function startCountdown() {
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    }
    else {
      clearInterval(timer);
    }
  }, 1000);
}

// 处理支付
function handlePay() {
  emit('pay', props.order);
}

// 处理取消
function handleCancel() {
  emit('cancel', props.order);
}

onMounted(() => {
  startCountdown();
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped lang='scss'>
.pending-item {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .order-info {
    flex: 1;

    .order-no {
      display: block;
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 8rpx;
    }

    .create-time {
      font-size: 24rpx;
      color: #999;
    }
  }

  .countdown {
    .countdown-text {
      font-size: 24rpx;
      color: #ff4757;
      background-color: #fff2f0;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      border: 1rpx solid #ffccc7;
    }
  }
}

.product-list {
  margin-bottom: 30rpx;

  .product-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .product-image {
      margin-right: 20rpx;
    }

    .product-info {
      flex: 1;

      .product-title {
        font-size: 28rpx;
        color: #333;
        line-height: 1.4;
        margin-bottom: 8rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .product-specs {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 12rpx;
      }

      .product-price {
        display: flex;
        align-items: baseline;
        gap: 8rpx;

        .price-symbol {
          font-size: 24rpx;
          color: #ff4757;
        }

        .price-value {
          font-size: 28rpx;
          color: #ff4757;
          font-weight: 600;
        }

        .quantity {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
}

.order-total {
  text-align: right;
  margin-bottom: 30rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;

  .total-label {
    font-size: 28rpx;
    color: #333;
  }

  .total-price {
    font-size: 32rpx;
    color: #ff4757;
    font-weight: 600;
  }
}

.action-buttons {
  display: flex;
  gap: 20rpx;

  .cancel-btn,
  .pay-btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-text {
      font-size: 28rpx;
      font-weight: 500;
    }

    &:active {
      opacity: 0.8;
    }
  }

  .cancel-btn {
    background-color: #f5f5f5;
    border: 1rpx solid #e0e0e0;

    .btn-text {
      color: #666;
    }
  }

  .pay-btn {
    background-color: #4F95FF;

    .btn-text {
      color: #fff;
    }
  }
}
</style>
