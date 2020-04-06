import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryVistRequest(params) {
  return request(`/xyl/vistRequest/list?${stringify(params)}`);
}

export async function queryRequestList(params) {
  return request(`/xyl/vistRequest/requestList?${stringify(params)}`);
}
//新增
export async function addVistRequest(params) {
  return request('/xyl/vistRequest/save', {
    method: 'POST',
    body: params,
  });
}