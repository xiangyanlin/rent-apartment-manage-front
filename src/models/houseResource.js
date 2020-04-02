import { queryResource,addHouseResource, updateHouseResource, deleteHouseResource,queryById } from '@/services/houseResource';

export default {
  namespace: 'houseResource',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryResource, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
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
    *queryById({ payload }, { call ,put}) {
      const response=yield call(queryById, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
        return {
        ...state,
        data: action.payload,
      };
    },
  },
};
