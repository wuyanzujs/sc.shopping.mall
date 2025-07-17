<template>
  <u-navbar title="我的" left-icon="" placeholder bg-color="transparent" title-style="font-weight: 600;" />
  <img class="user-bg" src="@/static/user/userbg.png" alt="" />
  <view class="page-wrap">
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <view class="user-header">
        <view class="user-avatar">
          <u-avatar :src="isLoggedIn ? userStore.avatar : '/static/images/default-avatar.png'" size="60" />
        </view>
        <view class="user-info">
          <text class="user-name" @click="handleAvatarClick">
            {{ isLoggedIn ? (userStore.user_name || '微信用户') : '未登录' }}
          </text>
        </view>
      </view>
    </view>

    <!-- 订单功能区域 -->
    <view class="order-section">
      <view class="order-item" @click="checkLoginAndNavigate('order-pending')">
        <view class="order-icon">
          <u-icon name="file-text" size="24" color="#666" />
        </view>
        <text class="order-label">
          待支付
        </text>
      </view>
      <view class="order-item" @click="checkLoginAndNavigate('order-shipped')">
        <view class="order-icon">
          <u-icon name="car" size="24" color="#666" />
        </view>
        <text class="order-label">
          待发货
        </text>
      </view>
      <view class="order-item" @click="checkLoginAndNavigate('order-received')">
        <view class="order-icon">
          <u-icon name="home" size="24" color="#666" />
        </view>
        <text class="order-label">
          待收货
        </text>
      </view>
      <view class="order-item" @click="checkLoginAndNavigate('order-refund')">
        <view class="order-icon">
          <u-icon name="reload" size="24" color="#666" />
        </view>
        <text class="order-label">
          退款/售后
        </text>
      </view>
      <view class="order-item" @click="checkLoginAndNavigate('order-list')">
        <view class="order-icon">
          <u-icon name="list" size="24" color="#666" />
        </view>
        <text class="order-label">
          我的订单
        </text>
      </view>
    </view>

    <!-- 功能网格区域 -->
    <view class="function-grid">
      <view class="grid-row">
        <view class="grid-item" @click="checkLoginAndNavigate('address')">
          <view class="grid-icon blue">
            <u-icon name="map" size="20" color="#fff" />
          </view>
          <text class="grid-label">
            收货地址
          </text>
        </view>
        <view class="grid-item" @click="checkLoginAndNavigate('settings')">
          <view class="grid-icon blue-light">
            <u-icon name="setting" size="20" color="#fff" />
          </view>
          <text class="grid-label">
            通用设置
          </text>
        </view>
        <view class="grid-item" @click="callCustomerService">
          <view class="grid-icon green-light">
            <u-icon name="phone" size="20" color="#fff" />
          </view>
          <text class="grid-label">
            客服电话
          </text>
        </view>
        <view class="grid-item" @click="openOnlineService">
          <view class="grid-icon red-light">
            <u-icon name="chat" size="20" color="#fff" />
          </view>
          <text class="grid-label">
            在线客服
          </text>
        </view>
      </view>
    </view>
  </view>

  <!-- 登录弹窗 -->
  <u-popup round="20" :show="isOpenLoginPopup" @close="closeLoginForm">
    <div class="login-popup">
      <div class="title center">
        隐私政策提示
      </div>
      <button v-if="!allowChecked && !isSigned" class="phone-btn center" @click="isChecked">
        手机号登录
      </button>
      <button
        v-if="allowChecked && !isSigned" class="phone-btn center" open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        手机号登录
      </button>
      <button v-if="!allowChecked && isSigned" class="phone-btn center" @click="isChecked">
        手机号快捷登录
      </button>
      <button v-if="allowChecked && isSigned" class="phone-btn center" @click="getUserinfo">
        手机号快捷登录
      </button>

      <div class="checkbox">
        <up-checkbox
          v-model:checked="allowChecked" :custom-style="{ marginBottom: '8px' }" name="agree" used-alone
          @change="() => { allowChecked = !allowChecked }"
        >
          <template #label>
            <div class="text-28 text-#2F384C">
              同意<span class="primary-color">用户协议</span>与<span class="primary-color">隐私条款</span>
            </div>
          </template>
        </up-checkbox>
      </div>
    </div>
  </u-popup>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';

const isOpenLoginPopup = ref(false);
const isSigned = ref(false); // 是否已注册过
const allowChecked = ref(false);
const userStore = useUserStore();

// 计算属性：是否已登录 - 直接访问 store 属性
const isLoggedIn = computed(() => {
  return !!userStore.uuid && !!userStore.mobile;
});

const closeLoginForm = () => {
  isOpenLoginPopup.value = false;
  // 打开Tabbar
  uni.showTabBar({
    animation: true,
  });
};

// 微信授权登录（获取openid）
const wxLogin = async () => {
  try {
    const flag = await userStore.authLogin();
    // 获取openid后显示登录弹窗
    if (flag) {
      isSigned.value = true;
    }
    uni.hideTabBar({
      animation: false,
    });
    isOpenLoginPopup.value = true;
    // 关闭Tabbar
  }
  catch (error: any) {
    uni.showToast({
      title: error.message || '授权失败，请重试',
      icon: 'none',
    });
    console.error('微信授权失败:', error);
  }
};

// 点击头像区域 - 主动触发登录
const handleAvatarClick = async () => {
  if (!isLoggedIn.value) {
    await wxLogin();
  }
};

// 跳转到收货地址页面
const goToAddress = () => {
  uni.navigateTo({
    url: '/pages/address/index',
  });
};

// 跳转到通用设置
const goToSettings = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none',
  });
};

// 跳转到订单列表
const goToOrderList = () => {
  uni.navigateTo({
    url: '/pages/order/index',
  });
};

// 待支付
const goToPending = () => {
  uni.navigateTo({
    url: '/pages/pendding/index',
  });
};

// 跳转到待发货
const goToShipping = () => {
  // 待开发
  uni.showToast({
    title: '功能开发中',
    icon: 'none',
  });
};

// 跳转到待收货
const goToReceived = () => {
  // 待开发
  uni.showToast({
    title: '功能开发中',
    icon: 'none',
  });
};

// 跳转到待退款
const goToRefund = () => {
  // 待开发
  uni.showToast({
    title: '功能开发中',
    icon: 'none',
  });
};

// 检查登录状态并导航或弹出登录窗
const checkLoginAndNavigate = async (action: string) => {
  if (!isLoggedIn.value) {
    // 未登录，先进行微信授权
    await wxLogin();
    return;
  }

  // 已登录，执行相应操作
  switch (action) {
    case 'address':
      goToAddress();
      break;
    case 'settings':
      goToSettings();
      break;
    case 'order-pending':
      goToPending();
      break;
    case 'order-shipped':
      goToShipping();
      break;
    case 'order-received':
      goToReceived();
      break;
    case 'order-refund':
      goToRefund();
      break;
    case 'order-list':
      goToOrderList();
      break;
    default:
      console.log('未知操作:', action);
  }
};

// 获取手机号并完成注册
const getPhoneNumber = async (e: any) => {
  if (!e.detail.code) {
    uni.showToast({ icon: 'none', title: '登录前请授权获取手机号' });
    return;
  }

  uni.showLoading({ title: '登录中...', mask: true });

  try {
    const phoneInfo = await userStore.getUserPhonenumber(e.detail.code);
    const signInfo = {
      unionid: '',
      openid: userStore.openid!,
      nickname: '微信用户',
      avatarUrl: '',
      mobile: phoneInfo.purePhoneNumber,
      app: 'agent',
    };
    await userStore.signUp(signInfo);

    // 注册成功后关闭弹窗
    isOpenLoginPopup.value = false;
    // 打开tabbar
    uni.showTabBar({
      animation: true,
    });
    uni.showToast({
      title: '登录成功',
      icon: 'success',
    });
  }
  catch (error: any) {
    uni.showToast({
      title: error.message || '登录失败，请重试',
      icon: 'none',
    });
  }
  finally {
    uni.hideLoading();
  }
};

// 获取用户信息
const getUserinfo = async () => {
  await userStore.profile();
  if (userStore.uuid) {
    isOpenLoginPopup.value = false;
    uni.showTabBar({
      animation: true,
    });
  }
};

const isChecked = () => {
  if (!allowChecked.value) {
    uni.showToast({ icon: 'none', title: '请勾选同意协议' });
  }
};

// 拨打客服电话
const callCustomerService = () => {
  // 客服电话不需要登录
  uni.showToast({
    title: '客服电话功能开发中',
    icon: 'none',
  });
};

// 打开在线客服
const openOnlineService = () => {
  // 在线客服不需要登录
  uni.showToast({
    title: '在线客服功能开发中',
    icon: 'none',
  });
};
</script>

<!-- 样式保持不变 -->
<style lang="scss" scoped>
.login-popup {
  padding: 30rpx 20rpx;

  .title {
    font-size: 30rpx;
    margin-bottom: 40rpx;
  }

  .phone-btn {
    font-size: 30rpx;
    width: 100%;
    height: 80rpx;
    border-radius: 40rpx;
    background-color: #42a5f5;
    color: #fff;
    margin-bottom: 20rpx;
  }

  .checkbox {
    margin-bottom: 24rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
  }
}

.user-bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 800rpx;
}

.user-info-section {
  padding: 60rpx 30rpx 40rpx;

  .user-header {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .user-avatar {
      margin-right: 30rpx;
    }

    .user-info {
      flex: 1;

      .user-name {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
      }
    }

    .user-actions {
      display: flex;
      align-items: center;
    }
  }
}

.order-section {
  display: flex;
  background: white;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);

  .order-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
      opacity: 0.8;
    }

    .order-icon {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15rpx;
    }

    .order-label {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.function-grid {
  margin: 0 30rpx;

  .grid-row {
    display: flex;
    background: white;
    border-radius: 20rpx;
    padding: 30rpx 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);

    .grid-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.95);
        opacity: 0.8;
      }

      .grid-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15rpx;

        &.blue {
          background: linear-gradient(135deg, #42a5f5, #2196f3);
        }

        &.blue-light {
          background: linear-gradient(135deg, #74c0fc, #339af0);
        }

        &.green-light {
          background: linear-gradient(135deg, #8ce99a, #51cf66);
        }

        &.red-light {
          background: linear-gradient(135deg, #ffa8a8, #ff6b6b);
        }
      }

      .grid-label {
        font-size: 24rpx;
        color: #666;
        text-align: center;
      }
    }
  }
}
</style>
