<template>
  <view class="page-wrap">
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <view class="user-avatar">
        <u-avatar
          :src="isLoggedIn ? userInfo.avatarUrl : '/static/images/default-avatar.png'"
          size="60"
        />
      </view>
      <view class="login-section">
        <text class="login-text" @click="handleAvatarClick">
          {{ isLoggedIn ? userInfo.nickName : '注册 / 登录' }}
        </text>
      </view>
    </view>

    <!-- 订单功能区域 -->
    <view class="order-section">
      <view class="order-item">
        <view class="order-icon">
          <u-icon name="file-text" size="24" color="#666" />
        </view>
        <text class="order-label">
          待支付
        </text>
      </view>
      <view class="order-item">
        <view class="order-icon">
          <u-icon name="car" size="24" color="#666" />
        </view>
        <text class="order-label">
          待发货
        </text>
      </view>
      <view class="order-item">
        <view class="order-icon">
          <u-icon name="home" size="24" color="#666" />
        </view>
        <text class="order-label">
          待收货
        </text>
      </view>
      <view class="order-item">
        <view class="order-icon">
          <u-icon name="reload" size="24" color="#666" />
        </view>
        <text class="order-label">
          退款/售后
        </text>
      </view>
      <view class="order-item">
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
        <view class="grid-item" @click="goToAddress">
          <view class="grid-icon blue">
            <u-icon name="map" size="20" color="#fff" />
          </view>
          <text class="grid-label">
            收货地址
          </text>
        </view>
        <view class="grid-item" @click="goToSettings">
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

    <!-- 退出登录按钮 -->
    <view v-if="isLoggedIn" class="logout-section">
      <u-button
        type="default"
        size="large"
        custom-style="background: #f8f8f8; color: #333; border: none;"
        @click="logout"
      >
        退出登录
      </u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { clearToken, getToken } from '@/utils/auth';

// 登录状态
const isLoggedIn = ref(false);

// 用户信息
const userInfo = ref({
  nickName: '',
  avatarUrl: '',
  phoneNumber: '',
});

// 检查登录状态
const checkLoginStatus = () => {
  const token = getToken();
  isLoggedIn.value = !!token;
  if (isLoggedIn.value) {
    // 如果已登录，从本地存储获取用户信息
    const savedUserInfo = uni.getStorageSync('userInfo');
    if (savedUserInfo) {
      userInfo.value = savedUserInfo;
    }
  }
};

// 点击头像区域
const handleAvatarClick = () => {
  if (!isLoggedIn.value) {
    // wxLogin();
  }
  else {
    // 已登录，可以跳转到个人信息页面
    uni.showToast({
      title: '跳转到个人信息',
      icon: 'none',
    });
  }
};

// 获取手机号
// const getPhoneNumber = (): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     uni.showModal({
//       title: '获取手机号',
//       content: '需要获取您的手机号以完善账户信息',
//       confirmText: '授权',
//       cancelText: '跳过',
//       success: (res) => {
//         if (res.confirm) {
//           // 在实际项目中，这里应该调用 uni.getPhoneNumber() 或使用button的open-type="getPhoneNumber"
//           // 这里模拟获取手机号
//           uni.showModal({
//             title: '手机号授权',
//             content: '请在弹出的授权框中确认',
//             showCancel: false,
//             success: () => {
//               // 模拟获取到的手机号
//               resolve('138****8888');
//             },
//           });
//         }
//         else {
//           resolve(''); // 用户跳过手机号授权
//         }
//       },
//       fail: () => {
//         reject(new Error('获取手机号失败'));
//       },
//     });
//   });
// };

// 微信登录
// const wxLogin = async () => {
//   try {
//     uni.showLoading({
//       title: '登录中...',
//     });

//     // 1. 获取微信登录code
//     const [loginError, loginRes] = await uni.login({
//       provider: 'weixin',
//     });

//     if (loginError || !loginRes.code) {
//       throw new Error('获取微信授权失败');
//     }

//     // 2. 获取用户信息
//     const [userInfoError, userInfoRes] = await uni.getUserInfo({
//       provider: 'weixin',
//     });

//     if (userInfoError || !userInfoRes.userInfo) {
//       throw new Error('获取用户信息失败');
//     }

//     // 3. 获取手机号（需要用户主动授权）
//     const phoneNumber = await getPhoneNumber();

//     // 4. 组装用户信息
//     const userData = {
//       code: loginRes.code,
//       nickName: userInfoRes.userInfo.nickName,
//       avatarUrl: userInfoRes.userInfo.avatarUrl,
//       phoneNumber,
//     };

//     // 5. 调用后端接口进行登录验证（这里模拟）
//     // const res = await api.wechatLogin(userData);

//     // 模拟登录成功
//     const token = `wechat_token_${Date.now()}`;
//     setToken(token);

//     // 保存用户信息到本地
//     userInfo.value = userData;
//     uni.setStorageSync('userInfo', userData);

//     isLoggedIn.value = true;

//     uni.hideLoading();
//     uni.showToast({
//       title: '登录成功',
//       icon: 'success',
//     });
//   }
//   catch (error: any) {
//     uni.hideLoading();
//     uni.showToast({
//       title: error.message || '登录失败，请重试',
//       icon: 'none',
//     });
//     console.error('微信登录失败:', error);
//   }
// };

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        clearToken();
        uni.removeStorageSync('userInfo');
        userInfo.value = {
          nickName: '',
          avatarUrl: '',
          phoneNumber: '',
        };
        isLoggedIn.value = false;
        uni.showToast({
          title: '已退出登录',
          icon: 'success',
        });
      }
    },
  });
};

// 页面显示时检查登录状态
onShow(() => {
  checkLoginStatus();
});

// 页面加载时检查登录状态
onMounted(() => {
  checkLoginStatus();
});

// 在script部分添加以下方法：

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

// 拨打客服电话
const callCustomerService = () => {
  uni.makePhoneCall({
    phoneNumber: '400-123-4567',
    fail: () => {
      uni.showToast({
        title: '拨号失败',
        icon: 'none',
      });
    },
  });
};

// 打开在线客服
const openOnlineService = () => {
  uni.showToast({
    title: '在线客服功能开发中',
    icon: 'none',
  });
};
</script>

<style lang="scss" scoped>
.user-info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0 60rpx;
  margin-top: 160rpx;

  .user-avatar {
    margin-bottom: 30rpx;
  }

  .login-section {
    .login-text {
      font-size: 32rpx;
      color: #333;
      font-weight: 500;
    }
  }
}

.order-section {
  display: flex;
  background: white;
  margin: 30rpx;
  border-radius: 20rpx;
  padding: 40rpx 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);

  .order-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;

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
    margin-bottom: 30rpx;

    .grid-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;

      .grid-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15rpx;

        &.blue {
          background: linear-gradient(135deg, #339af0, #228be6);
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

.logout-section {
  margin: 60rpx 30rpx 0;
}
</style>
