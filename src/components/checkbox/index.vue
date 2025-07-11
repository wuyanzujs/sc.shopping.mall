<template>
  <view class="custom-checkbox" @click="handleClick">
    <view class="checkbox-box" :class="{ checked: isChecked }">
      <view v-if="isChecked" class="checkbox-icon">
        ✓
      </view>
    </view>
    <text v-if="label" class="checkbox-label">
      {{ label }}
    </text>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';

// Props 定义
const props = defineProps({
  // 是否选中
  modelValue: {
    type: Boolean,
    default: false,
  },
  // 标签文本
  label: {
    type: String,
    default: '',
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Events 定义
const emit = defineEmits(['update:modelValue', 'change']);

// 内部状态
const isChecked = ref(props.modelValue);

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  isChecked.value = newVal;
});

// 点击处理
function handleClick() {
  if (props.disabled) {
    return;
  }

  isChecked.value = !isChecked.value;

  // 触发 v-model 更新
  emit('update:modelValue', isChecked.value);

  // 触发 change 事件，返回当前选中状态
  emit('change', isChecked.value);
}
</script>

<style scoped lang="scss">
.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;

  .checkbox-box {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #ddd;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &.checked {
    background-color: #4F95FF;
    border-color: #4F95FF;
  }

    .checkbox-icon {
      color: #fff;
      font-size: 24rpx;
      font-weight: bold;
      line-height: 1;
    }
  }

  .checkbox-label {
    margin-left: 16rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.4;
  }

  &:active .checkbox-box {
    transform: scale(0.95);
  }

  // 禁用状态
  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;

    .checkbox-box {
      background-color: #f5f5f5;
      border-color: #ddd;
    }

    .checkbox-label {
      color: #999;
    }
  }
}
</style>
