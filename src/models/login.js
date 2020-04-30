import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
//import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { userLogin } from '@/services/user';


export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(userLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.data.status === 'ok') {
        window.localStorage.setItem("currentUser",response.data.currentUser);
        reloadAuthorized();
        const p=window.localStorage.getItem("antd-pro-authority");
        const au=JSON.parse(p);
        if (au.length==1&&au[0]=="admin")
        {
          window.location.href="/admin";
        }else{
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.startsWith('/#')) {
                redirect = redirect.substr(2);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
          yield put(routerRedux.replace(redirect || '/'));
        }
        
       
      }
    },
    //弹框登录
    *frontLogin({ payload ,callback}, { call, put }) {
      const response = yield call(userLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.data.status === 'ok') {
        window.localStorage.setItem("currentUser",response.data.currentUser);
        reloadAuthorized();
        if (callback && typeof callback == 'function') {
          callback(response); // 返回结果
        }
      }
    },
    //手机号码登录
    // *getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },
    //后台退出登录
    *logout(_, { put }) {
      window.localStorage.removeItem("currentUser");
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
         data:{
          currentAuthority: 'guest'
         },
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
    //前台退出登录
    *frontlogout(_, { put }) {
      window.localStorage.removeItem("currentUser");
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
         data:{
          currentAuthority: 'guest'
         },
        },
      });
      reloadAuthorized();
      location.reload();
    },
    //首页设置访客
    *setGuest(_, { put }) {
      const userName=window.localStorage.getItem("currentUser");
        if(userName==null){
          setAuthority({currentAuthority: 'guest'});
        }
      
      }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const authority=payload.data.currentAuthority.split(",")
      setAuthority(authority);
      return {
        ...state,
        status: payload.data.status,
        type: payload.data.type,
      };
    },
  },
};
