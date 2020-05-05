import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryContractList(params) {
  return request(`/xyl/contract/list?${stringify(params)}`);
}

//删除
export async function removeContract(params) {
  return request(`/xyl/contract/delete?${stringify(params)}`, {
    method: 'delete',
  });
}

//新增
export async function addContract(params) {
  return request('/xyl/contract/save', {
    method: 'POST',
    body: params,
  });
}
//修改
export async function updateContract(params) {
  return request('/xyl/contract/update', {
    method: 'PUT',
    body: params,
  });
}