import type { SignUpParams } from '@/api/user/types';
import type { providerType, UserState } from './types';
import { UserApi } from '@/api';

import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
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
    authLogin(provider: providerType = 'weixin') {
      return new Promise((resolve, reject) => {
        uni.login({
          provider,
          success: async (result: UniApp.LoginRes) => {
            if (result.code) {
              const res = await UserApi.loginByCode(result.code);
              this.openid = res.openid;
              resolve(res);
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
      return await UserApi.getUserInfo(this.openid!);
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
    },

    // 退出登录
    async logout() {
      this.$reset();
    },
  },
  persist: true,
});

export default useUserStore;
