import type { CreateOrderData } from '@/api/order/types';
import { createOrder } from '@/api/order';

// 支付状态枚举
export enum PaymentStatus {
  SUCCESS = 'success',
  CANCEL = 'cancel',
  FAIL = 'fail',
}

// 支付结果接口
export interface PaymentResult {
  status: PaymentStatus;
  message: string;
  orderNo?: string;
  transactionId?: string;
}

// 微信支付参数接口
export interface WechatPayParams {
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}

// 支付配置接口
export interface PaymentConfig {
  orderData: CreateOrderData;
  onSuccess?: (result: PaymentResult) => void;
  onCancel?: (result: PaymentResult) => void;
  onFail?: (result: PaymentResult) => void;
}

/**
 * 微信支付工具函数
 * @param config 支付配置
 * @returns Promise<PaymentResult>
 */
export async function useWechatPay(config: PaymentConfig): Promise<PaymentResult> {
  const { orderData, onSuccess, onCancel, onFail } = config;

  try {
    // 1. 创建订单并获取支付参数
    uni.showLoading({ title: '支付中...' });

    // TODO: 调用真实的创建订单API
    const orderResponse = await createOrder(orderData);
    console.log('orderResponse', orderResponse);
    if (!orderResponse.success) {
      throw new Error(orderResponse.message || '创建订单失败');
    }

    // TODO: 调用真实的获取支付参数API
    const payParams = await getWechatPayParams(orderResponse.orderno);
    console.log('payParams', payParams);

    uni.hideLoading();

    // 3. 发起微信支付
    const paymentResult = await requestWechatPayment(payParams);

    // 4. 处理支付结果
    switch (paymentResult.status) {
      case PaymentStatus.SUCCESS:
        // 支付成功后确认订单状态
        await confirmOrderPayment(orderResponse.orderno);
        onSuccess?.(paymentResult);
        break;
      case PaymentStatus.CANCEL:
        onCancel?.(paymentResult);
        break;
      case PaymentStatus.FAIL:
        onFail?.(paymentResult);
        break;
    }

    return paymentResult;
  }
  catch (error: any) {
    uni.hideLoading();
    const failResult: PaymentResult = {
      status: PaymentStatus.FAIL,
      message: error.message || '支付失败',
    };
    onFail?.(failResult);
    return failResult;
  }
}

/**
 * 获取微信支付参数
 * @param orderNo 订单号
 * @returns Promise<WechatPayParams>
 */
async function getWechatPayParams(_orderNo: string): Promise<WechatPayParams> {
  // TODO: 替换为真实的API调用
  // 这里应该调用后端接口获取微信支付参数
  const response = await uni.request({
    url: 'YOUR_API_BASE_URL/payment/wechat/params',
    method: 'POST',
    data: { orderNo: _orderNo },
  });

  if (response.statusCode !== 200 || !(response.data as any).success) {
    throw new Error('获取支付参数失败');
  }

  return (response.data as any).data;
}

/**
 * 发起微信支付请求
 * @param payParams 微信支付参数
 * @returns Promise<PaymentResult>
 */
function requestWechatPayment(payParams: WechatPayParams): Promise<PaymentResult> {
  return new Promise((resolve) => {
    uni.requestPayment({
      provider: 'wxpay',
      orderInfo: {
        timeStamp: payParams.timeStamp,
      },
      nonceStr: payParams.nonceStr,
      package: payParams.package,
      signType: payParams.signType,
      paySign: payParams.paySign,
      success: (res) => {
        resolve({
          status: PaymentStatus.SUCCESS,
          message: '支付成功',
          transactionId: res.transactionId,
        });
      },
      fail: (err) => {
        if (err.errMsg.includes('cancel')) {
          resolve({
            status: PaymentStatus.CANCEL,
            message: '用户取消支付',
          });
        }
        else {
          resolve({
            status: PaymentStatus.FAIL,
            message: err.errMsg || '支付失败',
          });
        }
      },
    });
  });
}

/**
 * 确认订单支付状态
 * @param orderNo 订单号
 * @returns Promise<void>
 */
async function confirmOrderPayment(orderNo: string): Promise<void> {
  // TODO: 替换为真实的API调用
  // 这里应该调用后端接口确认订单支付状态
  try {
    await uni.request({
      url: 'YOUR_API_BASE_URL/order/confirm-payment',
      method: 'POST',
      data: { orderNo },
    });
  }
  catch (error) {
    console.error('确认订单支付状态失败:', error);
    // 这里可以选择是否抛出错误，或者只是记录日志
  }
}

/**
 * 快速支付函数 - 简化版本
 * @param orderData 订单数据
 * @returns Promise<PaymentResult>
 */
export async function quickPay(orderData: CreateOrderData): Promise<PaymentResult> {
  return useWechatPay({
    orderData,
    onSuccess: (_result) => {
      uni.showToast({
        title: '支付成功',
        icon: 'success',
      });
    },
    onCancel: (_result) => {
      uni.showToast({
        title: '支付已取消',
        icon: 'none',
      });
    },
    onFail: (result) => {
      uni.showToast({
        title: result.message,
        icon: 'error',
      });
    },
  });
}
