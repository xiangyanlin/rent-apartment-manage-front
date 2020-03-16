import Axios from 'axios';
import { message } from 'antd';

export function ajax(url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    const qs = require('qs');
    let promise;
    //1.执行异步ajax请求
    if (type === 'GET') {
      promise = Axios.get(url, {
        params: data,
        paramsSerializer: function(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      });
    } else {
      promise = Axios.post(url, data);
    }

    //2.如果成功了，调用resolve（value）
    promise
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        message.error('请求出错了:' + error.message);
      });
  });
}
