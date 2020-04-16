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
      *submitEstateForm({ payload }, { call }) {
        yield call(addEstate, payload);
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