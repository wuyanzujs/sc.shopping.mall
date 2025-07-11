/**
 * 用户信息相关接口
 */
import type { LoginByCodeRes, LoginRes, SignUpParams, SignUpRes, UserPhoneNumber } from './types';
import { get, post } from '@/utils/request';
import { API_URL, BU_URL } from '../config';

/** 登录 */
// export const login = (data: LoginReq) => post<LoginRes>(`${BU_URL}/user_app/accounts/signup`, { data, custom: { auth: false } });

export const loginByCode = (code: string) => get<LoginByCodeRes>(`${API_URL}/wx/wx/agent/session/${code}`);

// 获取用户信息
export const getUserInfo = (openid: string) => get<LoginRes>(`${BU_URL}/user_app/account-openid/${openid})`);

// 获取手机号
export const getUserPhonenumber = (code: any) => get<UserPhoneNumber>(`${API_URL}/wx/wx/agent/phone/${code}`);

// 注册
export const signUp = (data: SignUpParams) => post<SignUpRes>(`${BU_URL}/user_app/accounts/signup`, { data });
