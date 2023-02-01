import { Routes } from '@angular/router';
import { ErrorPageComponent } from './views/authentication/error-page/error-page.component';
import { BaseComponent } from './views/layout/base/base.component';


export const appRoutes: Routes = [
  {
    path: '',
    component: BaseComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'device',
        loadChildren: () => import('./views/pages/device/device.module').then(m => m.DeviceModule)
      },
      {
        path: 'roles',
        loadChildren: () => import('./views/pages/roles/roles.module').then(m => m.RolesModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./views/pages/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'test',
        loadChildren: () => import('./views/pages/test/test.module').then(m => m.TestModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('./views/pages/menu/menu.module').then(m => m.MenuModule)
      },
      {
        path: 'industry',
        loadChildren: () => import('./views/pages/industry/industry.module').then(m => m.IndustryModule)
      },
      {
        path: 'factory',
        loadChildren: () => import('./views/pages/factory/factory.module').then(m => m.FactoryModule)
      },
      {
        path: 'product',
        loadChildren: () => import('./views/pages/productsnew/productsnew.module').then(m => m.ProductsnewModule)
      },
      {
        path: 'productsop',
        loadChildren: () => import('./views/pages/productsop/productsop.module').then(m => m.ProductsopModule)
      },
      {
        path: 'order-register',
        loadChildren: () => import('./views/pages/order-registration/order-registration.module').then(m => m.OrderRegistrationModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./views/pages/orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./views/pages/category/category.module').then(m => m.CategoryModule)
      },
      {
        path: 'labels',
        loadChildren: () => import('./views/pages/labels/labels.module').then(m => m.LabelsModule)
      },
      {
        path: 'sizes',
        loadChildren: () => import('./views/pages/size/size.module').then(m => m.SizeModule)
      },
      {
        path: 'pattren',
        loadChildren: () => import('./views/pages/pattren/pattren.module').then(m => m.PattrenModule)
      },
      {
        path: 'fabrics',
        loadChildren: () => import('./views/pages/fabric/fabric.module').then(m => m.FabricModule)
      },
      {
        path: 'products-details',
        loadChildren: () => import('./views/pages/productsgrid/productsgrid.module').then(m => m.ProductsgridModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./views/pages/products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'schedule',
        loadChildren: () => import('./views/pages/schedule-qc/schedule-qc.module').then(m => m.ScheduleQcModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./views/pages/report/report.module').then(m => m.ReportModule)
      },

      // ------------------------------------- Header Pages ------------------------------------------

      {
        path: 'Profile',
        loadChildren: () => import('./views/pages/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'changepassword',
        loadChildren: () => import('./views/pages/changepassword/changepassword.module').then(m => m.ChangepasswordModule)
      },
      {
        path: 'Help',
        loadChildren: () => import('./views/pages/help/help.module').then(m => m.HelpModule)
      },
      {
        path: 'FAQ',
        loadChildren: () => import('./views/pages/faq/faq.module').then(m => m.FaqModule)
      },
      {
        path: 'Privacy&security',
        loadChildren: () => import('./views/pages/privacy-security/privacy-security.module').then(m => m.PrivacySecurityModule)
      },

    ]
  },

  {
    path: 'error',
    component: ErrorPageComponent,
    data: {
      'type': 404,
      'title': 'Page Not Found',
      'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
    }
  },
  { path: 'error/:type',  component: ErrorPageComponent },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];
