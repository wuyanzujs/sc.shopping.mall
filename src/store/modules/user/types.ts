export type RoleType = '' | '*' | 'user';
export interface UserState {
  uuid?: string; // 用户唯一标识
  openid?: string;
  unionid?: string;
  user_id?: string;
  user_name?: string;
  avatar?: string;
  token?: string;
  mobile?: string;
}

export type providerType =
  | 'weixin'
  | 'qq'
  | 'sinaweibo'
  | 'xiaomi'
  | 'apple'
  | 'univerify'
  | undefined;
