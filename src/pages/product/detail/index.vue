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

      <!-- 收藏按钮 -->
      <view class="favorite-btn" @click="toggleFavorite">
        <text class="iconfont" :class="isFavorite ? 'icon-heart-fill' : 'icon-heart'" />
      </view>

      <!-- 分享按钮 -->
      <view class="share-btn" @click="shareProduct">
        <text class="iconfont icon-share" />
      </view>
    </view>

    <!-- 商品基本信息 -->
    <view class="product-info">
      <view class="price-section">
        <view class="current-price">
          <text class="price-symbol">
            ¥
          </text>
          <text class="price-value">
            {{ formatPrice(selectedSku.price || product.price) }}
          </text>
        </view>
        <view v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
          ¥{{ formatPrice(product.originalPrice) }}
        </view>
        <view v-if="product.tag" class="product-tag">
          {{ product.tag }}
        </view>
      </view>

      <view class="title-section">
        <text class="product-title">
          {{ product.title }}
        </text>
        <text class="product-subtitle">
          {{ product.subtitle }}
        </text>
      </view>

      <view class="stats-section">
        <view class="stat-item">
          <text class="stat-label">
            销量
          </text>
          <text class="stat-value">
            {{ product.sales }}
          </text>
        </view>
        <view class="stat-item">
          <text class="stat-label">
            评分
          </text>
          <text class="stat-value">
            {{ product.rating }} ★
          </text>
        </view>
        <view class="stat-item">
          <text class="stat-label">
            库存
          </text>
          <text class="stat-value">
            {{ selectedSku.stock || product.stock }}
          </text>
        </view>
      </view>
    </view>

    <!-- 规格选择 -->
    <view class="spec-section">
      <view v-for="spec in product.specs" :key="spec.name" class="spec-group">
        <text class="spec-title">
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
    </view>

    <!-- 服务保障 -->
    <view class="service-section">
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
    </view>

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
          <view v-for="param in product.params" :key="param.name" class="param-item">
            <text class="param-name">
              {{ param.name }}
            </text>
            <text class="param-value">
              {{ param.value }}
            </text>
          </view>
        </view>

        <view v-if="activeTab === 'reviews'" class="reviews-content">
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
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <view class="action-left">
        <view class="action-btn" @click="contactService">
          <text class="iconfont icon-service" />
          <text class="action-text">
            客服
          </text>
        </view>
        <view class="action-btn" @click="goToCart">
          <text class="iconfont icon-cart" />
          <text class="action-text">
            购物车
          </text>
          <view v-if="cartCount > 0" class="cart-badge">
            {{ cartCount }}
          </view>
        </view>
      </view>

      <view class="action-right">
        <view class="add-cart-btn" @click="addToCart">
          加入购物车
        </view>
        <view class="buy-now-btn" @click="buyNow">
          立即购买
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface ProductSku {
  id: string;
  price: number;
  stock: number;
  specs: Record<string, string>;
}

interface ProductSpec {
  name: string;
  options: Array<{
    label: string;
    value: string;
    disabled?: boolean;
  }>;
}

interface ProductDetail {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  tag?: string;
  images: string[];
  sales: number;
  rating: number;
  stock: number;
  specs: ProductSpec[];
  skus: ProductSku[];
  services: string[];
  description: string;
  params: Array<{ name: string; value: string }>;
  reviews: Array<{
    id: string;
    name: string;
    avatar: string;
    rating: number;
    content: string;
    date: string;
    images?: string[];
  }>;
}

// 获取路由参数
const route = getCurrentPages()[getCurrentPages().length - 1];
const productId = route.options?.id || '1';

// 响应式数据
const isFavorite = ref(false);
const selectedSpecs = ref<Record<string, string>>({});
const activeTab = ref('description');
const cartCount = ref(3);

// 详情页标签
const detailTabs = [
  { key: 'description', label: '商品详情' },
  { key: 'params', label: '规格参数' },
  { key: 'reviews', label: '用户评价' },
];

// 模拟商品数据
const product = ref<ProductDetail>({
  id: productId,
  title: 'iPhone 15 Pro Max 256GB',
  subtitle: '钛金属设计 | A17 Pro芯片 | 专业级摄像系统',
  price: 9999.00,
  originalPrice: 10999.00,
  tag: '热销',
  images: [
    'https://fastly.picsum.photos/id/459/600/600.jpg?hmac=test1',
    'https://fastly.picsum.photos/id/570/600/600.jpg?hmac=test2',
    'https://fastly.picsum.photos/id/180/600/600.jpg?hmac=test3',
    'https://fastly.picsum.photos/id/292/600/600.jpg?hmac=test4',
  ],
  sales: 1580,
  rating: 4.8,
  stock: 99,
  specs: [
    {
      name: '颜色',
      options: [
        { label: '原色钛金属', value: 'natural' },
        { label: '蓝色钛金属', value: 'blue' },
        { label: '白色钛金属', value: 'white' },
        { label: '黑色钛金属', value: 'black' },
      ],
    },
    {
      name: '容量',
      options: [
        { label: '128GB', value: '128gb' },
        { label: '256GB', value: '256gb' },
        { label: '512GB', value: '512gb' },
        { label: '1TB', value: '1tb' },
      ],
    },
  ],
  skus: [
    { id: '1', price: 8999, stock: 50, specs: { 颜色: 'natural', 容量: '128gb' } },
    { id: '2', price: 9999, stock: 30, specs: { 颜色: 'natural', 容量: '256gb' } },
    { id: '3', price: 11999, stock: 20, specs: { 颜色: 'natural', 容量: '512gb' } },
    { id: '4', price: 13999, stock: 10, specs: { 颜色: 'natural', 容量: '1tb' } },
  ],
  services: [
    '7天无理由退货',
    '15天免费换货',
    '全国联保',
    '免费配送',
    '正品保证',
  ],
  description: '<p>iPhone 15 Pro Max 采用钛金属设计，搭载 A17 Pro 芯片...</p>',
  params: [
    { name: '品牌', value: 'Apple' },
    { name: '型号', value: 'iPhone 15 Pro Max' },
    { name: '屏幕尺寸', value: '6.7英寸' },
    { name: '操作系统', value: 'iOS 17' },
    { name: '处理器', value: 'A17 Pro' },
    { name: '机身材质', value: '钛金属' },
  ],
  reviews: [
    {
      id: '1',
      name: '张***',
      avatar: 'https://fastly.picsum.photos/id/64/50/50.jpg',
      rating: 5,
      content: '手机很不错，钛金属质感很好，拍照效果也很棒！',
      date: '2024-01-15',
      images: ['https://fastly.picsum.photos/id/100/200/200.jpg'],
    },
    {
      id: '2',
      name: '李***',
      avatar: 'https://fastly.picsum.photos/id/65/50/50.jpg',
      rating: 4,
      content: '性能很强，就是价格有点贵，不过物有所值。',
      date: '2024-01-10',
    },
  ],
});

// 计算当前选中的SKU
const selectedSku = computed(() => {
  return product.value.skus.find((sku) => {
    return Object.keys(selectedSpecs.value).every(key =>
      sku.specs[key] === selectedSpecs.value[key],
    );
  }) || { price: product.value.price, stock: product.value.stock };
});

// 格式化价格
function formatPrice(price: number): string {
  return price.toFixed(2);
}

// 格式化日期
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

// 选择规格
function selectSpec(specName: string, value: string) {
  selectedSpecs.value[specName] = value;
}

// 预览图片
function previewImage(index: number) {
  uni.previewImage({
    urls: product.value.images,
    current: index,
  });
}

// 预览评价图片
function previewReviewImage(images: string[], current: string) {
  uni.previewImage({
    urls: images,
    current,
  });
}

// 切换收藏
function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
  uni.showToast({
    title: isFavorite.value ? '已收藏' : '已取消收藏',
    icon: 'none',
  });
}

// 分享商品
function shareProduct() {
  uni.share({
    provider: 'weixin',
    type: 0,
    title: product.value.title,
    summary: product.value.subtitle,
    imageUrl: product.value.images[0],
  });
}

// 联系客服
function contactService() {
  uni.showToast({
    title: '正在连接客服...',
    icon: 'loading',
  });
}

// 跳转购物车
function goToCart() {
  uni.navigateTo({
    url: '/pages/cart/index',
  });
}

// 加入购物车
function addToCart() {
  if (Object.keys(selectedSpecs.value).length < product.value.specs.length) {
    uni.showToast({
      title: '请选择完整规格',
      icon: 'none',
    });
    return;
  }

  cartCount.value++;
  uni.showToast({
    title: '已加入购物车',
    icon: 'success',
  });
}

// 立即购买
function buyNow() {
  if (Object.keys(selectedSpecs.value).length < product.value.specs.length) {
    uni.showToast({
      title: '请选择完整规格',
      icon: 'none',
    });
    return;
  }

  uni.navigateTo({
    url: `/pages/order/confirm?productId=${product.value.id}&skuId=${selectedSku.value.id}`,
  });
}

// 页面加载时初始化默认规格
onMounted(() => {
  product.value.specs.forEach((spec) => {
    if (spec.options.length > 0) {
      selectedSpecs.value[spec.name] = spec.options[0].value;
    }
  });
});
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

    .iconfont {
      font-size: 40rpx;
      color: #fff;
    }
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

    .spec-title {
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

.bottom-actions {
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

  .action-left {
    display: flex;
    margin-right: 30rpx;

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 40rpx;
      position: relative;

      .iconfont {
        font-size: 40rpx;
        color: #666;
        margin-bottom: 8rpx;
      }

      .action-text {
        font-size: 20rpx;
        color: #666;
      }

      .cart-badge {
        position: absolute;
        top: -8rpx;
        right: -8rpx;
        background-color: #ff4757;
        color: #fff;
        font-size: 18rpx;
        padding: 4rpx 8rpx;
        border-radius: 20rpx;
        min-width: 32rpx;
        text-align: center;
      }
    }
  }

  .action-right {
    flex: 1;
    display: flex;
    gap: 20rpx;

    .add-cart-btn, .buy-now-btn {
      flex: 1;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      font-weight: 600;
    }

    .add-cart-btn {
      background: linear-gradient(135deg, #ffa502, #ff6348);
      color: #fff;
    }

    .buy-now-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
    }
  }
}
</style>
