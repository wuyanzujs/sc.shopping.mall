import type { ProvinceData, SendCodeReq, SendCodeRes, UploadRes } from './types';
import { get, post, upload } from '@/utils/request';
/**
 * 通用接口
 */
import { BU_URL } from '../config';

// 文件上传
export const uploadFile = (filePath: string) =>
  upload<UploadRes>('/common/upload', { filePath, name: 'file' });

// 发送验证码
export const sendCode = (data: SendCodeReq) => post<SendCodeRes>('/sendCode', { data });

// 获取地区
export const getRegion = () => get<ProvinceData>(`${BU_URL}/doc_web/json/cities`);
