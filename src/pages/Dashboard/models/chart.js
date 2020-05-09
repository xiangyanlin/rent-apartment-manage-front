import { fakeChartData } from '@/services/api';
import {queryUserTotal,countUserByMon} from '@/services/user';
import {queryResourceToTal,decorationProp,countHouseByO} from '@/services/houseResource';
import {queryEstateToTal} from '@/services/estate';
export default {
  namespace: 'chart',

  state: {
    userTotal:{},
    houseTotal:{},
    decorationProp:{},
    estateTotal:{},
    userNumbyTime:[],
    countHouseByO:[],
    salesData: [],
    searchData: [],
    offlineData: [],
    offlineChartData: [],
    salesTypeData: [],
    salesTypeDataOnline: [],
    salesTypeDataOffline: [],
    radarData: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchSalesData(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
    *fetchUserTotal(_, { call, put }) {
      const response = yield call(queryUserTotal);
      yield put({
        type: 'save',
        payload: {
          userTotal: response.data,
        },
      });
    },
    *fetchHouseTotal(_, { call, put }) {
      const response = yield call(queryResourceToTal);
      yield put({
        type: 'save',
        payload: {
          houseTotal: response.data,
        },
      });
    },
    *fetchEstateTotal(_, { call, put }) {
      const response = yield call(queryEstateToTal);
      yield put({
        type: 'save',
        payload: {
          estateTotal: response.data,
        },
      });
    },
    *fetchDecorationProp(_, { call, put }) {
      const response = yield call(decorationProp);
      yield put({
        type: 'save',
        payload: {
          decorationProp: response.data,
        },
      });
    },
    *countUserByMon({ payload }, { call, put }) {
      const response = yield call(countUserByMon, payload);
      yield put({
        type: 'save',
        payload: {
          userNumbyTime:response.data,
        },
      });
    },
    *counHouseByO({ payload }, { call, put }) {
      const response = yield call(countHouseByO, payload);
      yield put({
        type: 'save',
        payload: {
          countHouseByO:response.data,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        userTotal:{},
        houseTotal:{},
        decorationProp:{},
        estateTotal:{},
        userNumbyTime:[],
        countHouseByO:[],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    },
  },
};
