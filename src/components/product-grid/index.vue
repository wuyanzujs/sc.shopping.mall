<template>
  <view class="product-grid" :class="gridClass" :style="[customStyle]">
    <view
      v-for="(item, index) in products"
      :key="getItemKey(item, index)"
      class="product-item"
    >
      <slot :item="item" :index="index">
        <!-- 默认插槽内容，如果没有传入自定义内容就使用默认的 -->
        <view class="default-item">
          <text>{{ item.name }}</text>
        </view>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Product } from '@/api/product/types';

interface ProductGridProps {
  products: Product[]; // 商品数据数组
  columns?: number; // 列数，默认2列
  gap?: string; // 间距，默认20rpx
  keyField?: string; // 用作key的字段名，默认'title'
  customStyle?: Record<string, any>; // 自定义样式对象
}

const props = withDefaults(defineProps<ProductGridProps>(), {
  columns: 2,
  gap: '20rpx',
  keyField: 'title',
  marginTop: '0rpx',
  customStyle: () => ({}),
});

// 计算网格类名
const gridClass = computed(() => {
  return `grid-columns-${props.columns}`;
});

// 获取项目的key
function getItemKey(item: any, index: number) {
  return item[props.keyField] || `item-${index}`;
}
</script>

<style lang="scss" scoped>
.product-grid {
  display: grid;
  gap: var(--grid-gap, 20rpx);

  &.grid-columns-1 {
    grid-template-columns: 1fr;
    --grid-gap: 20rpx;
  }

  &.grid-columns-2 {
    grid-template-columns: 1fr 1fr;
    --grid-gap: 20rpx;
  }

  &.grid-columns-3 {
    grid-template-columns: 1fr 1fr 1fr;
    --grid-gap: 15rpx;
  }

  &.grid-columns-4 {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    --grid-gap: 10rpx;
  }
}

.product-item {
  box-sizing: border-box;
  width: 100%;
}

.default-item {
  padding: 20rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  text-align: center;
}
</style>
