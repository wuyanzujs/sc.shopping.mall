<template>
  <view class="category-page">
    <!-- 左侧分类菜单 -->
    <view class="category-sidebar">
      <view
        v-for="(category, index) in categories"
        :key="category.id"
        class="category-item"
        :class="{ active: activeCategory === index }"
        @click="selectCategory(index)"
      >
        {{ category.type_name }}
      </view>
    </view>

    <!-- 右侧商品网格 -->
    <view class="product-content">
      <view v-if="loading" class="loading-container">
        <uni-load-more status="loading" />
      </view>
      <view v-else class="product-grid">
        <view
          v-for="(product) in currentProducts"
          :key="product.uuid"
          class="product-item"
          @click="handleProductClick(product)"
        >
          <image
            class="product-image"
            :src="product.images[0] || ''"
            mode="aspectFill"
          />
          <view class="product-info">
            <view class="product-name">
              {{ product.name }}
            </view>
          </view>
        </view>
      </view>
      <view v-if="!loading && currentProducts.length === 0" class="empty-container">
        <up-empty text="暂无商品" mode="list" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CategoryProduct, ProductCategory } from '@/api/product/types';
import { getProductCategoryListApi } from '@/api/product';

const activeCategory = ref(0);
const loading = ref(false);
const categories = ref<ProductCategory[]>([]);

const currentProducts = computed(() => {
  return categories.value[activeCategory.value]?.children || [];
});

// 获取分类列表
async function getCategoryList() {
  loading.value = true;
  try {
    const response = await getProductCategoryListApi();
    if (response.code === 0) {
      categories.value = response.data;
    }
    else {
      uni.showToast({
        title: '获取分类列表失败',
        icon: 'none',
      });
    }
  }
  catch (error) {
    console.error('获取分类列表失败:', error);
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none',
    });
  }
  finally {
    loading.value = false;
  }
}

function selectCategory(index: number) {
  activeCategory.value = index;
}

function handleProductClick(product: CategoryProduct) {
  // 跳转到商品详情页
  uni.navigateTo({
    url: `/pages/product/detail/index?id=${product.uuid}`,
  });
}

// 页面加载时获取分类列表
onMounted(() => {
  getCategoryList();
});
</script>

<style scoped lang="scss">
.category-page {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

.category-sidebar {
  width: 200rpx;
  background-color: #fff;
  border-right: 1rpx solid #eee;

  .category-item {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #333;
    border-bottom: 1rpx solid #f5f5f5;
    position: relative;

    &.active {
      background-color: #f5f5f5;
      color: #4F95FF;
      font-weight: 500;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 40rpx;
        background-color: #4F95FF;
        border-radius: 0 6rpx 6rpx 0;
      }
    }
  }
}

.product-content {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200rpx;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

  &:active {
    transform: scale(0.95);
  }

  .product-image {
    width: 100%;
    height: 200rpx;
    border-radius: 8rpx;
    margin-bottom: 16rpx;
  }

  .product-info {
    .product-name {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 8rpx;
      overflow: hidden;
    }
  }
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
}
</style>
