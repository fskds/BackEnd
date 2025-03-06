/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/admin',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/admin/login',
        component: './Login/Admin',
      },
    ],
  },
  {
    name: 'customer',
    path: '/customer',
    icon: 'TeamOutlined',
    routes: [
      {
        path: '/customer',
        redirect: '/customer/admin',
      },
      {
        name: 'admin',
        path: '/customer/admin',
        icon: 'VerifiedOutlined',
        routes: [
          {
            path: '/customer/admin',
            redirect: '/customer/admin/admin',
          },
          {
            name: 'admin',
            path: '/customer/admin/admin',
            icon: 'UserOutlined',
            component: './Admin/Admin',
          },
          {
            name: 'role',
            path: '/customer/admin/role',
            icon: 'LockOutlined',
            component: './Admin/Role',
          },
          {
            name: 'permission',
            path: '/customer/admin/permission',
            icon: 'KeyOutlined',
            component: './Admin/Permission',
          },
        ],
      },
      {
        name: 'member',
        path: '/customer/member',
        icon: 'UserSwitchOutlined',
				// routes: [
					// {
								// name: 'log',
								// path: '/customer/member/log',
								// icon: 'UserOutlined',
								// component: './Member/Log',
					// },
				// ],
      },
    ],
  },
  {
    name: 'sitedata',
    path: '/sitedata',
    icon: 'DatabaseOutlined',
    //component: './System',
    routes: [
      {
        path: '/sitedata',
        redirect: '/sitedata/content',
      },
      {
        name: 'menu',
        path: '/sitedata/menu',
        icon: 'MenuOutlined',
        routes: [
          {
            path: '/sitedata/menu',
            redirect: '/sitedata/menu/nav',
          },
           {
             name: 'nav',
             path: '/sitedata/menu/nav',
             icon: 'ClusterOutlined',
             component: './Menu/Nav',
           },
           {
             name: 'tag',
             path: '/sitedata/menu/tag',
             icon: 'TagsOutlined',
             component: './Menu/Tag',
           },
        ],
      },
      {
        name: 'content',
        path: '/sitedata/content',
        icon: 'FolderOpenOutlined',
        routes: [
         {
           path: '/sitedata/content',
           redirect: '/sitedata/content/article',
         },
         {
           name: 'column',
           path: '/sitedata/content/column',
           icon: 'GroupOutlined',
           component: './Content/Column',
         },
         {
           name: 'article',
           path: '/sitedata/content/article',
           icon: 'ReadOutlined',
           component: './Content/Article',
         },
         {
           name: 'banner',
           path: '/sitedata/content/banner',
           icon: 'FireOutlined',
           component: './Content/Banner',
         },
        ],
      },
      {
        name: 'adjunct',
        path: '/sitedata/adjunct',
        icon: 'ReconciliationOutlined',
        //component: './Enclosure',
        routes:[
          {
            name: 'picture',
            path: '/sitedata/adjunct/picture',
            icon: 'FileImageOutlined',
            component: './Adjunct/Picture',
          },
        ],
      }
    ],
  },
  {
    name: 'sitesys',
    path: '/sitesys',
    icon: 'ControlOutlined',
    //component: './System',
    routes: [
      {
        path: '/sitesys',
        redirect: '/sitesys/info',
      },
      {
        name: 'info',
        path: '/sitesys/info',
        icon: 'DeploymentUnitOutlined',
        routes: [
          {
            path: '/sitesys/info',
            redirect: '/sitesys/info/basic',
          },
           {
             name: 'basic',
             path: '/sitesys/info/basic',
             icon: 'BarsOutlined',
             component: './Info/Webset',
           },
        ],
      },
    ],
  },

  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/sub-page',
      },
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        component: './Admin',
      },
    ],
  },

  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
