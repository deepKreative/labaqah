import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Login1PageRoutingModule } from './login1-routing.module';

import { Login1Page } from './login1.page';


import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Login1PageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [Login1Page]
})
export class Login1PageModule {}
