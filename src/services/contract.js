import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryContractList(params) {
  return request(`/xyl/contract/list?${stringify(params)}`);
}