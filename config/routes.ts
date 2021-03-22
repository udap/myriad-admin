export default [
  {
    layout: false,
    path: '/login',
    component: './Login',
  },
  {
    path: '/agency',
    name: 'agency',
    icon: 'bank',
    access: 'isPlatform',
    routes: [
      {
        path: '/agency/approval',
        name: 'approval',
        icon: 'table',
        component: './ApprovalAgency',
      },
      {
        path: '/agency/management',
        name: 'management',
        icon: 'smile',
        component: './ManagementAgency',
      },
    ],
  },
  {
    path: '/account',
    name: 'account',
    icon: 'Team',
    access: 'isPlatform',
    routes: [
      {
        path: '/account/management',
        name: 'management',
        icon: 'table',
        component: './AccountManagement',
      },
    ],
  },
  {
    path: '/',
    redirect: '/agency/approval',
  },
  {
    component: './404',
  },
];
