<template>
  <view class="address-page">
    <!-- 地址列表 -->
    <view v-if="addressList.length > 0" class="address-list">
      <view v-for="(item) in addressList" :key="item.uuid" class="address-item">
        <!-- 地址信息 -->
        <view class="address-header">
          <text class="receiver-name">
            {{ item.area }}
          </text>
          <view v-if="item.is_default" class="default-tag">
            <text class="tag-text">
              默认
            </text>
          </view>
        </view>

        <view class="address-detail">
          <text class="region">
            {{ item.detail_address }}
          </text>
        </view>

        <view class="full-address">
          <text class="address-text">
            {{ item.name }}
          </text>
          <text class="phone">
            {{ item.mobile }}
          </text>
        </view>

        <!-- 修改模板中的操作按钮区域 -->
        <view class="action-buttons">
          <view class="checkbox-area" @click="handleSetDefault(item)">
            <Checkbox
              :model-value="item.is_default === 'Y'"
              :checked="item.is_default"
            />
            <text class="set-default-text">
              {{ item.is_default === 'Y' ? '默认地址' : '设为默认' }}
            </text>
          </view>

          <view class="operation-btns">
            <u-button
              type="default" size="mini" custom-style="margin-right: 10rpx; background: #ddd; color: #999;"
              @click="deleteAddress(item.uuid)"
            >
              删除
            </u-button>
            <u-button
              type="default" size="mini" custom-style="background: #4F95FF; color: #fff;"
              @click="editAddress(item)"
            >
              修改
            </u-button>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="h-full center">
      <up-empty text="暂无收货地址" mode="address" />
    </view>

    <!-- 底部安全区域和新增按钮 -->
    <view class="bottom-container">
      <view class="bottom-add-btn" @click="showAddAddressPopup">
        <text class="add-btn-text">
          新增收货地址
        </text>
      </view>
    </view>

    <!-- 新增地址弹窗 -->
    <up-popup
      :show="showAddPopup" mode="bottom" :border-radius="20" :safe-area-inset-bottom="true"
      @close="closeAddPopup"
    >
      <view class="add-address-popup">
        <view class="popup-header">
          <text class="popup-title">
            {{ popupTitle }}
          </text>
          <u-icon name="close" size="20" color="#999" @click="closeAddPopup" />
        </view>

        <view class="popup-content">
          <!-- 收货人信息 -->
          <view class="form-item">
            <text class="form-label">
              收货人
            </text>
            <u-input
              v-model="newAddress.name" max-length="10" placeholder="请输入收货人姓名" border="none"
              custom-style="background: #f8f8f8; border-radius: 8rpx; padding: 10rpx;"
            />
          </view>

          <view class="form-item">
            <text class="form-label">
              手机号码
            </text>
            <u-input
              v-model="newAddress.mobile" placeholder="请输入手机号码" type="number" border="none"
              custom-style="background: #f8f8f8; border-radius: 8rpx; padding: 10rpx;"
            />
          </view>

          <!-- 地区选择 -->
          <view class="form-item" @click="showRegionPicker">
            <text class="form-label">
              所在地区
            </text>
            <u-input
              v-model="selectedRegion" placeholder="请选择省市区" border="none" readonly
              custom-style="background: #f8f8f8; border-radius: 8rpx; padding: 10rpx;"
            >
              <template #suffix>
                <u-icon name="arrow-right" size="16" color="#999" />
              </template>
            </u-input>
          </view>

          <view class="form-item">
            <text class="form-label">
              详细地址
            </text>
            <u-textarea
              v-model="newAddress.detail_address" placeholder="请输入详细地址（街道、门牌号等）" :auto-height="true"
              :max-length="200" custom-style="background: #f8f8f8; border-radius: 8rpx; padding: 20rpx;"
            />
          </view>

          <!-- 设为默认地址 -->
          <view class="form-item">
            <view class="default-switch">
              <text class="form-label">
                设为默认地址
              </text>
              <u-switch v-model="isDefault" active-color="#4F95FF" size="24" />
            </view>
          </view>
        </view>

        <view class="popup-footer">
          <u-button
            type="default" custom-style="background: #f5f5f5; color: #666; margin-right: 20rpx;"
            @click="closeAddPopup"
          >
            取消
          </u-button>
          <u-button type="primary" custom-style="background: #4F95FF; border: none;" @click="saveAddress">
            保存
          </u-button>
        </view>
      </view>
    </up-popup>

    <u-picker
      ref="uPickerRef" :show="showRegionSelector" mode="region" :columns="defaultRegion" @confirm="onRegionConfirm"
      @change="onRegionChange"
      @cancel="showRegionSelector = false" @close="showRegionSelector = false"
    />
  </view>
</template>

<script setup lang="ts">
import type { ProvinceData } from '@/api/common/types';
import type { AddressItem, AddUserAddressParams, UserAddress } from '@/api/user/types';
import { CommonApi } from '@/api';
import Checkbox from '@/components/checkbox/index.vue';
import { useUserStore } from '@/store';
import { getRegionByIndex, regionFilter } from '@/utils';
import { computed, ref } from 'vue';

const userStore = useUserStore();

// 新增地址弹窗相关
const showAddPopup = ref(false);
const showRegionSelector = ref(false);
const selectedRegion = ref('');
const defaultRegion = ref<string[][]>([]);
const addressList = ref<UserAddress[]>([]);
const regionList = ref<ProvinceData>();

// 定义uview-plus u-picker的ref类型
interface UPickerRef {
  setColumnValues: (columnIndex: number, values: string[]) => void;
}

const uPickerRef = ref<UPickerRef | null>(null);
const isDefault = ref(false);
// 新增地址表单数据
const newAddress = ref<AddUserAddressParams>({
  acc_id: '',
  area: '',
  detail_address: '',
  is_default: '',
  mobile: '',
  name: '',
});

// 获取用户地址列表
const getUserAddressList = async () => {
  addressList.value = await userStore.getUserAddressList();
};

// 复选框组数据
// const checkboxGroup = ref<string[]>([]);

// 显示新增地址弹窗
const showAddAddressPopup = () => {
  showAddPopup.value = true;
};

// 重置表单
const resetForm = () => {
  newAddress.value = {
    acc_id: '',
    area: '',
    detail_address: '',
    is_default: '',
    mobile: '',
    name: '',
  };
  selectedRegion.value = '';
};

const _selectedRegion = ref<string[]>([]);

// 地区选择确认
const onRegionConfirm = () => {
  selectedRegion.value = _selectedRegion.value.join(' ');
  showRegionSelector.value = false;
};

const onRegionChange = (e: any) => {
  const { columnIndex, value } = e;
  console.log('onRegionChange', columnIndex, value);
  _selectedRegion.value = value;
  const { citylist, districtlist } = getRegionByIndex(regionList.value!, columnIndex, value);

  if (columnIndex === 0 && citylist) {
    uPickerRef.value?.setColumnValues(1, citylist);
    uPickerRef.value?.setColumnValues(2, districtlist);
  }
  else if (columnIndex === 1 && districtlist) {
    uPickerRef.value?.setColumnValues(2, districtlist);
  }
};

// 显示地区选择器
const showRegionPicker = () => {
  showRegionSelector.value = true;
};

onMounted(async () => {
  const region = await CommonApi.getRegion();
  const { province, firstCity = [], firstDistrict = [] } = regionFilter(region);
  defaultRegion.value = [province, firstCity, firstDistrict];
  regionList.value = region;
  _selectedRegion.value = [province[0], firstCity[0], firstDistrict[0]];
  getUserAddressList();
});

const isEditMode = ref(false); // 是否为编辑模式
const editingAddressId = ref(''); // 正在编辑的地址ID

// 修改关闭弹窗函数
const closeAddPopup = () => {
  showAddPopup.value = false;
  // 重置编辑状态
  isEditMode.value = false;
  editingAddressId.value = '';
  // 重置表单
  resetForm();
};

// 保存地址
const saveAddress = async () => {
  // 表单验证
  if (!newAddress.value.name.trim()) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' });
    return;
  }
  if (!newAddress.value.mobile.trim()) {
    uni.showToast({ title: '请输入手机号码', icon: 'none' });
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(newAddress.value.mobile)) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' });
    return;
  }
  if (!selectedRegion.value.trim()) {
    uni.showToast({ title: '请选择所在地区', icon: 'none' });
    return;
  }
  if (!newAddress.value.detail_address.trim()) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' });
    return;
  }

  if (isEditMode.value) {
    const updatedAddress: UserAddress = {
      uuid: editingAddressId.value,
      acc_id: userStore.uuid,
      name: newAddress.value.name,
      mobile: newAddress.value.mobile,
      area: selectedRegion.value.replaceAll(' ', ''),
      detail_address: newAddress.value.detail_address,
      is_default: isDefault.value ? 'Y' : 'N',
    };

    const res = await userStore.updateUserAddress(updatedAddress);
    if (res.code !== 'OK') {
      uni.showToast({ title: '地址修改失败', icon: 'none' });
      return;
    }
    // 更新列表
    uni.showToast({ title: '地址修改成功', icon: 'success' });
    await getUserAddressList();
  }
  else {
    const addressItem: AddressItem = {
      acc_id: userStore.uuid,
      area: selectedRegion.value.replaceAll(' ', ''),
      detail_address: newAddress.value.detail_address,
      is_default: isDefault.value ? 'Y' : 'N',
      mobile: newAddress.value.mobile,
      name: newAddress.value.name,
    };

    const res = await userStore.addUserAddress(addressItem);
    if (res.code === 'OK') {
      uni.showToast({ title: '地址添加成功', icon: 'success' });
      getUserAddressList();
    }
  }

  closeAddPopup();
};

// 删除地址
const deleteAddress = (uuid: string) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个地址吗？',
    success: async (res) => {
      if (res.confirm) {
        const res = await userStore.deleteUserAddress(uuid);
        if (res.code !== 'OK') {
          uni.showToast({ title: '删除失败', icon: 'none' });
          return;
        }
        getUserAddressList();
        uni.showToast({ title: '删除成功', icon: 'success' });
      }
    },
  });
};

// 修改弹窗标题的计算属性
const popupTitle = computed(() => {
  return isEditMode.value ? '修改收货地址' : '新增收货地址';
});

// 修改编辑地址函数
const editAddress = (item: UserAddress) => {
  // 设置编辑模式
  isEditMode.value = true;
  editingAddressId.value = item.uuid;

  // 填充表单数据
  newAddress.value = {
    acc_id: item.acc_id,
    name: item.name,
    mobile: item.mobile,
    area: item.area,
    detail_address: item.detail_address,
    is_default: item.is_default,
  };

  // 设置地区显示文本
  selectedRegion.value = item.area;

  // 显示弹窗
  showAddPopup.value = true;
};

// 处理设为默认地址
const handleSetDefault = async (item: UserAddress) => {
  if (item.is_default === 'Y') {
    uni.showToast({ title: '已是默认地址', icon: 'none' });
    return;
  }

  const newAddress = {
    ...item,
    is_default: 'Y',
  };

  const res = await userStore.updateUserAddress(newAddress);

  if (res.code !== 'OK') {
    uni.showToast({ title: '设置默认地址失败', icon: 'none' });
    return;
  }
  uni.showToast({ title: '已设为默认地址', icon: 'success' });

  // 更新列表
  await getUserAddressList();
};
</script>

<style lang="scss" scoped>
.address-page {
  background-color: #f5f5f5;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: 160rpx;
  overflow-y: auto;
}

.address-list {
  padding: 20rpx;
  padding-bottom: 20rpx;
  height: calc(100vh - 160rpx);
  overflow-y: auto;
  box-sizing: border-box;
}

.address-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.address-info {
  margin-bottom: 30rpx;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  flex-wrap: wrap;
}

.receiver-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 20rpx;
}

.phone {
  font-size: 32rpx;
  color: #333;
  margin-right: 20rpx;
}

.default-tag {
  background-color: #4F95FF;
  border-radius: 8rpx;
  padding: 2rpx 10rpx;
  margin-right: 10rpx;
}

.tag-text {
  font-size: 20rpx;
  color: #fff;
}

.address-detail {
  margin-bottom: 10rpx;
}

.region {
  font-size: 28rpx;
  color: #666;
}

.full-address {
  display: flex;
  align-items: center;
  gap: 40rpx;
  // justify-content: space-between;
}

.address-text {
  font-size: 32rpx;
  color: #333;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.checkbox-area {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.custom-checkbox {
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
}

.checkbox-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkmark {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
  line-height: 1;
}

.set-default-text {
  font-size: 28rpx;
  color: #666;
  margin-left: 10rpx;
  cursor: pointer;
}

.operation-btns {
  display: flex;
  align-items: center;
}

.bottom-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  padding-bottom: env(safe-area-inset-bottom, 20rpx);
  z-index: 999;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.bottom-add-btn {
  background-color: #4F95FF;
  border-radius: 12rpx;
  padding: 20rpx;
  text-align: center;
  margin-bottom: 20rpx;
}

.add-btn-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.add-address-popup {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  flex-shrink: 0;
}

.popup-content {
  padding: 20rpx 30rpx;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.popup-footer {
  display: flex;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  gap: 15rpx;
  flex-shrink: 0;
  background: #fff;
}

.popup-content::-webkit-scrollbar {
  width: 4rpx;
}

.popup-content::-webkit-scrollbar-track {
  background: transparent;
}

.popup-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2rpx;
}

.popup-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.popup-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.form-item {
  margin-bottom: 20rpx;
}

.form-label {
  display: block;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 10rpx;
  font-weight: 500;
}

.region-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 15rpx 20rpx;
}

.region-text {
  font-size: 26rpx;
  color: #333;

  &.placeholder {
    color: #999;
  }
}

// 删除地址类型选择器相关样式
// .address-type-selector, .type-item, .type-text { ... }

.default-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5rpx 0;
}
</style>
