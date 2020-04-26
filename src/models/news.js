import { routerRedux } from 'dva/router';
import { queryInformationList ,removeNews,addInformation,updateInformation} from '@/services/news';

export default {
  namespace: 'news',
  
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        const response = yield call(queryInformationList, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      },
      *remove({ payload, callback }, { call }) {
        const response = yield call(removeNews, payload);
        if (response.code === 200) {
          if (callback && typeof callback == 'function') {
            callback(response); // 返回结果
          }
        }
      },
      *submitInformationForm({ payload,callback }, { call }) {
        const response = yield call(addInformation, payload);
        if (callback && typeof callback == 'function') {
          callback(response); // 返回结果
        }
      },
      *updateInformation({ payload ,callback}, { call }) {
        const response = yield call(updateInformation, payload);
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
          estateMap:map,
          //length:data.length(),
        };
      },
    },
};