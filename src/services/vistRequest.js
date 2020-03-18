import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryVistRequest(params) {
  return request(`/xyl/vistRequest/list?${stringify(params)}`);
}