import { routerRedux } from 'dva/router';
import {queryRoleAll, queryRole, removeRole, addRole, updateRole } from '@/services/role';

export default {
  namespace: 'role',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    roles:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *getRoles({ payload }, { call, put }) {
      const response = yield call(queryRoleAll, payload);
      yield put({
        type: 'saveRoles',
        payload: response,
      });
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeRole, payload);
      if (response.code === 200) {
        if (callback && typeof callback == 'function') {
          callback(response); // 返回结果
        }
      }
    },
    *submitRole({ payload, callback }, { call }) {
      const response = yield call(addRole, payload);
      if (callback && typeof callback == 'function') {
        callback(response); // 返回结果
      }
    },
    *updateRole({ payload, callback }, { call }) {
      const response = yield call(updateRole, payload);
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
    saveRoles(state, action) {
      return {
        ...state,
        roles: action.payload.data,
      };
    },
  },
};
