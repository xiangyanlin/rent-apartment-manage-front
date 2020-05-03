import { query as queryUsers, queryUserList,queryCurrent,updateUser,addUser,removeUser } from '@/services/user';
import { message } from 'antd';
export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    currentUser: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
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
    *updateUserForm({ payload,callback }, { call }) {
      const response=yield call(updateUser, payload);
      if (response.code == 200) {
        message.success('修改成功');
        if (callback && typeof callback == 'function') {
          callback(response); // 返回结果
        }
      }
     
    },
    //删除用户
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeUser, payload);
      if (response.code === 200) {
        if (callback && typeof callback == 'function') {
          callback(response); // 返回结果
        }
      }
    },
    //新增用户
    *submitUser({ payload, callback }, { call }) {
      const response = yield call(addUser, payload);
      if (callback && typeof callback == 'function') {
        callback(response); // 返回结果
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
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
