import type { AddressItem, SignUpParams, UserAddress } from '@/api/user/types';
import type { providerType, UserState } from './types';
import { UserApi } from '@/api';

import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    uuid: '', // 用户唯一标识
    openid: '',
    unionid: '',
    user_id: '',
    user_name: '',
    avatar: '',
    mobile: '',
  }),
  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },
  actions: {
    // 小程序授权登录
    async authLogin(provider: providerType = 'weixin') {
      return new Promise<boolean>((resolve, reject) => {
        uni.login({
          provider,
          success: async (result: UniApp.LoginRes) => {
            if (result.code) {
              const res = await UserApi.loginByCode(result.code);
              this.openid = res.openid;
              try {
                const userinfo = await UserApi.getUserInfo(res.openid);
                resolve(!!userinfo.uuid);
              }
              catch (e: any) {
                console.log(e);
                resolve(false);
              }
            }
            else {
              reject(new Error(result.errMsg));
            }
          },
          fail: (err: any) => {
            console.error(`login error: ${err}`);
            reject(err);
          },
        });
      });
    },

    // 获取用户信息
    async profile() {
      const userinfo = await UserApi.getUserInfo(this.openid!);
      this.user_name = userinfo.nickname;
      this.avatar = userinfo.avatarUrl;
      this.mobile = userinfo.mobile;
      this.unionid = userinfo.unionid;
      this.uuid = userinfo.uuid;
    },

    // 获取手机号
    async getUserPhonenumber(code: string) {
      const phoneInfo = await UserApi.getUserPhonenumber(code);
      return phoneInfo.phone_info;
    },

    async signUp(signInfo: SignUpParams) {
      const userinfo = await UserApi.signUp(signInfo);
      this.user_name = userinfo.nickname;
      this.avatar = userinfo.avatarUrl;
      this.mobile = userinfo.mobile;
      this.unionid = userinfo.unionid;
      this.openid = userinfo.openid;
      this.uuid = userinfo.uuid;
    },

    // 获取用户地址列表
    async getUserAddressList() {
      return await UserApi.getAddressList({ acc_id: this.uuid });
    },

    // 添加用户地址
    async addUserAddress(address: AddressItem) {
      return await UserApi.addAddress(address);
    },

    // 更新用户地址
    async updateUserAddress(address: UserAddress) {
      return await UserApi.updateAddress(address);
    },

    // 删除用户地址
    async deleteUserAddress(uuid: string) {
      return await UserApi.deleteAddress({ uuid });
    },

    // 退出登录
    async logout() {
      this.$reset();
    },
  },
  persist: true,
});

export default useUserStore;
