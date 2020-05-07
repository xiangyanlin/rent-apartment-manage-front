import { routerRedux } from 'dva/router';
import { queryRentManage,removeRentCord,addRentCord,updateRentCord } from '@/services/zufang';

export default {
  namespace: 'zufang',
  
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        const response = yield call(queryRentManage, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      },
      *remove({ payload, callback }, { call }) {
        const response = yield call(removeRentCord, payload);
        if (response.code === 200) {
          if (callback && typeof callback == 'function') {
            callback(response); // 返回结果
          }
        }
      },
      *submitRentCord({ payload, callback }, { call }) {
        const response = yield call(addRentCord, payload);
        if (callback && typeof callback == 'function') {
          callback(response); // 返回结果
        }
      },
      *updateRentCord({ payload, callback }, { call }) {
        const response = yield call(updateRentCord, payload);
        if (callback && typeof callback == 'function') {
          callback(response); // 返回结果
        }
      },
  },

  reducers: {
    save(state, action) {
      const map=new Map(action.payload.data);
        return {
          ...state,
          data: action.payload,
          estateMap:map,
          //length:data.length(),
        };
      },
    },
};