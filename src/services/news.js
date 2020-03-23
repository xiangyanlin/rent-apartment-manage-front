import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryInformationList(params) {
  return request(`/xyl/information/list?${stringify(params)}`);
}