import request from '@/utils/request';
import { stringify } from 'qs';

export async function estateList() {
    return request('/xyl/estate/selectAll', {
      method: 'POST',
    });
  }

  //新增
export async function addEstate(params) {
    return request('/xyl/estate/save', {
      method: 'POST',
      body: params,
    });
  }
//列表
export async function queryEstate(params) {
  return request(`/xyl/estate/list?${stringify(params)}`);
}
//修改
export async function updateEstate(params) {
  return request('/xyl/estate/update', {
    method: 'PUT',
    body: params,
  });
}
//删除
export async function deleteEstate(params) {
  return request(`/xyl/estate/delete?${stringify(params)}`, {
    method: 'delete',
  });
}

//楼盘总量
export async function queryEstateToTal() {
  return request('/xyl/estate/total');
}