import { routerRedux } from 'dva/router';
import { estateList } from '@/services/interacte';

export default {
  namespace: 'estate',
  
  state: {
     data:{
      code:{},
      message:{},
       data:[],
    },
    estateMap:new Map([
      ['中远两湾城','1001|上海市,上海市,普陀区,远景路97弄'],
      ['上海康城','1002|上海市,上海市,闵行区,莘松路958弄'],
      ['保利西子湾','1003|上海市,上海市,松江区,广富林路1188弄'],
      ['万科城市花园','1004|上海市,上海市,闵行区,七莘路3333弄2区-15区'],
      ['上海阳城','1005|上海市,上海市,闵行区,罗锦路888弄']
    ]),
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        const response = yield call(estateList, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      }
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