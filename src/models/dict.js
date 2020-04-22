import { routerRedux } from 'dva/router';
import { addDictType ,queryDictTypeAll,updateDictType,deleteDictType,
    addDict,queryDict,updateDict,deleteDict ,getDictTypeById}
    from '@/services/dict';
import {message} from "antd";
export default {
  namespace: 'dict',
  
  state: {
    data:{
      list: [],
      pagination: {},
    },
    types:{},
    type:{},
  },

  effects: {
      //类型
      *dictTypeAll({ payload }, { call, put }) {
        const response = yield call(queryDictTypeAll, payload);
        yield put({
          type: 'saveTypes',
          payload: response,
        });
      },
      *dictTypeOne({ payload }, { call, put }) {
        const response = yield call(getDictTypeById, payload);
        yield put({
          type: 'saveType',
          payload: response,
        });
      },
      *submitDictTypeForm({ payload,callback }, { call }) {
        const response=yield call(addDictType, payload);
        if (response.code === 200) {
          if (callback && typeof callback == 'function') {
            callback(response); // 返回结果
          }
        }
      },
      *updateDictTypeForm({ payload }, { call }) {
        yield call(updateDictType, payload);
        message.success('提交成功');
      },
  
      *deleteDictType({ payload, callback }, { call }) {
        const response = yield call(deleteDictType, payload);
        if (response.code === 200) {
          if (callback && typeof callback == 'function') {
            callback(response); // 返回结果
          }
        }
      },
      //数据
      *dictList({ payload }, { call, put }) {
        const response = yield call(queryDict, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      },
      *submitDictForm({ payload,callback }, { call }) {
        const response=yield call(addDict, payload);
        if (response.code === 200) {
          if (callback && typeof callback == 'function') {
            callback(response); // 返回结果
          }
        }
      },
      *updateDictForm({ payload }, { call }) {
        yield call(updateDict, payload);
        message.success('提交成功');
      },
  
      *deleteDict({ payload, callback }, { call }) {
        const response = yield call(deleteDict, payload);
        if (response.code === 200) {
          if (callback && typeof callback == 'function') {
            callback(response); // 返回结果
          }
        }
      },
  },

  reducers: {
    save(state, action) {
        return {
          ...state,
          data: action.payload,
          //length:data.length(),
        };
      },
      saveTypes(state, action) {
          return {
            ...state,
            types: action.payload,
            //length:data.length(),
          };
        },
        saveType(state, action) {
          return {
            ...state,
            type: action.payload,
            //length:data.length(),
          };
        },
    },
    
};