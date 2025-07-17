<template>
  <view class="product-detail">
    <!-- 商品图片轮播 -->
    <view class="image-section">
      <swiper
        class="product-swiper"
        :indicator-dots="true"
        :autoplay="false"
        :circular="true"
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#fff"
      >
        <swiper-item v-for="(image, index) in product.images" :key="index">
          <image
            class="product-image"
            :src="image"
            mode="aspectFill"
            @click="previewImage(index)"
          />
        </swiper-item>
      </swiper>
    </view>

    <!-- 商品基本信息 -->
    <view class="product-info">
      <view class="price-section">
        <view class="current-price">
          <text class="price-symbol">
            ¥
          </text>
          <text class="price-value">
            {{ formatPrice(selectedSku.price || product.price_new) }}
          </text>
        </view>
        <view v-if="product.price_old && product.price_old > product.price_new" class="original-price">
          ¥{{ formatPrice(product.price_old) }}
        </view>
      </view>

      <view class="title-section">
        <text class="product-title">
          {{ product.name }}
        </text>
        <text class="product-subtitle">
          {{ product.description }}
        </text>
      </view>
    </view>

    <!-- 规格选择 -->
    <!-- <view v-if="product.specs && product.specs.length > 0" class="spec-section">
      <view v-for="spec in product.specs" :key="spec.name" class="spec-group">
        <text class="spec-name">
          {{ spec.name }}
        </text>
        <view class="spec-options">
          <view
            v-for="option in spec.options"
            :key="option.value"
            class="spec-option"
            :class="{ active: selectedSpecs[spec.name] === option.value, disabled: option.disabled }"
            @click="selectSpec(spec.name, option.value)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>
    </view> -->

    <!-- 数量选择区域 -->
    <view class="quantity-section">
      <text class="quantity-label">
        数量
      </text>
      <view class="quantity-controls">
        <view class="quantity-btn" :class="{ disabled: quantity <= 1 }" @click="decreaseQuantity">
          -
        </view>
        <input
          v-model="quantity"
          class="quantity-input"
          type="number"
          :max="product.stock"
          min="1"
        />
        <view class="quantity-btn" :class="{ disabled: quantity >= product.stock }" @click="increaseQuantity">
          +
        </view>
      </view>
      <text class="stock-info">
        库存{{ product.stock }}件
      </text>
    </view>

    <!-- 服务保障 -->
    <!-- <view class="service-section">
      <view class="service-title">
        服务保障
      </view>
      <view class="service-list">
        <view v-for="service in product.services" :key="service" class="service-item">
          <text class="iconfont icon-check" />
          <text class="service-text">
            {{ service }}
          </text>
        </view>
      </view>
    </view> -->

    <!-- 商品详情 -->
    <view class="detail-section">
      <view class="detail-tabs">
        <view
          v-for="tab in detailTabs"
          :key="tab.key"
          class="detail-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </view>
      </view>

      <view class="detail-content">
        <view v-if="activeTab === 'description'" class="description-content">
          <rich-text :nodes="product.description" />
        </view>

        <view v-if="activeTab === 'params'" class="params-content">
          <view v-for="param in product.specs" :key="param" class="param-item">
            <text class="param-name">
              {{ param }}
            </text>
            <text class="param-value">
              {{ param }}
            </text>
          </view>
        </view>

        <!-- <view v-if="activeTab === 'reviews'" class="reviews-content">
          <view v-for="review in product.reviews" :key="review.id" class="review-item">
            <view class="review-header">
              <image class="reviewer-avatar" :src="review.avatar" />
              <view class="reviewer-info">
                <text class="reviewer-name">
                  {{ review.name }}
                </text>
                <view class="review-rating">
                  <text v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">
                    ★
                  </text>
                </view>
              </view>
              <text class="review-date">
                {{ formatDate(review.date) }}
              </text>
            </view>
            <text class="review-content">
              {{ review.content }}
            </text>
            <view v-if="review.images" class="review-images">
              <image
                v-for="img in review.images"
                :key="img"
                class="review-image"
                :src="img"
                @click="previewReviewImage(review.images, img)"
              />
            </view>
          </view>
        </view> -->
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="action-right">
        <view class="add-to-cart-btn" @click="addToCart">
          <image class="icon" src="/src/static/images/icon-add-cart.png" alt="" />
        </view>
        <view class="buy-now-btn">
          去购买
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-overlay">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Product } from '@/api/product/types';
import { getProductListOrItemApi } from '@/api/product';
import { useCartStore, useUserStore } from '@/store';

// 响应式数据
const productId = ref('');
const loading = ref(false);
const selectedSpecs = ref<Record<string, string>>({});
const activeTab = ref('description');
const quantity = ref(1);

// 获取store实例
const userStore = useUserStore();
const cartStore = useCartStore();

// 商品详情数据 - 使用API定义的Product类型
const product = ref<Product>({
  uuid: '',
  name: '',
  price_new: 0,
  price_old: 0,
  description: '',
  specs: '',
  stock: 0,
  images: [],
  create_tm: '',
  update_tm: null,
  category: null,
  deleted: false,
  type: 0,
  type_id: '',
  agent_id: '',
});

// 详情页标签
const detailTabs = [
  { key: 'description', label: '商品详情' },
  { key: 'params', label: '规格参数' },
  { key: 'reviews', label: '用户评价' },
];

// 获取商品详情
async function getProductDetail(id: string) {
  if (!id) return;

  loading.value = true;
  try {
    const res = await getProductListOrItemApi({ categoryId: id });

    if (res.rows && res.rows.length > 0) {
      const productData = res.rows[0];
      // 直接使用API返回的数据结构
      product.value = productData;
    }
    else {
      uni.showToast({
        title: '商品不存在',
        icon: 'none',
      });
    }
  }
  catch (error) {
    console.error('获取商品详情失败:', error);
    uni.showToast({
      title: '获取商品详情失败',
      icon: 'none',
    });
  }
  finally {
    loading.value = false;
  }
}

// 页面加载时获取商品详情
onLoad((options: any) => {
  console.log('options', options.id);
  productId.value = options.id || '';

  if (productId.value) {
    getProductDetail(productId.value);
  }
});

// 计算当前选中的SKU
const selectedSku = computed(() => {
  return {
    price: product.value.price_new,
    stock: product.value.stock,
  };
});

// 格式化价格
function formatPrice(price: number): string {
  return price.toFixed(2);
}

// 预览图片
function previewImage(index: number) {
  if (product.value.images && product.value.images.length > 0) {
    uni.previewImage({
      urls: product.value.images,
      current: index,
    });
  }
}

// 增加数量
function increaseQuantity() {
  if (quantity.value < product.value.stock) {
    quantity.value++;
  }
  else {
    uni.showToast({
      title: '库存不足',
      icon: 'none',
    });
  }
}

// 减少数量
function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

// 加入购物车
async function addToCart() {
  if (!userStore.uuid && !userStore.user_id) {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    });
    return;
  }

  if (quantity.value > product.value.stock) {
    uni.showToast({
      title: '库存不足',
      icon: 'none',
    });
    return;
  }

  try {
    const item = {
      productId: product.value.uuid, // 使用uuid作为productId
      quantity: quantity.value,
    };

    cartStore.addToCart(item, userStore.uuid);

    uni.showToast({
      title: '已加入购物车',
      icon: 'success',
    });

    selectedSpecs.value = {};
    quantity.value = 1;
  }
  catch (error) {
    console.error('添加到购物车失败:', error);
    uni.showToast({
      title: '添加失败，请重试',
      icon: 'none',
    });
  }
}
</script>

<style lang="scss" scoped>
.product-detail {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.image-section {
  position: relative;
  background-color: #fff;

  .product-swiper {
    height: 750rpx;

    .product-image {
      width: 100%;
      height: 100%;
    }
  }

  .favorite-btn, .share-btn {
    position: absolute;
    top: 40rpx;
    width: 80rpx;
    height: 80rpx;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .favorite-btn {
    right: 120rpx;

    .icon-heart-fill {
      color: #ff4757;
    }
  }

  .share-btn {
    right: 30rpx;
  }
}

.product-info {
  background-color: #fff;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;

  .price-section {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;

    .current-price {
      display: flex;
      align-items: baseline;
      margin-right: 20rpx;

      .price-symbol {
        font-size: 32rpx;
        color: #ff4757;
        font-weight: 600;
      }

      .price-value {
        font-size: 48rpx;
        color: #ff4757;
        font-weight: 700;
      }
    }

    .original-price {
      font-size: 28rpx;
      color: #999;
      text-decoration: line-through;
      margin-right: 20rpx;
    }

    .product-tag {
      background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
      color: #fff;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      font-size: 24rpx;
    }
  }

  .title-section {
    margin-bottom: 30rpx;

    .product-title {
      display: block;
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
      line-height: 1.4;
      margin-bottom: 10rpx;
    }

    .product-subtitle {
      display: block;
      font-size: 28rpx;
      color: #666;
      line-height: 1.4;
    }
  }

  .stats-section {
    display: flex;

    .stat-item {
      flex: 1;
      text-align: center;

      .stat-label {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 10rpx;
      }

      .stat-value {
        display: block;
        font-size: 28rpx;
        color: #333;
        font-weight: 600;
      }
    }
  }
}

.spec-section {
  background-color: #fff;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;

  .spec-group {
    margin-bottom: 40rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .spec-name {
      display: block;
      font-size: 32rpx;
      color: #333;
      font-weight: 600;
      margin-bottom: 20rpx;
    }

    .spec-options {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;

      .spec-option {
        padding: 16rpx 32rpx;
        border: 2rpx solid #e0e0e0;
        border-radius: 8rpx;
        font-size: 28rpx;
        color: #666;
        background-color: #fff;

        &.active {
          border-color: #667eea;
          color: #667eea;
          background-color: #f0f2ff;
        }

        &.disabled {
          opacity: 0.5;
          pointer-events: none;
        }
      }
    }
  }
}

.service-section {
  background-color: #fff;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;

  .service-title {
    font-size: 32rpx;
    color: #333;
    font-weight: 600;
    margin-bottom: 20rpx;
  }

  .service-list {
    .service-item {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .iconfont {
        font-size: 24rpx;
        color: #52c41a;
        margin-right: 16rpx;
      }

      .service-text {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
}

.detail-section {
  background-color: #fff;

  .detail-tabs {
    display: flex;
    border-bottom: 2rpx solid #f0f0f0;

    .detail-tab {
      flex: 1;
      text-align: center;
      padding: 30rpx 0;
      font-size: 28rpx;
      color: #666;
      position: relative;

      &.active {
        color: #667eea;
        font-weight: 600;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60rpx;
          height: 4rpx;
          background-color: #667eea;
          border-radius: 2rpx;
        }
      }
    }
  }

  .detail-content {
    padding: 40rpx 30rpx;

    .description-content {
      line-height: 1.6;
    }

    .params-content {
      .param-item {
        display: flex;
        justify-content: space-between;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f0f0f0;

        .param-name {
          font-size: 28rpx;
          color: #666;
        }

        .param-value {
          font-size: 28rpx;
          color: #333;
        }
      }
    }

    .reviews-content {
      .review-item {
        padding: 30rpx 0;
        border-bottom: 1rpx solid #f0f0f0;

        .review-header {
          display: flex;
          align-items: center;
          margin-bottom: 20rpx;

          .reviewer-avatar {
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
            margin-right: 20rpx;
          }

          .reviewer-info {
            flex: 1;

            .reviewer-name {
              display: block;
              font-size: 28rpx;
              color: #333;
              margin-bottom: 8rpx;
            }

            .review-rating {
              .star {
                font-size: 24rpx;
                color: #ddd;

                &.filled {
                  color: #ffa502;
                }
              }
            }
          }

          .review-date {
            font-size: 24rpx;
            color: #999;
          }
        }

        .review-content {
          font-size: 28rpx;
          color: #666;
          line-height: 1.5;
          margin-bottom: 20rpx;
        }

        .review-images {
          display: flex;
          gap: 16rpx;

          .review-image {
            width: 120rpx;
            height: 120rpx;
            border-radius: 8rpx;
          }
        }
      }
    }
  }
}

.quantity-section {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #fff;
  margin-bottom: 20rpx;

  .quantity-label {
    font-size: 32rpx;
    margin-right: 40rpx;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    margin-right: 40rpx;

    .quantity-btn {
      width: 60rpx;
      height: 60rpx;
      border: 1rpx solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;

      &.disabled {
        color: #ccc;
        background: #f5f5f5;
      }
    }

    .quantity-input {
      width: 100rpx;
      height: 60rpx;
      border: 1rpx solid #ddd;
      border-left: none;
      border-right: none;
      text-align: center;
      font-size: 28rpx;
    }
  }

  .stock-info {
    font-size: 24rpx;
    color: #999;
  }
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #e0e0e0;
  display: flex;
  align-items: center;
  z-index: 100;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);

  .action-left{  }

  .action-right{
    display: flex;
    margin-left: auto;
    width:400rpx;
    height: 100rpx;
    border: #ff4757;
    .add-to-cart-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80rpx;
      width: 140rpx;
      background-image:  linear-gradient(90deg, #70c4ff 30%, #60c4ff 100%);
      color: #fff;
      font-size: 32rpx;
      border-radius: 20rpx 0 0 20rpx;
      .icon{
        width: 60rpx;
        height: 60rpx;
      }
    }
    .buy-now-btn{
      background-image:  linear-gradient(90deg, #3fa5ec 30%, #4F95FF 100%);
      color: #fff;
      font-size: 32rpx;
      border-radius: 0 20rpx 20rpx 0;
      height: 80rpx;
      flex:1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  text {
    font-size: 32rpx;
    color: #666;
  }
}
</style>
