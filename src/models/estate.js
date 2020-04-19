import { routerRedux } from 'dva/router';
import { estateList ,queryEstate,addEstate,updateEstate,deleteEstate} from '@/services/estate';
import {message} from "antd";
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
      *list({ payload }, { call, put }) {
        const response = yield call(queryEstate, payload);
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
      *updateEstateForm({ payload }, { call }) {
        yield call(updateEstate, payload);
        message.success('提交成功');
      },
  
      *delete({ payload, callback }, { call }) {
        const response = yield call(deleteEstate, payload);
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