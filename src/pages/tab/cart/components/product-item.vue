<template>
  <view class="cart-item">
    <view class="item-checkbox">
      <Checkbox :model-value="item.selected === 1" @change="handleSelectChange" />
    </view>

    <view class="item-image">
      <up-image
        :src="item.productImage[0]" width="160rpx" height="160rpx" border-radius="8rpx"
        @click="handleImageClick"
      />
    </view>

    <view class="item-content">
      <view class="item-title" @click="handleTitleClick">
        {{ item.productName }}
      </view>

      <view v-if="item.specs" class="item-specs">
        <text class="spec-text">
          {{ formatSpecs(item.specs) }}
        </text>
      </view>

      <view class="item-bottom">
        <view class="item-price">
          <text class="price-symbol">
            ¥
          </text>
          <text class="price-value">
            {{ item.price_new.toFixed(2) }}
          </text>
          <!-- <text v-if="item.originalPrice && item.originalPrice > item.price_new" class="original-price">
            ¥{{ item.originalPrice.toFixed(2) }}
          </text> -->
        </view>

        <view class="quantity-control">
          <view class="quantity-btn" :class="{ disabled: item.quantity <= 1 }" @click="handleDecrease">
            <up-icon name="minus" size="14" :color="item.quantity <= 1 ? '#ccc' : '#666'" />
          </view>

          <view class="quantity-input">
            <input
              class="quantity-text" type="number" :value="`${item.quantity}`" @blur="handleQuantityInput"
              @confirm="handleQuantityInput"
            />
          </view>

          <view class="quantity-btn" :class="{ disabled: item.quantity >= item.stock }" @click="handleIncrease">
            <up-icon name="plus" size="14" :color="item.quantity >= item.stock ? '#ccc' : '#666'" />
          </view>
        </view>
      </view>

      <!-- 库存提示 -->
      <view v-if="item.stock <= 10" class="stock-warning">
        <text class="stock-text">
          仅剩{{ item.stock }}件
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CartItem } from '@/api/cart/types';
import Checkbox from '@/components/checkbox/index.vue';

interface Props {
  item: CartItem;
}

const props = defineProps<Props>();
const emit = defineEmits(['select-change', 'quantity-decrease', 'quantity-increase', 'quantity-input']);

// 格式化规格
const formatSpecs = (specs: Record<string, string> | undefined) => {
  if (!specs) return '';
  return Object.values(specs).join(' ');
};

// 处理选中状态变化
const handleSelectChange = (value: boolean) => {
  emit('select-change', value);
};

// 处理减少数量
const handleDecrease = () => {
  if (props.item.quantity <= 1) return;
  emit('quantity-decrease');
};

// 处理增加数量
const handleIncrease = () => {
  if (props.item.quantity >= props.item.stock) {
    uni.showToast({
      title: '库存不足',
      icon: 'none',
    });
    return;
  }
  emit('quantity-increase');
};

// 处理数量输入
const handleQuantityInput = (e: any) => {
  const value = Number.parseInt(e.detail.value || e.target.value);
  if (Number.isNaN(value) || value < 1) {
    uni.showToast({
      title: '请输入有效数量',
      icon: 'none',
    });
    return;
  }
  if (value > props.item.stock) {
    uni.showToast({
      title: '库存不足',
      icon: 'none',
    });
    return;
  }
  emit('quantity-input', value);
};

// 处理图片点击
const handleImageClick = () => {
  uni.navigateTo({
    url: `/pages/product/detail/index?id=${props.item.productId || props.item.id}`,
  });
};

// 处理标题点击
const handleTitleClick = () => {
  uni.navigateTo({
    url: `/pages/product/detail/index?id=${props.item.productId || props.item.id}`,
  });
};
</script>

<style scoped lang="scss">
.cart-item {
  background-color: #fff;
  padding: 30rpx;
  display: flex;
  align-items: flex-start;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);

  .item-checkbox {
    margin-right: 20rpx;
    padding-top: 10rpx;
  }

  .item-image {
    margin-right: 20rpx;
  }

  .item-content {
    flex: 1;

    .item-title {
      font-size: 30rpx;
      color: #333;
      line-height: 1.4;
      margin-bottom: 10rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .item-specs {
      margin-bottom: 20rpx;

      .spec-text {
        font-size: 24rpx;
        color: #999;
        background-color: #f5f5f5;
        padding: 4rpx 12rpx;
        border-radius: 4rpx;
      }
    }

    .item-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10rpx;

      .item-price {
        display: flex;
        align-items: baseline;
        gap: 10rpx;

        .price-symbol {
          font-size: 24rpx;
          color: #ff4757;
        }

        .price-value {
          font-size: 32rpx;
          font-weight: 600;
          color: #ff4757;
        }

        .original-price {
          font-size: 24rpx;
          color: #999;
          text-decoration: line-through;
        }
      }

      .quantity-control {
        display: flex;
        align-items: center;
        border: 1rpx solid #e0e0e0;
        border-radius: 8rpx;

        .quantity-btn {
          width: 60rpx;
          height: 60rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f8f8;
          transition: all 0.2s ease;

          &:first-child {
            border-radius: 8rpx 0 0 8rpx;
          }

          &:last-child {
            border-radius: 0 8rpx 8rpx 0;
          }

          &:active:not(.disabled) {
            background-color: #e8e8e8;
          }

          &.disabled {
            background-color: #f5f5f5;
            cursor: not-allowed;
            opacity: 0.6;
          }
        }

        .quantity-input {
          width: 80rpx;
          height: 60rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          border-left: 1rpx solid #e0e0e0;
          border-right: 1rpx solid #e0e0e0;

          .quantity-text {
            font-size: 28rpx;
            color: #333;
            text-align: center;
            border: none;
            outline: none;
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .stock-warning {
      .stock-text {
        font-size: 22rpx;
        color: #ff4757;
        background-color: #fff2f2;
        padding: 4rpx 8rpx;
        border-radius: 4rpx;
      }
    }
  }
}
</style>
