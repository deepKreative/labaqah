import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorCatPage } from './vendor-cat.page';

const routes: Routes = [
  {
    path: '',
    component: VendorCatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorCatPageRoutingModule {}
