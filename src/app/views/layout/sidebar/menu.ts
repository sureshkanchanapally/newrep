import { MenuItem } from './menu.model';

// export const MENU: MenuItem[] = [

//   // {
//   //   label: 'Web Apps',
//   //   isTitle: true
//   // },
//   {
//     label: 'Dashboard',
//     icon: 'home',
//     link: 'dashboard',
//   },
//   {
//     label: 'Products',
//     icon: 'home',
//     link: 'products-details',
//   },
//   {
//     label: 'Device',
//     icon: 'home',
//     link: 'device',
//   },
//   {
//     label: 'Users',
//     icon: 'home',
//     link: 'users',
//   },
//   {
//     label: 'Test',
//     icon: 'home',
//     link: 'test',
//   },
//   {
//     label: 'Industry',
//     icon: 'home',
//     link: 'industry',
//   },
//   {
//     label: 'Factory',
//     icon: 'home',
//     link: 'factory',
//   },
//   {
//     label: 'Reports',
//     icon: 'home',
//     link: 'reports',
//   },

// ];
export const MENU: MenuItem[] = [

  {
    label: 'Web Apps',
    isTitle: true
  },
  {
    label: 'Email',
    icon: 'mail',
    subItems: [
      {
        label: 'Inbox',
        link: '/apps/email/inbox',
      },
      {
        label: 'Read',
        link: '/apps/email/read'
      },
      {
        label: 'Compose',
        link: '/apps/email/compose'
      },
    ]
  },
  {
    label: 'Chat',
    icon: 'message-square',
    link: '/apps/chat',
  }
];
