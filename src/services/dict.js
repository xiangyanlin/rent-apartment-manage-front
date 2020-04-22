import request from '@/utils/request';
import { stringify } from 'qs';
//类型
 //新增
 export async function addDictType(params) {
    return request('/xyl/dictType/save', {
      method: 'POST',
      body: params,
    });
  }
//列表
export async function queryDictTypeAll(params) {
  return request(`/xyl/dictType/selectAll?${stringify(params)}`);
}

//通过id获取
export async function getDictTypeById(params) {
  return request(`/xyl/dictType/selectOne?${stringify(params)}`);
}
//修改
export async function updateDictType(params) {
  return request('/xyl/dictType/update', {
    method: 'PUT',
    body: params,
  });
}
//删除
export async function deleteDictType(params) {
  return request(`/xyl/dictType/delete?${stringify(params)}`, {
    method: 'delete',
  });
}
//数据
     //新增
export async function addDict(params) {
    return request('/xyl/dict/save', {
      method: 'POST',
      body: params,
    });
  }
//全部
export async function queryDict(params) {
  return request(`/xyl/dict/list?${stringify(params)}`);
}
//修改
export async function updateDict(params) {
  return request('/xyl/dict/update', {
    method: 'PUT',
    body: params,
  });
}
//删除
export async function deleteDict(params) {
  return request(`/xyl/dict/delete?${stringify(params)}`, {
    method: 'delete',
  });
}