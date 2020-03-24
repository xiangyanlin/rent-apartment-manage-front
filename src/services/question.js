import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryQWuestionsList(params) {
  return request(`/xyl/questions/list?${stringify(params)}`);
}
