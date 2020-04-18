import { routerRedux } from 'dva/router';
import { estateList ,addEstate} from '@/services/estate';

export default {
  namespace: 'estate',
  
  state: {
    data:[],
    estateMap:[],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        const response = yield call(estateList, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      },
      *submitEstateForm({ payload,callback }, { call }) {
        const response=yield call(addEstate, payload);
        if (response.code === 200) {
          if (callback && typeof callback == 'function') {
            callback(response); // 返回结果
          }
        }
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