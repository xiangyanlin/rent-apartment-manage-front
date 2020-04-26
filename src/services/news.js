import request from '@/utils/request';
import { stringify } from 'qs';
//列表
export async function queryInformationList(params) {
  return request(`/xyl/information/list?${stringify(params)}`);
}
//删除
export async function removeNews(params) {
  return request(`/xyl/information/delete?${stringify(params)}`, {
    method: 'delete',
  });
}


//新增
export async function addInformation(params) {
  return request('/xyl/information/save', {
    method: 'POST',
    body: params,
  });
}
//修改
export async function updateInformation(params) {
  return request('/xyl/information/update', {
    method: 'PUT',
    body: params,
  });
}