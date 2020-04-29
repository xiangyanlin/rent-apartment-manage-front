import { queryTags } from '@/services/api';
import { queryMonitor } from '@/services/dashboard';
export default {
  namespace: 'monitor',

  state: {
    tags: [],
    server:{},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMonitor, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchTags(_, { call, put }) {
      const response = yield call(queryTags);
      yield put({
        type: 'saveTags',
        payload: response.list,
      });
    },

  },

  reducers: {
    saveTags(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        server: action.payload.data,
      };
    },
  },
};
