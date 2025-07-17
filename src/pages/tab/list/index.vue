<template>
  <view class="category-page">
    <!-- 左侧分类菜单 -->
    <view class="category-sidebar">
      <view
        v-for="(category, index) in categories"
        :key="index"
        class="category-item"
        :class="{ active: activeCategory === index }"
        @click="selectCategory(index)"
      >
        {{ category.name }}
      </view>
    </view>

    <!-- 右侧商品网格 -->
    <view class="product-content">
      <view class="product-grid">
        <view
          v-for="(product, index) in currentProducts"
          :key="index"
          class="product-item"
          @click="handleProductClick(product)"
        >
          <image
            class="product-image"
            :src="product.image"
            mode="aspectFill"
          />
          <view class="product-name">
            {{ product.name }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Product {
  id: number;
  name: string;
  image: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  products: Product[];
}

const activeCategory = ref(0);

const categories = ref<Category[]>([
  {
    id: 1,
    name: '女装',
    products: [
      { id: 1, name: '卫衣', image: 'https://picsum.photos/200/200?random=1', categoryId: 1 },
      { id: 2, name: '毛呢外套', image: 'https://picsum.photos/200/200?random=2', categoryId: 1 },
      { id: 3, name: '雪纺衫', image: 'https://picsum.photos/200/200?random=3', categoryId: 1 },
      { id: 4, name: '羽绒服', image: 'https://picsum.photos/200/200?random=4', categoryId: 1 },
      { id: 5, name: '毛衣', image: 'https://picsum.photos/200/200?random=5', categoryId: 1 },
      { id: 6, name: '棉衣', image: 'https://picsum.photos/200/200?random=6', categoryId: 1 },
      { id: 7, name: '西装', image: 'https://picsum.photos/200/200?random=7', categoryId: 1 },
      { id: 8, name: '马甲', image: 'https://picsum.photos/200/200?random=8', categoryId: 1 },
      { id: 9, name: '连衣裙', image: 'https://picsum.photos/200/200?random=9', categoryId: 1 },
      { id: 10, name: '半身裙', image: 'https://picsum.photos/200/200?random=10', categoryId: 1 },
      { id: 11, name: '裤子', image: 'https://picsum.photos/200/200?random=11', categoryId: 1 },
    ],
  },
  {
    id: 2,
    name: '男装',
    products: [
      { id: 12, name: 'T恤', image: 'https://picsum.photos/200/200?random=12', categoryId: 2 },
      { id: 13, name: '衬衫', image: 'https://picsum.photos/200/200?random=13', categoryId: 2 },
      { id: 14, name: '夹克', image: 'https://picsum.photos/200/200?random=14', categoryId: 2 },
      { id: 15, name: '西装', image: 'https://picsum.photos/200/200?random=15', categoryId: 2 },
    ],
  },
  {
    id: 3,
    name: '儿童装',
    products: [
      { id: 16, name: '童装上衣', image: 'https://picsum.photos/200/200?random=16', categoryId: 3 },
      { id: 17, name: '童装裤子', image: 'https://picsum.photos/200/200?random=17', categoryId: 3 },
      { id: 18, name: '童装外套', image: 'https://picsum.photos/200/200?random=18', categoryId: 3 },
    ],
  },
  {
    id: 4,
    name: '美妆',
    products: [
      { id: 19, name: '口红', image: 'https://picsum.photos/200/200?random=19', categoryId: 4 },
      { id: 20, name: '粉底', image: 'https://picsum.photos/200/200?random=20', categoryId: 4 },
      { id: 21, name: '眼影', image: 'https://picsum.photos/200/200?random=21', categoryId: 4 },
    ],
  },
]);

const currentProducts = computed(() => {
  return categories.value[activeCategory.value]?.products || [];
});

function selectCategory(index: number) {
  activeCategory.value = index;
}

function handleProductClick(product: Product) {
  console.log('点击商品:', product);
  // 这里可以跳转到商品详情页
  uni.navigateTo({
    url: `/pages/product/detail/index?id=${product.id}`,
  });
}
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

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.product-item {
  text-align: center;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  .product-image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 8rpx;
    margin-bottom: 16rpx;
  }

  .product-name {
    font-size: 24rpx;
    color: #333;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
</style>
