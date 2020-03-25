import { routerRedux } from 'dva/router';
import { queryQWuestionsList,removeQuestions } from '@/services/question';

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
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeQuestions, payload);
      if (response.code === 200) {
        if (callback && typeof callback == 'function') {
          callback(response); // 返回结果
        }
      }
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
