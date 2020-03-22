import { routerRedux } from 'dva/router';
import { queryVistRequest } from '@/services/vistRequest';

export default {
  namespace: 'vistRequset',
  
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        const response = yield call(queryVistRequest, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      }
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