import type { IResponse } from '@/utils/request/types';
/**
 * 用户信息相关接口
 */
import type { AddUserAddressParams, LoginByCodeRes, LoginRes, SignUpParams, SignUpRes, UserAddress, UserPhoneNumber } from './types';
import { get, post } from '@/utils/request';
import { API_URL, BU_URL } from '../config';

/** 登录 */
// export const login = (data: LoginReq) => post<LoginRes>(`${BU_URL}/user_app/accounts/signup`, { data, custom: { auth: false } });

export const loginByCode = (code: string) => get<LoginByCodeRes>(`${API_URL}/wx/wx/agent/session/${code}`);

// 获取用户信息
export const getUserInfo = (openid: string) => get<LoginRes>(`${BU_URL}/pat_app/account-openid/${openid}`);

// 获取手机号
export const getUserPhonenumber = (code: any) => get<UserPhoneNumber>(`${API_URL}/wx/wx/agent/phone/${code}`);

// 注册
export const signUp = (data: SignUpParams) => post<SignUpRes>(`${BU_URL}/user_app/accounts/signup`, { data });

// 添加收货地址
export const addAddress = (data: AddUserAddressParams) => post<IResponse>(`${BU_URL}/user_app/address/add`, { data });

// 获取收货地址
export const getAddressList = (data: { acc_id: string }) => post<UserAddress[]>(`${BU_URL}/user_app/address/find`, { data });

// 更新收货地址
export const updateAddress = (data: UserAddress) => post<IResponse>(`${BU_URL}/user_app/address/update`, { data });

// 删除收货地址
export const deleteAddress = (data: { uuid: string }) => post<IResponse>(`${BU_URL}/user_app/address/del`, { data });
