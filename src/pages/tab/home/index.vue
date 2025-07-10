<template>
  <view class="page-wrap">
    <up-input
      placeholder="搜索"
      prefix-icon="search"
      shape="circle"
      border="none"
      font-size="16"
      prefix-icon-style="font-size: 48rpx;margin-left: 20rpx;"
      custom-style="margin: 20rpx 0; background-color: #f1f1f1;height: 80rpx;"
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

    <!-- 使用封装的商品网格组件 -->
    <ProductGrid :products="products" :columns="2" gap="20rpx" :custom-style="{ marginTop: '20rpx' }">
      <template #default="{ item }">
        <ProductItem
          :title="item.title"
          :price="item.price"
          :original-price="item.originalPrice"
          :image="item.image"
          :description="item.description"
          :tag="item.tag"
          :sales="item.sales"
          :rating="item.rating"
          @click="handleProductClick"
          @add-to-cart="handleAddToCart"
        />
      </template>
    </ProductGrid>

    <agree-privacy v-model="showAgreePrivacy" :disable-check-privacy="false" @agree="handleAgree" />
  </view>
</template>

<script setup lang="ts">
import ProductGrid from '@/components/product-grid/index.vue';
import { useCartStore } from '@/store/modules/cart';
import ProductItem from './components/product-item/index.vue';

const list3 = ref([
  'https://picsum.photos/400/300?random=31',
  'https://picsum.photos/400/300?random=32',
]);

const products = [
  {
    title: 'iPhone 15 Pro Max 256GB',
    price: 9999.00,
    originalPrice: 10999.00,
    image: 'https://picsum.photos/400/300?random=1',
    description: '钛金属设计，A17 Pro芯片，专业级摄像系统',
    tag: '热销',
    sales: 1580,
    rating: 4.8,
  },
  {
    title: 'MacBook Air M2 13英寸',
    price: 8999.00,
    originalPrice: 9999.00,
    image: 'https://picsum.photos/400/300?random=2',
    description: '轻薄便携，M2芯片强劲性能，续航长达18小时',
    tag: '新品',
    sales: 892,
    rating: 4.7,
  },
  {
    title: 'iPhone 15 Pro Max 256GB',
    price: 9999.00,
    originalPrice: 10999.00,
    image: 'https://picsum.photos/400/300?random=3',
    description: '钛金属设计，A17 Pro芯片，专业级摄像系统',
    tag: '热销',
    sales: 1580,
    rating: 4.8,
  },
  {
    title: 'MacBook Air M2 13英寸',
    price: 8999.00,
    originalPrice: 9999.00,
    image: 'https://picsum.photos/400/300?random=4',
    description: '轻薄便携，M2芯片强劲性能，续航长达18小时',
    tag: '新品',
    sales: 892,
    rating: 4.7,
  },
  {
    title: 'iPhone 15 Pro Max 256GB',
    price: 9999.00,
    originalPrice: 10999.00,
    image: 'https://picsum.photos/400/300?random=5',
    description: '钛金属设计，A17 Pro芯片，专业级摄像系统',
    tag: '热销',
    sales: 1580,
    rating: 4.8,
  },
  {
    title: 'MacBook Air M2 13英寸',
    price: 8999.00,
    originalPrice: 9999.00,
    image: 'https://picsum.photos/400/300?random=6',
    description: '轻薄便携，M2芯片强劲性能，续航长达18小时',
    tag: '新品',
    sales: 892,
    rating: 4.7,
  },
  {
    title: 'iPhone 15 Pro Max 256GB',
    price: 9999.00,
    originalPrice: 10999.00,
    image: 'https://picsum.photos/400/300?random=7',
    description: '钛金属设计，A17 Pro芯片，专业级摄像系统',
    tag: '热销',
    sales: 1580,
    rating: 4.8,
  },
  {
    title: 'MacBook Air M2 13英寸',
    price: 8999.00,
    originalPrice: 9999.00,
    image: 'https://picsum.photos/400/300?random=8',
    description: '轻薄便携，M2芯片强劲性能，续航长达18小时',
    tag: '新品',
    sales: 892,
    rating: 4.7,
  },
  {
    title: 'iPhone 15 Pro Max 256GB',
    price: 9999.00,
    originalPrice: 10999.00,
    image: 'https://picsum.photos/400/300?random=9',
    description: '钛金属设计，A17 Pro芯片，专业级摄像系统',
    tag: '热销',
    sales: 1580,
    rating: 4.8,
  },
  {
    title: 'MacBook Air M2 13英寸',
    price: 8999.00,
    originalPrice: 9999.00,
    image: 'https://picsum.photos/400/300?random=10',
    description: '轻薄便携，M2芯片强劲性能，续航长达18小时',
    tag: '新品',
    sales: 892,
    rating: 4.7,
  },
  {
    title: 'iPhone 15 Pro Max 256GB',
    price: 9999.00,
    originalPrice: 10999.00,
    image: 'https://picsum.photos/400/300?random=11',
    description: '钛金属设计，A17 Pro芯片，专业级摄像系统',
    tag: '热销',
    sales: 1580,
    rating: 4.8,
  },
  {
    title: 'MacBook Air M2 13英寸',
    price: 8999.00,
    originalPrice: 9999.00,
    image: 'https://picsum.photos/400/300?random=12',
    description: '轻薄便携，M2芯片强劲性能，续航长达18小时',
    tag: '新品',
    sales: 892,
    rating: 4.7,
  },
  {
    title: 'iPhone 15 Pro Max 256GB',
    price: 9999.00,
    originalPrice: 10999.00,
    image: 'https://picsum.photos/400/300?random=13',
    description: '钛金属设计，A17 Pro芯片，专业级摄像系统',
    tag: '热销',
    sales: 1580,
    rating: 4.8,
  },
  {
    title: 'MacBook Air M2 13英寸',
    price: 8999.00,
    originalPrice: 9999.00,
    image: 'https://picsum.photos/400/300?random=14',
    description: '轻薄便携，M2芯片强劲性能，续航长达18小时',
    tag: '新品',
    sales: 892,
    rating: 4.7,
  },
];

const showAgreePrivacy = ref(false);

// 同意隐私协议
function handleAgree() {
  console.log('同意隐私政策');
}

// 处理商品点击
function handleProductClick(product: any) {
  uni.navigateTo({
    url: `/pages/product/detail/index?id=${product.id || '1'}`,
  });
}

const cartStore = useCartStore();

// 处理加入购物车
function handleAddToCart(product: any) {
  const success = cartStore.addToCart({
    id: product.id || Date.now().toString(),
    title: product.title,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    quantity: 1,
    stock: 999, // 默认库存
    specs: product.specs,
  });

  if (success) {
    uni.showToast({
      title: '已加入购物车',
      icon: 'success',
    });
  }
}
</script>

<style lang="scss" scoped>
.page-wrap {
  padding: 0 20rpx;
}
</style>
