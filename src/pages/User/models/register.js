import { fakeRegister } from '@/services/api';
import { userRegister ,queryCurrent} from '@/services/user';
import { message } from 'antd';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload ,callback}, { call, put }) {
      const response = yield call(userRegister, payload);
      if (response.code === 200) {
        message.success('注册成功'); 
        window.location.href="/user/login";
        if (callback && typeof callback == 'function') {
          callback(response); // 返回结果
        }
      }
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },

    *checkUserName({ payload, callback }, { call }) {
      const response = yield call(queryCurrent, payload);
      if (callback && typeof callback == 'function') {
        callback(response); // 返回结果
      }
    },
  },

//   reducers: {
//     registerHandle(state, { payload }) {
//       setAuthority('user');
//       reloadAuthorized();
//       return {
//         ...state,
//         status: payload.status,
//       };
//     },
//   },
 };
