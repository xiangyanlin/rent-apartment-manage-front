import { routerRedux } from 'dva/router';
import { queryVistRequest ,addVistRequest} from '@/services/vistRequest';
import { message } from 'antd';
export default {
  namespace: 'vistRequset',
  
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        const response = yield call(queryVistRequest, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      },
      *submitVistForm({ payload }, { call }) {
        yield call(addVistRequest, payload);
        message.success('提交成功');
      },
  },

  reducers: {
    save(state, action) {
      const map=new Map(action.payload.data);
        return {
          ...state,
          data: action.payload,
          estateMap:map,
          //length:data.length(),
        };
      },
    },
};