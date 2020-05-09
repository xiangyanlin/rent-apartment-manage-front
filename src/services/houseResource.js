import request from '@/utils/request';
import { stringify } from 'qs';
//房源列表
export async function queryResource(params) {
  return request(`/xyl/houseResources/list?${stringify(params)}`);
}
//修改
export async function updateHouseResource(params) {
  return request('/xyl/houseResources/update', {
    method: 'PUT',
    body: params,
  });
}
//删除
export async function deleteHouseResource(params) {
  return request(`/xyl/houseResources/delete?${stringify(params)}`, {
    method: 'delete',
  });
}
//新增
export async function addHouseResource(params) {
  return request('/xyl/houseResources/save', {
    method: 'POST',
    body: params,
  });
}

//根据ID查询
export async function queryById(params) {
  return request(`/xyl/houseResources/selectOne?${stringify(params)}`);
}

//房源总量
export async function queryResourceToTal() {
  return request('/xyl/houseResources/total');
}

//精装房占比
export async function decorationProp() {
  return request('/xyl/houseResources/decorationProp');
}

//按朝向统计房源
export async function countHouseByO() {
  return request('/xyl/houseResources/countByO');
}