import { query as queryUsers, queryCurrent,updateUser } from '@/services/user';
import { message } from 'antd';
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    //获取当前登录用户
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent,payload);
      //console.log(response.data)
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },
    //修改用户信息
    *updateUserForm({ payload }, { call }) {
      yield call(updateUser, payload);
      message.success('修改成功');
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
