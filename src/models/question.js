import { routerRedux } from 'dva/router';
import { queryQWuestionsList } from '@/services/question';

export default {
  namespace: 'question',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryQWuestionsList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      const map = new Map(action.payload.data);
      return {
        ...state,
        data: action.payload,
        estateMap: map,
        //length:data.length(),
      };
    },
  },
};
