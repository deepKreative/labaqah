import { LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  // API_URL = 'https://www.theplatform-x.com/vms/index.php/public_calls/';
  // API_URL_HTTP = 'http://www.theplatform-x.com/vms/index.php/public_calls/';
  LOGINFO ="LOG_INFO";
  USERID = "USER_ID";
  USERNAME ="USER_NAME";
  ADDRESS ="ADDRESS";
 LNG_KEY = 'SELECTED_LANGUAGE';
  
  constructor(private loadingCntl:LoadingController) { }

  loginSubject = new Subject<any>();
  cartSubject = new Subject<any>();


  publishSomeData(data: any) {
      this.loginSubject.next(data);
  }

  getObservable(): Subject<any> {
      return this.loginSubject;
  }

  publishcartupdate(data: any) {
    this.cartSubject.next(data);
}

getCartSubject(): Subject<any> {
  return this.cartSubject;
}

getCurrentLang(): Subject<any> {
  return this.cartSubject;
}





}