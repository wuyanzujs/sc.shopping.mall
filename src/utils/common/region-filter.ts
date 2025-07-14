import type { ProvinceData } from '@/api/common/types';

export const regionFilter = (list: ProvinceData) => {
  const province = list.map((item) => {
    return item.label;
  });
  const firstCity = list[0].children?.map((item) => {
    return item.label;
  });
  const firstDistrict = list[0].children?.[0].children?.map((item) => {
    return item.label;
  });
  return {
    province,
    firstCity,
    firstDistrict,
  };
};
