import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { addHouseResource, updateHouseResource, deleteHouseResource } from '@/services/interacte';

export default {
  namespace: 'house',

  state: {},

  effects: {
    *submitHouseForm({ payload }, { call }) {
      yield call(addHouseResource, payload);
      message.success('提交成功');
    },
    *updateHouseForm({ payload }, { call }) {
      yield call(updateHouseResource, payload);
      message.success('提交成功');
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteHouseResource, payload);
      if (response.code === 200) {
        if (callback && typeof callback == 'function') {
          callback(response); // 返回结果
        }
      }
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
      };
    },
  },
};
