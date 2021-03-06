import request from '@/utils/request';
import { stringify } from 'qs';
//列表
export async function queryRole(params) {
  return request(`/xyl/role/list?${stringify(params)}`);
}

//删除
export async function removeRole(params) {
  return request(`/xyl/role/delete?${stringify(params)}`, {
    method: 'delete',
  });
}

//新增
export async function addRole(params) {
  return request('/xyl/role/save', {
    method: 'POST',
    body: params,
  });
}
//修改
export async function updateRole(params) {
  return request('/xyl/role/update', {
    method: 'PUT',
    body: params,
  });
}
//全部
export async function queryRoleAll(params) {
  return request(`/xyl/role/selectAll?${stringify(params)}`);
}
