import { routerRedux } from 'dva/router';
import { estateList } from '@/services/interacte';

export default {
  namespace: 'estate',
  
  state: {
    data:[],
    estateMap:[],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        const response = yield call(estateList, payload);
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