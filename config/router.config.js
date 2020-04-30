export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/admin',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin'],
    routes: [
      { path: '/admin', redirect: '/admin/dashboard/analysis' },
      // dashboard
      { path: '/admin/dashboard', redirect: '/admin/dashboard/analysis' },

      {
        path: '/admin/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        authority: ['admin', 'dashboard'],
        hideChildrenInMenu: false,
        routes: [
          {
            path: '/admin/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/admin/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/admin/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      {
        // 房源管理
        path: '/admin/house',
        name: 'house',
        icon: 'home',
        authority: ['admin', 'house'],
        routes: [
          {
            path: '/admin/house/resource',
            name: 'resource',
            component: './xyl/House/Resource',
          },
          {
            path: '/admin/house/estate',
            name: 'estate',
            component: './xyl/House/Estate',
          },
          {
            path: '/admin/house/addResource',
            name: 'addResource',
            component: './xyl/House/AddResource',
          },
          {
            path: '/admin/house/addEstate',
            name: 'addEstate',
            component: './xyl/House/addEstate',
          },
          {
            path: '/admin/house/kanfang',
            name: 'kanfang',
            component: './xyl/House/KanFang',
          },
          {
            path: '/admin/house/zufang',
            name: 'zufang',
            component: './xyl/House/ZuFang',
          },
        ],
      },

      {
        // 房东管理
        path: '/admin/owner',
        name: 'fangdong',
        icon: 'key',
        authority: ['admin', 'owner'],
        routes: [
          {
            path: '/admin/owner/list',
            name: 'list',
            component: './xyl/Owner/List',
          },
        ],
      },

      {
        // 用户管理
        path: '/admin/users',
        name: 'users',
        icon: 'user',
        authority: ['admin', 'consumer'],
        routes: [
          {
            path: '/admin/users/list',
            name: 'list',
            component: './xyl/Users/List',
          },
        ],
      },

      {
        // 合约管理
        path: '/admin/contract',
        authority: ['admin', 'contract'],
        name: 'heyue',
        icon: 'file-text',
        routes: [
          {
            path: '/admin/contract/list',
            name: 'list',
            component: './xyl/Contract/List',
          },
        ],
      },

      {
        // 资讯管理
        path: '/admin/news',
        name: 'news',
        icon: 'message',
        authority: ['admin', 'news'],
        routes: [
          {
            path: '/admin/news/list',
            name: 'list',
            component: './xyl/News/List',
          },
          {
            path: '/admin/news/addNews',
            name: 'addNews',
            component: './xyl/News/AddNews',
          },
        ],
      },

      {
        // 问答管理
        path: '/admin/question',
        name: 'qa',
        icon: 'question-circle',
        authority: ['admin', 'qa'],
        routes: [
          {
            path: '/admin/question/list',
            name: 'list',
            component: './xyl/Question/List',
          },
        ],
      },

      // {
      //   // 财务管理
      //   path: '/admin/finance',
      //   name: 'finance',
      //   icon: 'money-collect',
      //   routes: [
      //     {
      //       path: '/admin/finance/bill',
      //       name: 'bill',
      //       component: './xyl/Finance/Bill',
      //     },
      //     {
      //       path: '/admin/finance/tixian',
      //       name: 'tixian',
      //       component: './xyl/Finance/TiXian',
      //     },
      //   ],
      // },

      {
        // 系统管理
        path: '/admin/system',
        name: 'system',
        icon: 'laptop',
        authority: ['admin'],
        routes: [
          {
            path: '/admin/system/role',
            name: 'authority',
            component: './xyl/System/Role',
          },
          {
            path: '/admin/system/dict',
            name: 'dict',
            component: './xyl/System/Dict',
          },
          {
            path: '/admin/system/contract',
            name: 'contract',
            component: './xyl/System/Contract',
          },
        ],
      },

      // // forms
      // {
      //   path: '/admin/form',
      //   icon: 'form',
      //   name: 'form',
      //   routes: [
      //     {
      //       path: '/admin/form/basic-form',
      //       name: 'basicform',
      //       component: './Forms/BasicForm',
      //     },
      //     {
      //       path: '/admin/form/step-form',
      //       name: 'stepform',
      //       component: './Forms/StepForm',
      //       hideChildrenInMenu: true,
      //       routes: [
      //         {
      //           path: '/admin/form/step-form',
      //           name: 'stepform',
      //           redirect: '/admin/form/step-form/info',
      //         },
      //         {
      //           path: '/admin/form/step-form/info',
      //           name: 'info',
      //           component: './Forms/StepForm/Step1',
      //         },
      //         {
      //           path: '/admin/form/step-form/confirm',
      //           name: 'confirm',
      //           component: './Forms/StepForm/Step2',
      //         },
      //         {
      //           path: '/admin/form/step-form/result',
      //           name: 'result',
      //           component: './Forms/StepForm/Step3',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/admin/form/advanced-form',
      //       name: 'advancedform',
      //       authority: ['admin'],
      //       component: './Forms/AdvancedForm',
      //     },
      //   ],
      // },
      // // list
      // {
      //   path: '/admin/list',
      //   icon: 'table',
      //   name: 'list',
      //   routes: [
      //     {
      //       path: '/admin/list/table-list',
      //       name: 'searchtable',
      //       component: './List/TableList',
      //     },
      //     {
      //       path: '/admin/list/basic-list',
      //       name: 'basiclist',
      //       component: './List/BasicList',
      //     },
      //     {
      //       path: '/admin/list/card-list',
      //       name: 'cardlist',
      //       component: './List/CardList',
      //     },
      //     {
      //       path: '/admin/list/search',
      //       name: 'searchlist',
      //       component: './List/List',
      //       routes: [
      //         {
      //           path: '/admin/list/search',
      //           redirect: '/admin/list/search/articles',
      //         },
      //         {
      //           path: '/admin/list/search/articles',
      //           name: 'articles',
      //           component: './List/Articles',
      //         },
      //         {
      //           path: '/admin/list/search/projects',
      //           name: 'projects',
      //           component: './List/Projects',
      //         },
      //         {
      //           path: '/admin/list/search/applications',
      //           name: 'applications',
      //           component: './List/Applications',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/admin/profile',
      //   name: 'profile',
      //   icon: 'profile',
      //   routes: [
      //     // profile
      //     {
      //       path: '/admin/profile/basic',
      //       name: 'basic',
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/admin/profile/advanced',
      //       name: 'advanced',
      //       authority: ['admin'],
      //       component: './Profile/AdvancedProfile',
      //     },
      //   ],
      // },
      // {
      //   name: 'result',
      //   icon: 'check-circle-o',
      //   path: '/admin/result',
      //   routes: [
      //     // result
      //     {
      //       path: '/admin/result/success',
      //       name: 'success',
      //       component: './Result/Success',
      //     },
      //     { path: '/admin/result/fail', name: 'fail', component: './Result/Error' },
      //   ],
      // },
      {
        name: 'exception',
        icon: 'warning',
        path: '/admin/exception',
        routes: [
          // exception
          {
            path: '/admin/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/admin/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/admin/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/admin/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      //管理员个人中心
      {
        name: 'account',
        icon: 'user',
        path: '/admin/account',
        routes: [
          {
            path: '/admin/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/admin/account/center',
                redirect: '/admin/account/center/MyRequest',
              },
              {
                path: '/admin/account/center/myHouse',
                component: './Account/Center/MyHouse',
              },
              {
                path: '/admin/account/center/MyObtainRequest',
                component: './Account/Center/MyObtainRequest',
              },
              {
                path: '/admin/account/center/MyRequest',
                component: './Account/Center/MyRequest',
              },
              {
                path: '/admin/account/center/addResource',
                component: './Account/Center/AddResource',
              },
              {
                path: '/admin/account/center/addEstate',
                component: './Account/Center/AddEstate',
              },
            ],
          },
          {
            path: '/admin/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/admin/account/settings',
                redirect: '/admin/account/settings/base',
              },
              {
                path: '/admin/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/admin/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/admin/account/settings/password',
                component: './Account/Settings/PasswordView',
              },
              {
                path: '/admin/account/settings/certification',
                component: './Account/Settings/CertificationView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
  //前台
  {
    path: '/home',
    name: 'home',
    component: './front/home',
  },
  {
    path: '/',
    component: '../layouts/FrontLayout',
    routes: [
      { path: '/', redirect: '/home' },
      //租房
      {
        path: '/house/projects',
        name: 'projects',
        hide: true,
        component: './front/Rent/Projects',
      },
      {
        path: '/house/details',
        name: 'houseDetails',
        component: './front/Rent/details',
      },
      //资讯
      {
        path: '/info/list',
        name: 'info',
        hide: true,
        component: './front/Info/Information',
      },
      {
        path: '/info/details',
        name: 'infoDetails',
        component: './front/Info/InfoDetail',
      },
      //问答
      {
        path: '/question/list',
        name: 'question',
        hide: true,
        component: './front/Question/Question',
      },
      {
        path: '/question/publish',
        name: 'questionPublish',
        component: './front/Question/Publish',
      },
      {
        path: '/question/detail',
        name: 'questionDetail',
        component: './front/Question/QuestionDetail',
      },

      //个人中心
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/MyRequest',
              },
              {
                path: '/account/center/myHouse',
                component: './Account/Center/MyHouse',
              },
              {
                path: '/account/center/MyObtainRequest',
                component: './Account/Center/MyObtainRequest',
              },
              {
                path: '/account/center/MyRequest',
                component: './Account/Center/MyRequest',
              },
              {
                path: '/account/center/addResource',
                component: './Account/Center/AddResource',
              },
              {
                path: '/account/center/addEstate',
                component: './Account/Center/AddEstate',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/FrontInfo',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/FrontSecurityView',
              },
              {
                path: '/account/settings/password',
                component: './Account/Settings/PasswordView',
              },
              {
                path: '/account/settings/certification',
                component: './Account/Settings/CertificationView',
              },
            ],
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
    ],
  },
];
