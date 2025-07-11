<template>
  <view class="address-page">
    <!-- 地址列表 -->
    <view class="address-list">
      <view
        v-for="(item) in addressList"
        :key="item.id"
        class="address-item"
      >
        <!-- 地址信息 -->
        <view class="address-header">
          <text class="receiver-name">
            {{ item.receiverName }}
          </text>
          <text class="phone">
            {{ item.phone }}
          </text>
          <view v-if="item.isDefault" class="default-tag">
            <text class="tag-text">
              默认
            </text>
          </view>
        </view>

        <view class="address-detail">
          <text class="region">
            {{ item.province }} {{ item.city }} {{ item.district }}
          </text>
        </view>

        <view class="full-address">
          <text class="address-text">
            {{ item.detailAddress }}
          </text>
        </view>

        <!-- 修改模板中的操作按钮区域 -->
        <view class="action-buttons">
          <view class="checkbox-area" @click="handleSetDefault(item)">
            <view class="custom-checkbox" :class="{ checked: item.selected }">
              <view v-if="item.selected" class="checkbox-inner">
                <text class="checkmark">
                  ✓
                </text>
              </view>
            </view>
            <text class="set-default-text">
              {{ item.isDefault ? '默认地址' : '设为默认' }}
            </text>
          </view>

          <view class="operation-btns">
            <u-button
              type="default"
              size="mini"
              custom-style="margin-right: 10rpx; background: #ddd; color: #999;"
              @click="deleteAddress(item)"
            >
              删除
            </u-button>
            <u-button
              type="default"
              size="mini"
              custom-style="background: #4F95FF; color: #fff;"
              @click="editAddress(item)"
            >
              修改
            </u-button>
          </view>
        </view>
      </view>
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
      :show="showAddPopup"
      mode="bottom"
      :border-radius="20"
      :safe-area-inset-bottom="true"
      @close="closeAddPopup"
    >
      <view class="add-address-popup">
        <view class="popup-header">
          <text class="popup-title">
            {{ popupTitle }}
          </text>
          <u-icon
            name="close"
            size="20"
            color="#999"
            @click="closeAddPopup"
          />
        </view>

        <view class="popup-content">
          <!-- 收货人信息 -->
          <view class="form-item">
            <text class="form-label">
              收货人
            </text>
            <u-input
              v-model="newAddress.receiverName"
              placeholder="请输入收货人姓名"
              border="none"
              custom-style="background: #f8f8f8; border-radius: 8rpx; padding: 10rpx;"
            />
          </view>

          <view class="form-item">
            <text class="form-label">
              手机号码
            </text>
            <u-input
              v-model="newAddress.phone"
              placeholder="请输入手机号码"
              type="number"
              border="none"
              custom-style="background: #f8f8f8; border-radius: 8rpx; padding: 10rpx;"
            />
          </view>

          <!-- 地区选择 -->
          <view class="form-item">
            <text class="form-label">
              所在地区
            </text>
            <u-input
              v-model="selectedRegion"
              placeholder="请选择省市区"
              border="none"
              readonly
              custom-style="background: #f8f8f8; border-radius: 8rpx; padding: 10rpx;"
              @click="showRegionPicker"
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
              v-model="newAddress.detailAddress"
              placeholder="请输入详细地址（街道、门牌号等）"
              :auto-height="true"
              :max-length="200"
              custom-style="background: #f8f8f8; border-radius: 8rpx; padding: 20rpx;"
            />
          </view>

          <!-- 设为默认地址 -->
          <view class="form-item">
            <view class="default-switch">
              <text class="form-label">
                设为默认地址
              </text>
              <u-switch
                v-model="newAddress.isDefault"
                active-color="#4F95FF"
                size="24"
              />
            </view>
          </view>
        </view>

        <view class="popup-footer">
          <u-button
            type="default"
            custom-style="background: #f5f5f5; color: #666; margin-right: 20rpx;"
            @click="closeAddPopup"
          >
            取消
          </u-button>
          <u-button
            type="primary"
            custom-style="background: #4F95FF; border: none;"
            @click="saveAddress"
          >
            保存
          </u-button>
        </view>
      </view>
    </up-popup>

    <u-picker
      :show="showRegionSelector"
      mode="region"
      :default-region="defaultRegion"
      @confirm="onRegionConfirm"
      @cancel="showRegionSelector = false"
      @close="showRegionSelector = false"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface AddressItem {
  id: string;
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault: boolean;

  selected: boolean;
}

interface NewAddressForm {
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault: boolean;

}

// 地址列表数据
const addressList = ref<AddressItem[]>([
  {
    id: '1',
    receiverName: '赵信',
    phone: '15136805262',
    province: '上海',
    city: '闵行区',
    district: '',
    detailAddress: '塘泾南苑7号楼501',
    isDefault: true,
    selected: true,
  },
  {
    id: '2',
    receiverName: '赵信',
    phone: '15136805262',
    province: '上海',
    city: '闵行区',
    district: '',
    detailAddress: '连谷新兴科技产业园1号楼11层',
    isDefault: false,
    selected: false,
  },
  {
    id: '3',
    receiverName: '赵鑫',
    phone: '15136805262',
    province: '河南',
    city: '许昌市',
    district: '建安区',
    detailAddress: '步郑村',
    isDefault: false,
    selected: false,
  },
  {
    id: '3',
    receiverName: '赵鑫',
    phone: '15136805262',
    province: '河南',
    city: '许昌市',
    district: '建安区',
    detailAddress: '步郑村',
    isDefault: false,
    selected: false,
  },
  {
    id: '3',
    receiverName: '赵鑫',
    phone: '15136805262',
    province: '河南',
    city: '许昌市',
    district: '建安区',
    detailAddress: '步郑村',
    isDefault: false,
    selected: false,
  },
]);

// 新增地址弹窗相关
const showAddPopup = ref(false);
const showRegionSelector = ref(false);
const selectedRegion = ref('');
const defaultRegion = ref(['', '', '']);

// 新增地址表单数据
const newAddress = ref<NewAddressForm>({
  receiverName: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false,
});

// 复选框组数据
const checkboxGroup = ref<string[]>([]);

// 删除地址类型选项
// const addressTypes = [...]

// 显示新增地址弹窗
const showAddAddressPopup = () => {
  showAddPopup.value = true;
};

// 重置表单
const resetForm = () => {
  newAddress.value = {
    receiverName: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    isDefault: false,
  };
  selectedRegion.value = '';
};

// 显示地区选择器
const showRegionPicker = () => {
  showRegionSelector.value = true;
};

// 地区选择确认
const onRegionConfirm = (e: any) => {
  const { province, city, area } = e;
  newAddress.value.province = province.name;
  newAddress.value.city = city.name;
  newAddress.value.district = area.name;
  selectedRegion.value = `${province.name} ${city.name} ${area.name}`;
  showRegionSelector.value = false;
};

// 在script setup中添加编辑相关的状态变量
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
const saveAddress = () => {
  // 表单验证
  if (!newAddress.value.receiverName.trim()) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' });
    return;
  }
  if (!newAddress.value.phone.trim()) {
    uni.showToast({ title: '请输入手机号码', icon: 'none' });
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(newAddress.value.phone)) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' });
    return;
  }
  if (!newAddress.value.province || !newAddress.value.city) {
    uni.showToast({ title: '请选择所在地区', icon: 'none' });
    return;
  }
  if (!newAddress.value.detailAddress.trim()) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' });
    return;
  }

  // 如果设为默认地址，取消其他地址的默认状态
  if (newAddress.value.isDefault) {
    addressList.value.forEach((item) => {
      if (item.id !== editingAddressId.value) {
        item.isDefault = false;
        item.selected = false;
      }
    });
  }

  if (isEditMode.value) {
    // 编辑模式：更新现有地址
    const index = addressList.value.findIndex(item => item.id === editingAddressId.value);
    if (index > -1) {
      const updatedAddress: AddressItem = {
        id: editingAddressId.value,
        receiverName: newAddress.value.receiverName,
        phone: newAddress.value.phone,
        province: newAddress.value.province,
        city: newAddress.value.city,
        district: newAddress.value.district,
        detailAddress: newAddress.value.detailAddress,
        isDefault: newAddress.value.isDefault,
        selected: newAddress.value.isDefault,
      };

      addressList.value[index] = updatedAddress;

      // 更新复选框组状态
      if (newAddress.value.isDefault) {
        checkboxGroup.value = [editingAddressId.value];
      }

      uni.showToast({ title: '地址修改成功', icon: 'success' });
    }
  }
  else {
    // 新增模式：添加新地址
    const newId = (addressList.value.length + 1).toString();

    const addressItem: AddressItem = {
      id: newId,
      receiverName: newAddress.value.receiverName,
      phone: newAddress.value.phone,
      province: newAddress.value.province,
      city: newAddress.value.city,
      district: newAddress.value.district,
      detailAddress: newAddress.value.detailAddress,
      isDefault: newAddress.value.isDefault,
      selected: newAddress.value.isDefault,
    };

    addressList.value.push(addressItem);

    // 更新复选框组状态
    if (newAddress.value.isDefault) {
      checkboxGroup.value = [newId];
    }

    uni.showToast({ title: '地址添加成功', icon: 'success' });
  }

  closeAddPopup();
};

// 删除地址
const deleteAddress = (item: AddressItem) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个地址吗？',
    success: (res) => {
      if (res.confirm) {
        const index = addressList.value.findIndex(addr => addr.id === item.id);
        if (index > -1) {
          addressList.value.splice(index, 1);
          if (item.isDefault && addressList.value.length > 0) {
            addressList.value[0].isDefault = true;
            addressList.value[0].selected = true;
            checkboxGroup.value = [addressList.value[0].id];
          }
          uni.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    },
  });
};

// 修改弹窗标题的计算属性
const popupTitle = computed(() => {
  return isEditMode.value ? '修改收货地址' : '新增收货地址';
});

// 修改编辑地址函数
const editAddress = (item: AddressItem) => {
  // 设置编辑模式
  isEditMode.value = true;
  editingAddressId.value = item.id;

  // 填充表单数据
  newAddress.value = {
    receiverName: item.receiverName,
    phone: item.phone,
    province: item.province,
    city: item.city,
    district: item.district,
    detailAddress: item.detailAddress,
    isDefault: item.isDefault,
  };

  // 设置地区显示文本
  selectedRegion.value = `${item.province} ${item.city} ${item.district}`.trim();

  // 显示弹窗
  showAddPopup.value = true;
};

// 处理设为默认地址
const handleSetDefault = (item: AddressItem) => {
  if (item.isDefault) {
    uni.showToast({ title: '当前已是默认地址', icon: 'none' });
    return;
  }

  // 取消其他地址的默认状态
  addressList.value.forEach((addr) => {
    addr.isDefault = false;
    addr.selected = false;
  });

  // 设置当前地址为默认
  item.isDefault = true;
  item.selected = true;

  // 更新复选框组
  checkboxGroup.value = [item.id];

  uni.showToast({ title: '已设为默认地址', icon: 'success' });
};

// 可以删除原来的 toggleDefault 函数，因为已经被 handleSetDefault 替代
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
  align-items: flex-start;
  justify-content: space-between;
}

.address-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  flex: 1;
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
