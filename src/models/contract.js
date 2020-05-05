import { routerRedux } from 'dva/router';
import { queryContractList ,removeContract,addContract,updateContract} from '@/services/contract';

export default {
  namespace: 'contract',
  
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        const response = yield call(queryContractList, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      },
      *remove({ payload, callback }, { call }) {
        const response = yield call(removeContract, payload);
        if (response.code === 200) {
          if (callback && typeof callback == 'function') {
            callback(response); // 返回结果
          }
        }
      },
      *submitContract({ payload, callback }, { call }) {
        const response = yield call(addContract, payload);
        if (callback && typeof callback == 'function') {
          callback(response); // 返回结果
        }
      },
      *updateContract({ payload, callback }, { call }) {
        const response = yield call(updateContract, payload);
        if (callback && typeof callback == 'function') {
          callback(response); // 返回结果
        }
      },
  },

  reducers: {
    save(state, action) {
      const map=new Map(action.payload.data);
        return {
          ...state,
          data: action.payload,
        };
      },
    },
};