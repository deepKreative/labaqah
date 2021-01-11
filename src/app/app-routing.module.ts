import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderSummaryPage } from './checkout/order-summary/order-summary.page';
import { HomePage } from './home/home.page';
import { VendorListPage } from './vendor/vendor-list/vendor-list.page';

const routes: Routes = [



  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'order-summary/:id', component: OrderSummaryPage },
  {
    path: 'vendor-cat/:name',
    loadChildren: () => import('./vendor/vendor-cat/vendor-cat.module').then( m => m.VendorCatPageModule)
  },
 
  {
    path: 'login1',
    loadChildren: () => import('./login1/login1.module').then( m => m.Login1PageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then( m => m.AboutUsPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./terms/terms.module').then( m => m.TermsPageModule)
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  // },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: '',
    redirectTo: '/splash',
    pathMatch: 'full'
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
  }
  // {
  //   path: 'vendor-cat/:name',
  //   loadChildren: () => import('./vendor/vendor-cat/vendor-cat.module').then( m => m.VendorCatPageModule)
  // },

  //{ path: 'edit-address', loadChildren: './account/edit-address/edit-address.module#EditAddressPageModule' },
  //{ path: 'map', loadChildren: './account/map/map.module#MapPageModule' },

    // {
    //   path: '',
    // component: HomePage,
    // },
    // {
    //   path: 'vender',
    //   component: VendorListPage
    // },
 
  
 
    
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
