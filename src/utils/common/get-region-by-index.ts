import type { ProvinceData } from '@/api/common/types';

// 更新函数签名，第三个参数应该是values数组而不是单个value
export const getRegionByIndex = (list: ProvinceData, columnIndex: number, values: string[]) => {
  if (columnIndex === 0) {
    // 选择了省份，返回对应的城市和第一个城市的区县
    const province = list.find(item => item.label === values[0]);
    const citylist = province?.children?.map(item => item.label) || [];
    const firstCity = province?.children?.[0];
    const districtlist = firstCity?.children?.map(item => item.label) || [];

    return {
      citylist,
      districtlist,
    };
  }

  if (columnIndex === 1) {
    // 选择了城市，返回对应的区县
    const province = list.find(item => item.label === values[0]);
    const city = province?.children?.find(item => item.label === values[1]);
    const districtlist = city?.children?.map(item => item.label) || [];

    return {
      citylist: undefined,
      districtlist,
    };
  }

  return {
    citylist: undefined,
    districtlist: undefined,
  };
};
