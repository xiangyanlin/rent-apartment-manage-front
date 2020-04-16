import request from '@/utils/request';
import { stringify } from 'qs';
export async function addHouseResource(params) {
  return request('/xyl/houseResources/save', {
    method: 'POST',
    body: params,
  });
}



export async function updateHouseResource(params) {
  return request('/xyl/houseResources/update', {
    method: 'PUT',
    body: params,
  });
}

export async function deleteHouseResource(params) {
  return request(`/xyl/houseResources/delete?${stringify(params)}`, {
    method: 'delete',
  });
}
