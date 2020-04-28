import request from '@/utils/request';
import { stringify } from 'qs';
//列表
export async function queryQWuestionsList(params) {
  return request(`/xyl/questions/list?${stringify(params)}`);
}

//联合用户列表
export async function queryQuestionsUser(params) {
  return request(`/xyl/questions/qa?${stringify(params)}`);
}
//删除
export async function removeQuestions(params) {
  return request(`/xyl/questions/delete?${stringify(params)}`, {
    method: 'delete',
  });
}

//新增
export async function addQuestions(params) {
  return request('/xyl/questions/save', {
    method: 'POST',
    body: params,
  });
}
//修改
export async function updateQuestions(params) {
  return request('/xyl/questions/update', {
    method: 'PUT',
    body: params,
  });
}