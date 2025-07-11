export type RoleType = '' | '*' | 'user';
export interface UserState {
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
