import { routerRedux } from 'dva/router';
import { queryQWuestionsList,queryQuestionsUser,removeQuestions,addQuestions,updateQuestions } from '@/services/question';

export default {
  namespace: 'question',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    value:{
      list:[],
      pagination: {},
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryQWuestionsList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *list({ payload }, { call, put }) {
      const response = yield call(queryQuestionsUser, payload);
      yield put({
        type: 'saveRecord',
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
    *submitQuestions({ payload,callback }, { call }) {
      const response = yield call(addQuestions, payload);
      if (callback && typeof callback == 'function') {
        callback(response); // 返回结果
      }
    },
    *updateQuestions({ payload ,callback}, { call }) {
      const response = yield call(updateQuestions, payload);
      if (callback && typeof callback == 'function') {
        callback(response); // 返回结果
      }
    },
  },

  reducers: {
    save(state, action) {
      const map = new Map(action.payload.data);
      return {
        ...state,
        data: action.payload,
      };
    },
    saveRecord(state, action) {
      return {
        ...state,
        value: action.payload,
      };
    },
  },
};
