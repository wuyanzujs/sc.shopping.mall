<template>
  <view class="product-grid" :class="gridClass" :style="[customStyle]">
    <view
      v-for="(item, index) in products"
      :key="getItemKey(item, index)"
      class="product-item"
      :style="itemStyle"
    >
      <slot :item="item" :index="index">
        <!-- 默认插槽内容，如果没有传入自定义内容就使用默认的 -->
        <view class="default-item">
          <text>{{ item.title || item.name }}</text>
        </view>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
interface ProductGridProps {
  products: any[]; // 商品数据数组
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

// 计算每个项目的样式
const itemStyle = computed(() => {
  const gapValue = Number.parseInt(props.gap);
  const itemWidth = `calc(${100 / props.columns}% - ${(props.columns - 1) * gapValue / props.columns}rpx)`;

  return {
    width: itemWidth,
    marginBottom: props.gap,
  };
});

// 获取项目的key
function getItemKey(item: any, index: number) {
  return item[props.keyField] || `item-${index}`;
}
</script>

<style lang="scss" scoped>
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--grid-gap, 20rpx);

  &.grid-columns-2 {
    --grid-gap: 20rpx;
  }

  &.grid-columns-3 {
    --grid-gap: 15rpx;
  }

  &.grid-columns-4 {
    --grid-gap: 10rpx;
  }
}

.product-item {
  box-sizing: border-box;
}

.default-item {
  padding: 20rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  text-align: center;
}
</style>
