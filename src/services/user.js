import request from '@/utils/request';
import { stringify } from 'qs';

export async function query() {
  return request('/api/users');
}
//当前用户
export async function queryCurrent(params) {
  return request(`/xyl/user/currentUser?${stringify(params)}`);
}

export async function queryUserList(params) {
  return request(`/xyl/user/list?${stringify(params)}`);
}
//用户登录
export async function userLogin(params) {
  return request(`/xyl/user/login?${stringify(params)}`);
}

//用户注册
export async function userRegister(params) {
  return request('/xyl/user/register',{
    method: 'POST',
    body: params,
  });
}


//新增
export async function addUser(params) {
  return request('/xyl/user/save', {
    method: 'POST',
    body: params,
  });
}

//删除
export async function removeUser(params) {
  return request(`/xyl/user/delete?${stringify(params)}`, {
    method: 'delete',
  });
}

//修改用户信息
export async function updateUser(params) {
  return request('/xyl/user/update', {
    method: 'PUT',
    body: params,
  });
}
//用户总数
export async function queryUserTotal() {
  return request('/xyl/user/total');
}

//按月查询用户数量
export async function countUserByMon(params) {
  return request(`/xyl/user/countByMon?${stringify(params)}`);
}
