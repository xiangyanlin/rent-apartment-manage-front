import {
  queryUserList,
  queryCurrent,
  updateUser,
  addUser,
  removeUser,
  sendVerification,
  queryByUserNameAndEmail,
  verificationCheck,
  updatePWByVerificationCode,
} from '@/services/user';
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
      const response = yield call(queryCurrent, payload);
      //console.log(response.data)
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },

    //发送邮箱验证码
    *sendMailCode({ payload }, { call, put }) {
      yield call(sendVerification, payload);
    },
    //根据用户名和邮箱查询用户
    *queryByUserNameAndEmail({ payload, callback }, { call }) {
      const response = yield call(queryByUserNameAndEmail, payload);
      if (callback && typeof callback == 'function') {
        callback(response); // 返回结果
      }
    },
    //验证邮箱验证码
    *verificationCheck({ payload, callback }, { call }) {
      const response = yield call(verificationCheck, payload);
      if (callback && typeof callback == 'function') {
        callback(response); // 返回结果
      }
    },
    //通过邮箱验证码修改密码
    *updatePWByVerificationCode({ payload, callback }, { call }) {
      const response = yield call(updatePWByVerificationCode, payload);
      if (callback && typeof callback == 'function') {
        callback(response); // 返回结果
      }
    },
    //修改用户信息
    *updateUserForm({ payload, callback }, { call }) {
      const response = yield call(updateUser, payload);
      if (response.code == 200) {
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
    *checkUserName({ payload, callback }, { call }) {
      const response = yield call(queryCurrent, payload);
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
