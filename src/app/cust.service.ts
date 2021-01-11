import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class CustService {

  sharedData:string;

  user: any;

  LOG_INFO='LOG_INFO';
  USERNAME= 'USER_NAME';
  USEREMAIL= 'USER_EMAIL';
  USERNAME_G= 'USER_NAME_G';
  USEREMAIL_G= 'USER_EMAIL_G';
  USERNAME_R= 'USER_NAME_R';
  USEREMAIL_R= 'USER_EMAIL_R';
  USERTYPE = 'USER_TYPE';
  USERID = 'USER_ID';
  VENDORID = 'VENDOR_ID';

  VENDORLOCATONLAT = 'VENDORLOCATONLAT';
  VENDORLOCATONLONG = 'VENDORLOCATONLONG';

  USERINFORMATION = 'USERINFORMATION';
  DELLOCATIONLAT = "DELLOCATIONLAT";
  DELLOCATIONMAPLAT = "DELLOCATIONMAPLAT";
  DELLOCATIONLNG = "DELLOCATIONLNG";
  DELLOCATIONMAPLNG = "DELLOCATIONMAPLNG";
  ISVENDOR = "ISVENDOR";
  ISVENDORID = "ISVENDORID";
  constructor(public storage: Storage) { }

  async haveLocationLat()
  {
    const result = await this.storage.get('DELLOCATIONLAT');

    return result;
  }
  async venodrlocationLat()
  {
    const result = await this.storage.get('VENDORLOCATON_LAT');

    return result;
  }
  async venodrlocationLong()
  {
    const result = await this.storage.get('VENDORLOCATON_LONG');

    return result;
  }
  async haveLocationMapLat()
  {
    const result = await this.storage.get('DELLOCATIONMAPLAT');

    return result;
  }
  async haveLocationLNG()
  {
    const result = await this.storage.get('DELLOCATIONLNG');

    return result;
  }
  async haveLocationMAPLNG()
  {
    const result = await this.storage.get('DELLOCATIONMAPLNG');

    return result;
  }
  async isloggedIn()
  {
    const result = await this.storage.get('LOG_INFO');

    return result;
  }

  async getUserId()
  {
    const result = await this.storage.get('USER_ID');
    return result;
  }

  async getCurrentLang()
  {
    const result = await this.storage.get('LANG');
    return result;
  }
  async getUserInfo()
  {

    const email = await this.storage.get(this.USEREMAIL);
    const name = await this.storage.get(this.USERNAME);
    const loginfo = await this.storage.get(this.LOG_INFO);
    let map =  new Map();
    map.set(this.USERNAME,name);
    map.set(this.LOG_INFO,loginfo);
    map.set(this.USEREMAIL,email);
    return map;
  }

  async getvendorId()
  {
    const result = await this.storage.get(this.VENDORID);
    return result;
  }

  async getuserName()
  {
    const userName = await this.storage.get('USERNAME');
    return userName;
  }
  async getIsVendor()
  {
    const isVendor = await this.storage.get('ISVENDOR');
    return isVendor;
  }
  async getIsVendorId()
  {
    const isVendorId = await this.storage.get('ISVENDORID');
    return isVendorId;
  }
  async getuserEmail()
  {
    const userEmail = await this.storage.get('USEREMAIL');
    return userEmail;
  }
  async getuserNameG()
  {
    const userNameG = await this.storage.get('USERNAME_G');
    return userNameG;
  }
  async getuserEmailG()
  {
    const userEmail_G = await this.storage.get('USER_EMAIL_G');
    return userEmail_G;
  }
  async getuserNameR()
  {
    const userNameR = await this.storage.get('USER_NAME_R');
    return userNameR;
  }
  async getuserEmailR()
  {
    const userEmail_R = await this.storage.get('USER_EMAIL_R');
    return userEmail_R;
  }
  async getSherdData()
  {
    return this.sharedData;
  }
 
}
