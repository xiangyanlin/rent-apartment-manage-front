import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryRentManage(params) {
  return request(`/xyl/rentRecord/manage?${stringify(params)}`);
}

//删除
export async function removeRentCord(params) {
  return request(`/xyl/rentRecord/delete?${stringify(params)}`, {
    method: 'delete',
  });
}

//新增
export async function addRentCord(params) {
  return request('/xyl/rentRecord/save', {
    method: 'POST',
    body: params,
  });
}
//修改
export async function updateRentCord(params) {
  return request('/xyl/rentRecord/update', {
    method: 'PUT',
    body: params,
  });
}
