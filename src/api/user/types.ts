export interface LoginReq {
  /**
   * 来自哪个小程序
   */
  app: string;
  /**
   * 微信头像
   */
  avatarUrl: string;
  /**
   * 电话
   */
  mobile: string;
  /**
   * 微信昵称
   */
  nickname: string;
  /**
   * 微信OpenId
   */
  openid: string;
  /**
   * 微信Unionid
   */
  unionid: string;
  /**
   * 账号UUID
   */
  uuid?: string;
}

export interface LoginRes {
  /**
   * 来自哪个小程序，301 || 302
   */
  app: string;
  /**
   * 微信头像
   */
  avatarUrl: string;
  /**
   * 电话
   */
  mobile: string;
  /**
   * 微信昵称
   */
  nickname: string;
  /**
   * 微信OpenId
   */
  openid: string;
  /**
   * 微信Unionid
   */
  unionid: string;
  /**
   * 账号UUID
   */
  uuid: string;
}

export interface LoginByCodeRes {
  /**
   * openid
   */
  openid: string;
  /**
   * unionid
   */
  unionid?: string;
}

interface PhoneInfo {
  countryCode: string;
  phoneNumber: string;
  purePhoneNumber: string;
}

export interface UserPhoneNumber {
  phone_info: PhoneInfo;
}

export interface SignUpParams {
  openid: string;
  unionid?: string;
  nickname: string;
  avatarUrl: string;
  mobile: string;
  app: string;
}

export interface SignUpRes {
  app: string;
  avatarUrl: string;
  mobile: string;
  nickname: string;
  openid: string;
  unionid: string;
  uuid: string;
}
