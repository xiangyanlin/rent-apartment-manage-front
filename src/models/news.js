import { routerRedux } from 'dva/router';
import { queryInformationList } from '@/services/news';

export default {
  namespace: 'news',
  
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        const response = yield call(queryInformationList, payload);
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