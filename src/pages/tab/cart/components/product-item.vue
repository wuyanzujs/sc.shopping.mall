<template>
  <view class="cart-item">
    <view class="item-checkbox">
      <!-- <up-checkbox
        :model-value="item.selected"
        shape="circle"
        active-color="#21d59d"
        @change="handleSelectChange"
      /> -->
      <Checkbox
        :model-value="item.selected"
        @change="handleSelectChange"
      />
    </view>

    <view class="item-image">
      <up-image :src="item.image" width="160rpx" height="160rpx" border-radius="8rpx" />
    </view>

    <view class="item-content">
      <view class="item-title">
        {{ item.title }}
      </view>
      <view v-if="item.specs" class="item-specs">
        <text class="spec-text">
          {{ item.specs }}
        </text>
      </view>
      <view class="item-bottom">
        <view class="item-price">
          <text class="price-symbol">
            ¥
          </text>
          <text class="price-value">
            {{ item.price.toFixed(2) }}
          </text>
        </view>
        <view class="quantity-control">
          <view
            class="quantity-btn"
            :class="{ disabled: item.quantity <= 1 }"
            @click="handleDecrease"
          >
            <up-icon
              name="minus"
              size="14"
              :color="item.quantity <= 1 ? '#ccc' : '#666'"
            />
          </view>
          <view class="quantity-input">
            <text class="quantity-text">
              {{ item.quantity }}
            </text>
          </view>
          <view class="quantity-btn" @click="handleIncrease">
            <up-icon name="plus" size="14" color="#666" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import Checkbox from '@/components/checkbox/index.vue';
// 获取 props
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['select-change', 'quantity-decrease', 'quantity-increase']);

function handleSelectChange(value) {
  emit('select-change', value);
}

function handleDecrease() {
  if (props.item.quantity <= 1) {
    return;
  }
  emit('quantity-decrease');
}

function handleIncrease() {
  emit('quantity-increase');
}
</script>

<style scoped lang="scss">
.cart-item {
  background-color: #fff;
  padding: 30rpx;
  display: flex;
  align-items: flex-start;
  border-bottom: 1rpx solid #f0f0f0;

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

      .item-price {
        display: flex;
        align-items: baseline;

        .price-symbol {
          font-size: 24rpx;
          color: #ff4757;
        }

        .price-value {
          font-size: 32rpx;
          font-weight: 600;
          color: #ff4757;
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
          }
        }
      }
    }
  }
}
</style>
