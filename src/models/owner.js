import { routerRedux } from 'dva/router';
import { queryOwnerList } from '@/services/owner';

export default {
  namespace: 'owner',
  
  state: {
    data:[],
    estateMap:[],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        const response = yield call(queryOwnerList, payload);
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