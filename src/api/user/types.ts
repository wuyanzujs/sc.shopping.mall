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

export interface UserAddress {
/**
 * 地区，例如：云南省 丽江市 古城区
 */
  area: string;
  /**
   * 详细地址，例如：雪山路412号
   */
  detail_address: string;
  /**
   * 默认，是否设置为默认地址，Y则是，N或“”则否
   */
  is_default: string;
  /**
   * 手机号
   */
  mobile: string;
  /**
   * 姓名
   */
  name: string;
}

export interface AddUserAddressParams extends AddressItem {
  /**
   * 账户id
   */
  acc_id: string;
}

export interface AddressItem {
  acc_id: string;
  area: string;
  detail_address: string;
  is_default: string;
  mobile: string;
  name: string;
}

export interface UserAddress extends AddressItem {
  uuid: string;
  acc_id: string;
}
