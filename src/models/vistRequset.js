import { routerRedux } from 'dva/router';
import { queryVistRequest ,queryRequestList,addVistRequest,updateVistRequest,deleteVistRequest} from '@/services/vistRequest';
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
      *requestList({ payload }, { call, put }) {
        const response = yield call(queryRequestList, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      },
      *submitVistForm({ payload }, { call }) {
        yield call(addVistRequest, payload);
        message.success('提交成功');
      },
      *updateVistRequestForm({ payload ,callback}, { call }) {
        const response=yield call(updateVistRequest, payload);
        if (response.code == 200) {
          if (callback && typeof callback == 'function') {
            callback(response); // 返回结果
          }
        }
      },
      
      *delete({ payload, callback }, { call }) {
        const response = yield call(deleteVistRequest, payload);
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