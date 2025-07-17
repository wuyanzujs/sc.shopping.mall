<template>
  <view class="confirm-page">
    <!-- 可滚动内容区域 -->
    <scroll-view
      class="scroll-content"
      scroll-y
    >
      <!-- 收货地址卡片 -->
      <view class="address-card" @click="selectAddress">
        <view v-if="selectedAddress.uuid" class="address-content">
          <view class="address-header">
            <text class="address-label">
              收货
            </text>
            <text class="address-name">
              {{ selectedAddress.name }}
            </text>
            <text class="address-phone">
              {{ selectedAddress.mobile }}
            </text>
          </view>
          <view class="address-detail">
            <text class="address-text">
              {{ selectedAddress.area }} {{ selectedAddress.detail_address }}
            </text>
            <text class="address-arrow">
              >
            </text>
          </view>
        </view>
        <view v-else class="no-address">
          <text class="no-address-text">
            请选择收货地址
          </text>
          <text class="address-arrow">
            >
          </text>
        </view>
      </view>

      <!-- 商品列表卡片 -->
      <view class="product-card">
        <view class="card-header">
          <text class="card-title">
            商品清单
          </text>
          <text class="item-count">
            共{{ totalQuantity }}件
          </text>
        </view>
        <view class="product-list">
          <view
            v-for="item in selectedItems"
            :key="item.id"
            class="product-item"
          >
            <image
              :src="item.productImage[0]"
              class="product-image"
              mode="aspectFill"
            />
            <view class="product-info">
              <text class="product-name">
                {{ item.productName }}
              </text>
              <view class="product-bottom">
                <text class="product-price">
                  ¥{{ item.price_new }}
                </text>
                <text class="product-quantity">
                  x {{ item.quantity }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部占位，防止内容被固定栏遮挡 -->
      <view class="bottom-placeholder" />
    </scroll-view>

    <!-- 固定底部结算栏 -->
    <view class="bottom-bar">
      <view class="price-info">
        <view class="price-row">
          <text class="price-label">
            共{{ totalQuantity }}件
          </text>
          <text class="price-label">
            总计：
          </text>
          <text class="total-price">
            ¥{{ totalPrice.toFixed(2) }}
          </text>
        </view>
      </view>
      <view
        class="submit-btn"
        :class="{ disabled: submitting }"
        @click="submitOrder"
      >
        <text class="submit-text">
          {{ submitting ? '提交中...' : '提交订单' }}
        </text>
      </view>
    </view>

    <!-- 地址选择弹窗 -->
    <up-popup
      v-model:show="showAddressPopup"
      mode="bottom"
      border-radius="20"
      round="6"
    >
      <view class="address-popup">
        <view class="popup-header">
          <text class="popup-title">
            选择收货地址
          </text>
          <text class="popup-close" @click="goToAddAddress">
            新增地址
          </text>
        </view>
        <view v-if="addressList.length > 0" class="address-list">
          <view
            v-for="address in addressList"
            :key="address.uuid"
            class="address-option"
            @click="selectAddressItem(address)"
          >
            <view class="address-info">
              <text class="address-name">
                {{ address.name }}
              </text>
              <text class="address-phone">
                {{ address.mobile }}
              </text>
              <view v-if="address.is_default === 'Y'" class="default-tag">
                <text class="tag-text">
                  默认
                </text>
              </view>
            </view>
            <text class="address-detail">
              {{ address.area }} {{ address.detail_address }}
            </text>
          </view>
        </view>
        <view v-else class="empty-address">
          <text class="empty-text">
            暂无收货地址
          </text>
          <view class="add-address-btn" @click="goToAddAddress">
            <text class="add-btn-text">
              新增收货地址
            </text>
          </view>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script setup lang="ts">
import type { UserAddress } from '@/api/user/types';
import type { PaymentResult } from '@/utils';
import { useCartStore, useUserStore } from '@/store';
import { useWechatPay } from '@/utils';
import { computed, ref } from 'vue';

const cartStore = useCartStore();
const userStore = useUserStore();

// 响应式数据
const selectedAddress = ref<UserAddress>({
  uuid: '',
  acc_id: '',
  name: '',
  mobile: '',
  area: '',
  detail_address: '',
  is_default: '',
});
const addressList = ref<UserAddress[]>([]);
const remark = ref('');
const submitting = ref(false);
const showAddressPopup = ref(false);
const loading = ref(false);

// 计算属性
const selectedItems = computed(() => {
  return cartStore.selectedItems;
});

const totalQuantity = computed(() => {
  return selectedItems.value.reduce((total, item) => total + item.quantity, 0);
});

const totalPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + item.price_new * item.quantity;
  }, 0);
});

// 获取用户地址列表
const getUserAddressList = async () => {
  try {
    loading.value = true;
    const addresses = await userStore.getUserAddressList();
    addressList.value = addresses;

    // 如果有地址，自动选择默认地址或第一个地址
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.is_default === 'Y');
      selectedAddress.value = defaultAddress || addresses[0];
    }
    else {
      // 如果没有地址，清空选中的地址
      selectedAddress.value = {
        uuid: '',
        acc_id: '',
        name: '',
        mobile: '',
        area: '',
        detail_address: '',
        is_default: '',
      };
    }
  }
  catch (error) {
    console.error('获取地址列表失败:', error);
    uni.showToast({
      title: '获取地址列表失败',
      icon: 'none',
    });
  }
  finally {
    loading.value = false;
  }
};

onShow(async () => {
  // 获取地址列表
  await getUserAddressList();
});

const selectAddress = () => {
  if (addressList.value.length === 0) {
    uni.showModal({
      title: '提示',
      content: '您还没有收货地址，请先添加收货地址',
      confirmText: '去添加',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/address/index',
          });
        }
      },
    });
    return;
  }
  showAddressPopup.value = true;
};

const selectAddressItem = (address: UserAddress) => {
  selectedAddress.value = address;
  showAddressPopup.value = false;
};

const goToAddAddress = () => {
  showAddressPopup.value = false;
  uni.navigateTo({
    url: '/pages/address/index',
  });
};

const submitOrder = async () => {
  if (submitting.value) return;

  if (!selectedAddress.value.uuid) {
    uni.showToast({
      title: '请选择收货地址',
      icon: 'none',
    });
    return;
  }

  submitting.value = true;

  try {
    // 构建订单数据
    const orderData = {
      address_id: selectedAddress.value.uuid,
      amount: '0.01',
      remark: remark.value,
      userId: userStore.uuid,
      description: '订单描述',
      openid: userStore.openid,
      payer: userStore.uuid,
      appid: 'wx2e3f06133b9610d5',
      product_id: cartStore.selectedItems.map(item => item.productId),
      quantity: cartStore.selectedItems.map(item => item.quantity),
      agent_id: cartStore.selectedItems.map(item => item.agent_id),
      // 随机16位
      tradeno: Math.random().toString(36).substring(2, 18), // 订单号
    };

    await useWechatPay({
      orderData,
      onSuccess: async () => {
        // uni.showToast({
        //   title: '支付成功',
        //   icon: 'success',
        // });

        // // 清除购物车中已结算的商品
        // await cartStore.removeSelectedItems(userStore.uuid);

        // // 跳转到订单详情或支付页面
        // setTimeout(() => {
        //   uni.redirectTo({
        //     url: '/pages/order/index',
        //   });
        // }, 1500);
      },
      onCancel: (_paymentResult: PaymentResult) => {
        uni.showToast({
          title: '支付已取消',
          icon: 'none',
        });
      },
      onFail: (paymentResult: PaymentResult) => {
        uni.showToast({
          title: paymentResult.message,
          icon: 'error',
        });
      },
    });

    // 🚨 删除这部分重复的代码
    // uni.showToast({
    //   title: '订单提交成功',
    //   icon: 'success',
    // });

    // // 清除购物车中已结算的商品
    // await cartStore.removeSelectedItems(userStore.uuid);

    // // 跳转到订单详情或支付页面
    // setTimeout(() => {
    //   uni.redirectTo({
    //     url: '/pages/order/index',
    //   });
    // }, 1500);
  }
  catch (error: any) {
    console.error('提交订单失败:', error);
    uni.showToast({
      title: error.message || '提交订单失败',
      icon: 'error',
    });
  }
  finally {
    submitting.value = false;
  }
};
</script>

<style scoped lang="scss">
.confirm-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.scroll-content {
  flex: 1;
  height: 0;
  padding: 20rpx;
  box-sizing: border-box;
}

// 地址卡片样式
.address-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.12);
  }

  .address-content {
    .address-header {
      display: flex;
      align-items: center;
      margin-bottom: 15rpx;

      .address-label {
        background: #4F95FF;
        color: #fff;
        font-size: 22rpx;
        padding: 6rpx 12rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
        font-weight: 500;
      }

      .address-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-right: 20rpx;
      }

      .address-phone {
        font-size: 28rpx;
        color: #666;
      }
    }

    .address-detail {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .address-text {
        font-size: 28rpx;
        color: #666;
        flex: 1;
        line-height: 1.4;
      }

      .address-arrow {
        font-size: 32rpx;
        color: #ccc;
        margin-left: 20rpx;
      }
    }
  }

  .no-address {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;

    .no-address-text {
      font-size: 28rpx;
      color: #999;
    }

    .address-arrow {
      font-size: 32rpx;
      color: #ccc;
    }
  }
}

// 商品卡片样式
.product-card {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 30rpx 20rpx 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .card-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .item-count {
      font-size: 26rpx;
      color: #666;
      background-color: #f8f9fa;
      padding: 4rpx 12rpx;
      border-radius: 12rpx;
    }
  }

  .product-list {
    .product-item {
      display: flex;
      padding: 30rpx;
      border-bottom: 1rpx solid #f8f9fa;
      transition: background-color 0.2s ease;

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background-color: #f8f9fa;
      }

      .product-image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
        background-color: #f5f5f5;
      }

      .product-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .product-name {
          font-size: 28rpx;
          color: #333;
          line-height: 1.4;
          margin-bottom: 15rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          line-clamp: 2;
          overflow: hidden;
        }

        .product-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .product-price {
            font-size: 32rpx;
            font-weight: 600;
            color: #ff4757;
          }

          .product-quantity {
            font-size: 28rpx;
            color: #666;
            background-color: #f8f9fa;
            padding: 4rpx 12rpx;
            border-radius: 12rpx;
          }
        }
      }
    }
  }
}

.bottom-placeholder {
  height: 120rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 30rpx 30rpx 60rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 100;

  .price-info {
    flex: 1;

    .price-row {
      display: flex;
      align-items: baseline;

      .price-label {
        font-size: 28rpx;
        color: #333;
        margin-right: 10rpx;
      }

      .total-price {
        font-size: 36rpx;
        font-weight: 600;
        color: #ff4757;
      }
    }
  }

  .submit-btn {
    background: linear-gradient(135deg, #4F95FF, #3d7ce6);
    color: #fff;
    padding: 20rpx 40rpx;
    border-radius: 25rpx;
    margin-left: 30rpx;
    transition: all 0.3s ease;
    box-shadow: 0 4rpx 12rpx rgba(79, 149, 255, 0.3);

    &:active {
      transform: translateY(1rpx);
      box-shadow: 0 2rpx 8rpx rgba(79, 149, 255, 0.4);
    }

    &.disabled {
      background: #ccc;
      box-shadow: none;
    }

    .submit-text {
      font-size: 28rpx;
      font-weight: 600;
    }
  }
}

.address-popup {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  max-height: 80vh;

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .popup-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .popup-close {
      font-size: 28rpx;
      color: #4F95FF;
    }
  }

  .address-list {
    max-height: 60vh;
    overflow-y: auto;
  }

  .address-option {
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .address-info {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;

      .address-name {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        margin-right: 20rpx;
      }

      .address-phone {
        font-size: 24rpx;
        color: #666;
      }

      .default-tag {
        background-color: #4F95FF;
        border-radius: 8rpx;
        padding: 2rpx 10rpx;
        margin-left: 10rpx;
        display: flex;
        align-items: center;

        .tag-text {
          font-size: 20rpx;
          color: #fff;
        }
      }
    }

    .address-detail {
      font-size: 24rpx;
      color: #999;
    }
  }

  .empty-address {
    padding: 60rpx 30rpx;
    text-align: center;

    .empty-text {
      font-size: 28rpx;
      color: #999;
      margin-bottom: 30rpx;
      display: block;
    }

    .add-address-btn {
      background-color: #4F95FF;
      color: #fff;
      padding: 20rpx 40rpx;
      border-radius: 12rpx;
      display: inline-block;

      .add-btn-text {
        font-size: 28rpx;
        color: #fff;
      }
    }
  }
}
</style>
