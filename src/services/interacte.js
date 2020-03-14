import request from '@/utils/request';

export async function addHouseResource(params) {
  return request('/xyl/houseResources/save', {
    method: 'POST',
    body: params,
  });
}

export async function estateList() {
  return request('/xyl/estate/selectAll', {
    method: 'POST',
  });
}

export async function updateHouseResource(params) { 
  return request('/xyl/houseResources/update', {
     method: 'PUT', 
     body: params ,
    });
   }