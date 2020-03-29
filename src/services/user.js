import request from '@/utils/request';
import { stringify } from 'qs';

export async function query() {
  return request('/api/users');
}
//当前用户
export async function queryCurrent(params) {
  return request(`/xyl/user/currentUser?${stringify(params)}`);
}

export async function queryOwnerList(params) {
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

