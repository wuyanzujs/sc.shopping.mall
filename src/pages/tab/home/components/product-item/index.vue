<template>
  <view class="product-item" @click="handleClick">
    <!-- 商品图片容器 -->
    <view class="image-container">
      <image class="product-image" :src="props.image" mode="aspectFill" :lazy-load="true" @error="handleImageError" />
      <!-- 商品标签 -->
      <view v-if="props.tag" class="product-tag">
        {{ props.tag }}
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="product-info">
      <!-- 商品标题 -->
      <view class="product-title">
        {{ props.title }}
      </view>

      <!-- 商品描述 -->
      <view v-if="props.description" class="product-description">
        {{ props.description }}
      </view>

      <!-- 价格区域 -->
      <view class="price-container">
        <view class="current-price">
          <text class="price-symbol">
            ¥
          </text>
          <text class="price-value">
            {{ formatPrice(props.price) }}
          </text>
        </view>
        <view v-if="props.originalPrice && props.originalPrice > props.price" class="original-price">
          ¥{{ formatPrice(props.originalPrice) }}
        </view>
      </view>

      <!-- 操作按钮 -->
      <!-- <view v-if="showActions" class="action-buttons">
        <view class="add-cart-btn" @click.stop="handleAddToCart">
          <text class="btn-text">
            加购物车
          </text>
        </view>
      </view> -->
    </view>
  </view>
</template>

<script lang="ts" setup>
interface ProductProps {
  title?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  description?: string;
  tag?: string;
  sales?: number;
  showActions?: boolean;
}

const props = withDefaults(defineProps<ProductProps>(), {
  title: '',
  price: 0,
  originalPrice: 0,
  image: '',
  description: '',
  tag: '',
  sales: 0,
  showActions: true,
});

const emit = defineEmits<{
  click: [product: ProductProps];
}>();

// 格式化价格
function formatPrice(price: number): string {
  return price.toFixed(2);
}

// 处理图片加载错误
function handleImageError() {
  console.log('图片加载失败');
  // 可以设置默认图片
}

// 处理商品点击
function handleClick() {
  emit('click', props);
}

// // 处理加入购物车
// function handleAddToCart() {
//   emit('add-to-cart', props);
//   // uni.showToast({
//   //   title: '已加入购物车',
//   //   icon: 'success',
//   //   duration: 1500,
//   // });
// }
</script>

<style scoped lang='scss'>
.product-item {
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

.image-container {
  position: relative;
  width: 100%;
  height: 300rpx;
  overflow: hidden;

  .product-image {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
  }

  .product-tag {
    position: absolute;
    top: 16rpx;
    left: 16rpx;
    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
    color: #fff;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    font-size: 20rpx;
    font-weight: 500;
  }
}

.product-info {
  padding: 24rpx;
}

.product-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  overflow: hidden;
}

.product-description {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  overflow: hidden;
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  margin-bottom: 16rpx;

  .current-price {
    display: flex;
    align-items: baseline;

    .price-symbol {
      font-size: 24rpx;
      color: #ff4757;
      font-weight: 500;
    }

    .price-value {
      font-size: 32rpx;
      color: #ff4757;
      font-weight: 600;
    }
  }

  .original-price {
    font-size: 24rpx;
    color: #999;
    text-decoration: line-through;
  }
}

.product-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;

  .sales {
    font-size: 22rpx;
    color: #999;
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 8rpx;

    .rating-stars {
      font-size: 24rpx;
      color: #ffa502;
    }

    .rating-value {
      font-size: 22rpx;
      color: #666;
    }
  }
}

.action-buttons {
  .add-cart-btn {
    width: 100%;
    height: 64rpx;
    background-image: linear-gradient(135deg, #3fa5ec 30%, #4F95FF 100%);
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-text {
      color: #fff;
      font-size: 26rpx;
      font-weight: 500;
    }

    &:active {
      opacity: 0.8;
    }
  }
}
</style>
