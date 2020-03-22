import request from '@/utils/request';
import { stringify } from 'qs';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryOwnerList(params) {
  return request(`/xyl/user/list?${stringify(params)}`);
}
