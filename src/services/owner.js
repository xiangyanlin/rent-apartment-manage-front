import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryOwnerList(params) {
  return request(`/xyl/user/list?${stringify(params)}`);
}
