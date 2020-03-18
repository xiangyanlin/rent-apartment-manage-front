import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryRentManage(params) {
  return request(`/xyl/rentRecord/manage?${stringify(params)}`);
}
