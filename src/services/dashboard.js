import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryMonitor(params) {
  return request(`/xyl/monitor/server?${stringify(params)}`);
}