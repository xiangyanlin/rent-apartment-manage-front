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