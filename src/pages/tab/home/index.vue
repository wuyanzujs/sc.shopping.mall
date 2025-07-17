<template>
  <scroll-view
    class="page-wrap"
    scroll-y
    :refresher-enabled="true"
    :refresher-triggered="refreshing"
    lower-threshold="150"
    @scrolltolower="loadMore"
    @refresherrefresh="onRefresh"
  >
    <up-input
      placeholder="搜索"
      prefix-icon="search"
      shape="circle"
      border="none"
      font-size="16"
      prefix-icon-style="font-size: 48rpx;margin-left: 20rpx;"
      custom-style="margin: 20rpx 0; background-color: #e8e8e8;height: 80rpx;"
      @click="handleSearch"
    />

    <up-swiper
      :list="list3"
      indicator
      indicator-mode="line"
      circular
      radius="8"
      height="200"
      indicator-color="#fff"
      indicator-active-color="#fff"
    />

    <!-- 商品网格 -->
    <ProductGrid
      v-if="products.length > 0"
      :products="products"
      :columns="2"
      gap="20rpx"
      :custom-style="{ marginTop: '20rpx' }"
    >
      <template #default="{ item }">
        <ProductItem
          :title="item.name"
          :price="item.price_new"
          :original-price="item.price_old"
          :image="item.images?.[0]"
          :description="item.description"
          :tag="item.specs"
          :sales="Math.floor(Math.random() * 1000) + 100"
          @click="handleProductClick(item)"
        />
      </template>
    </ProductGrid>

    <!-- 空状态 -->
    <view v-else-if="!loading && !error" class="empty-state">
      <up-empty text="暂无商品数据" mode="list" />
      <up-button
        type="primary"
        size="small"
        custom-style="margin-top: 20rpx;"
        @click="retry"
      >
        重新加载
      </up-button>
    </view>

    <!-- 错误状态 -->
    <view v-if="error" class="error-state">
      <text class="error-text">
        {{ error }}
      </text>
      <up-button
        type="primary"
        size="small"
        custom-style="margin-top: 20rpx;"
        @click="retry"
      >
        重试
      </up-button>
    </view>

    <!-- 加载更多状态 -->
    <view v-if="products.length > 0" class="load-more">
      <view v-if="loading" class="loading">
        <up-loading-icon mode="circle" size="24" />
        <text class="loading-text">
          加载中...
        </text>
      </view>
      <view v-else-if="!productStore.hasMore" class="no-more">
        <text class="no-more-text">
          我也是有底线的~
        </text>
      </view>
    </view>

    <agree-privacy v-model="showAgreePrivacy" :disable-check-privacy="false" @agree="handleAgree" />
  </scroll-view>
</template>

<script setup lang="ts">
import type { Product } from '@/api/product/types';
import ProductGrid from '@/components/product-grid/index.vue';
import { useProductStore } from '@/store';
import ProductItem from './components/product-item/index.vue';

const productStore = useProductStore();
// const cartStore = useCartStore();
// const userStore = useUserStore();

// 响应式数据
const products = computed(() => productStore.products);
const loading = computed(() => productStore.loading);
const error = ref('');
const refreshing = ref(false);

const list3 = ref([
  'https://picsum.photos/400/300?random=31',
  'https://picsum.photos/400/300?random=32',
]);

const showAgreePrivacy = ref(false);

// 加载数据
const loadData = async (refresh = false) => {
  try {
    error.value = '';
    await productStore.getProductListOrItem({}, refresh);
  }
  catch (err: any) {
    error.value = err.message || '获取商品数据失败';
    uni.showToast({
      title: error.value,
      icon: 'error',
    });
  }
};

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  try {
    await loadData(true);
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
    });
  }
  catch (err) {
    console.log('[ err ] >', err);
    // 错误已在 loadData 中处理
  }
  finally {
    refreshing.value = false;
  }
};

// 触底加载更多
const loadMore = async () => {
  if (!productStore.hasMore || loading.value) return;

  try {
    await productStore.loadMoreProducts();
  }
  catch (err: any) {
    uni.showToast({
      title: err.message || '加载更多失败',
      icon: 'error',
    });
  }
};

// 重试
const retry = async () => {
  await loadData(true);
};

// 搜索处理
const handleSearch = () => {
  uni.navigateTo({
    url: '/pages/search/index',
  });
};
// 同意隐私协议
function handleAgree() {
  console.log('同意隐私政策');
}

// 处理商品点击
function handleProductClick(product: Product) {
  uni.navigateTo({
    url: `/pages/product/detail/index?id=${product.uuid}`,
  });
}

// 页面加载时获取数据
onMounted(async () => {
  await loadData();
});
</script>

<style lang="scss" scoped>
.page-wrap {
  padding: 0 20rpx;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.empty-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
  text-align: center;
}

.empty-text,
.error-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.error-text {
  color: #ff4757;
}

.load-more {
  padding: 10rpx 0;
  text-align: center;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.loading-text {
  font-size: 24rpx;
  color: #666;
}

.no-more {
  padding: 20rpx 0;
}

.no-more-text {
  font-size: 24rpx;
  color: #999;
}
</style>
