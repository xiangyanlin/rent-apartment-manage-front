import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryResource(params) {
  return request(`/xyl/houseResources/list?${stringify(params)}`);
}
