import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, AlertController, ModalController, NavParams, LoadingController, NavController, Platform } from '@ionic/angular';
import { CustService } from '../cust.service';
import { Storage } from '@ionic/storage';
import { EnvService } from 'src/env.service';
import { ApiService } from '../api.service';
import { Settings } from '../data/settings';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-login1',
  templateUrl: './login1.page.html',
  styleUrls: ['./login1.page.scss'],
})
export class Login1Page implements OnInit {
  
  @ViewChild('mySlider')  slides: IonSlides;
  slideOpts = { autoplay: false, loop: false, lazy: true };
  icons: any = new Array(60);
  segment: any = 'login';
  form: any;
  formRegister: any;
  formSMS: any;
  loginTab: boolean = true;
  path: any = 'account';
  errors: any;
  errorsRegister: any;
  status: any = {};
  disableSubmit: boolean = false;
  pushForm: any = {};
  googleStatus: any = {};
  faceBookStatus: any = {};
  googleLogingInn: boolean = false;
  facebookLogingInn: boolean = false;
  phoneLogingInn: boolean = false;
  userInfo: any;
  phoneVerificationError: any;
  loading: any;
  isVendor:boolean= false;

  constructor( public Cust : CustService , 
    private storege : Storage,
    private envService : EnvService,
    public alertCntl : AlertController,
    public modalCtrl: ModalController,  
    public platform: Platform, 
    private oneSignal: OneSignal, 
    public api: ApiService, 
    public settings: Settings, 
    public loadingController: LoadingController, 
    public router: Router, 
    public navCtrl: NavController, 
    private fb: FormBuilder/*, private firebase: FirebaseAuthentication*//**/, 
    private googlePlus: GooglePlus,/* private facebook: Facebook*/) {
      // public navParams: NavParams,

      this.form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
    console.log(this.form);
    this.formRegister = this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', Validators.email],
        phone: ['', Validators.required],
        password: ['', Validators.required],
      
        
      });
      this.formSMS = this.fb.group({
        country_code: ['+91', Validators.required],
        phone: ['', Validators.required],
        sms: ['', Validators.required],
        phoneVerificationID: ['', Validators.required],
      });

  
  
  
  }

  close(status) {
    this.router.navigateByUrl("/tabs/home");
       
}
//   closeR(status) {
//     this.router.navigateByUrl("/login1");
       
// }

  ngOnInit() {

   //this.path = this.navParams.data.path;
    console.log(this.status);
  }

  async onSubmit() {

    const loading = await this.loadingController.create({
        message: 'Loading...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
    });

    if(this.form.valid) {
        this.loginWithUsername();
        this.router.navigateByUrl("/tabs/home");
        loading.dismiss();
      
    } else if(this.formSMS.valid) {
        this.verify();
        loading.dismiss();
    }
}
async loginWithUsername() {
  this.disableSubmit = true;
  await this.api.postItem('login', this.form.value).then(res => {
      this.status = res; 
      if (this.status.errors) {
          this.envService.publishSomeData({
              isloggedin:true
          });
          this.errors = this.status.errors;
          for (var key in this.errors) {
    
              this.errors[key].forEach((item, index) => {
                  this.errors[key][index] = this.errors[key][index].replace('<strong>ERROR<\/strong>:', '');
                  this.errors[key][index] = this.errors[key][index].replace('/a>', '/span>');
                  this.errors[key][index] = this.errors[key][index].replace('<a', '<span');
              });
          }
      } else if (this.status.data) {
        // console.log('this.status.data',this.status);
          this.settings.customer.id = this.status.ID;
          this.Cust.user = this.status.ID;
          this.isVendor = this.status.allcaps.seller;
          this.storege.set(this.Cust.LOG_INFO,true);
          this.storege.set(this.Cust.USERID,this.status.ID);
          this.storege.set(this.Cust.USERNAME,this.status.data.display_name);
          this.storege.set(this.Cust.USEREMAIL,this.status.data.user_email);
          this.storege.set(this.Cust.ISVENDOR,this.status.allcaps.seller);
          this.storege.set(this.Cust.ISVENDORID,this.status.ID);
           if (this.platform.is('cordova')){
              this.oneSignal.getIds().then((data: any) => {
                  this.form.onesignal_user_id = data.userId;
                  this.form.onesignal_push_token = data.pushToken;
                  this.api.postItem('update_user_notification', this.form).then(res =>{});
              });
           }
          if(this.status.allcaps.wc_product_vendors_admin_vendor || this.status.allcaps.dc_vendor || this.status.allcaps.seller || this.status.allcaps.wcfm_vendor){
              this.settings.vendor = true;
          }
          if(this.status.allcaps.administrator) {
              this.settings.administrator = true;
          }
          setTimeout(() => {
              window.location.reload();
            }, 500);
           
          this.close(true);
          
      }
      this.disableSubmit = false;
  }, err => {
      this.disableSubmit = false;
  });
}

verify(){
  this.disableSubmit = true;
  /*this.platform.ready().then(() => {
      if(this.platform.is('hybrid')) {
          this.firebase.signInWithVerificationId(this.formSMS.value.phoneVerificationID, this.formSMS.value.sms.toString()).then((user) => {
              this.handlePhoneLogin();
          }).catch((error) => {
              this.disableSubmit = false;
              this.errors = {"invalid_otp":["Invalid SMS Code"]};
              console.log(error);
          });
      }
  });*/
}
googleLogin(){
  this.googleLogingInn = true;
  this.presentLoading();
  this.googlePlus.login({})
  .then(res => {
      this.googleStatus = res;
      this.api.postItem('google_login', {
              "access_token": this.googleStatus.userId,
              "email": this.googleStatus.email,
              "first_name": this.googleStatus.givenName,
              "last_name": this.googleStatus.familyName,
              "display_name": this.googleStatus.displayName,
              "image": this.googleStatus.imageUrl
          }).then(res => {
          this.status = res;
          this.status = res;
          console.log('res1',this.status);
          if (this.status.errors) {
            console.log('res2',this.status);
              this.errors = this.status.errors;
          } else if (this.status.data) {
            console.log('res3',this.status.data);
            this.Cust.user = this.status.ID;
            this.storege.set(this.Cust.USERNAME_G,this.status.data.display_name);
            this.storege.set(this.Cust.USEREMAIL_G,this.status.data.user_email);
               if (this.platform.is('cordova')){
                  this.oneSignal.getIds().then((data: any) => {
                      this.form.onesignal_user_id = data.userId;
                      this.form.onesignal_push_token = data.pushToken;
                  });
                 this.api.postItem('update_user_notification', this.form).then(res =>{
                 });
               }
              if(this.status.allcaps.wc_product_vendors_admin_vendor || this.status.allcaps.dc_vendor || this.status.allcaps.seller || this.status.allcaps.wcfm_vendor){
                  this.settings.vendor = true;
              }
              if(this.status.allcaps.administrator) {
                  this.settings.administrator = true;
              }
             
             setTimeout(() => {
            window.location.reload();
          }, 500);
          ;
              this.close(true);
              this.dismissLoading(); 
          }
          this.googleLogingInn = false;
          
      }, err => {
          this.googleLogingInn = false;
          this.dismissLoading();
      });
      this.googleLogingInn = false;
  })
  .catch(err => {
    console.log('errrrrrrr' + err)
      this.googleStatus = err;
      this.googleLogingInn = false;
      this.dismissLoading();
      
  });
}
handlePhoneLogin(){
  this.disableSubmit = true;
  this.api.postItem('phone_number_login', {
          "phone": this.formSMS.value.country_code + this.formSMS.value.phone.toString(),
      }).then(res => {
      this.disableSubmit = false;
      this.status = res;
      if (this.status.errors) {
          this.errors = this.status.errors;
      } else if (this.status.data) {
          this.settings.customer.id = this.status.ID;
           if (this.platform.is('cordova')){
              this.oneSignal.getIds().then((data: any) => {
                  this.form.onesignal_user_id = data.userId;
                  this.form.onesignal_push_token = data.pushToken;
              });
             this.api.postItem('update_user_notification', this.form).then(res =>{});
           }
          if(this.status.allcaps.wc_product_vendors_admin_vendor || this.status.allcaps.dc_vendor || this.status.allcaps.seller || this.status.allcaps.wcfm_vendor){
              this.settings.vendor = true;
          }
          if(this.status.allcaps.administrator) {
              this.settings.administrator = true;
          }
          this.close(true);
      }
      this.phoneLogingInn = false;
  }, err => {
      this.disableSubmit = false;
      this.phoneLogingInn = false;
  });
}
handlePhoneLoginError(error){
  this.phoneVerificationError = error;
  this.phoneLogingInn = false;
}
scrollToTop() {
this.slides.slideTo(1);
}
async onRegister() {
  this.disableSubmit = true;
  await this.api.postItem('create-user', this.formRegister.value).then(res => {
      this.status = res;
      console.log('create-user',res);
      if (this.status.errors) {
        console.log('create-user Error',JSON.stringify(this.status.errors));
          this.errorsRegister = this.status.errors;
          this.disableSubmit = false;
          for (var key in this.errors) {
              this.errorsRegister[key].forEach(item => item.replace('<strong>ERROR<\/strong>:', ''));
          }
      }
      else if (this.status.data != undefined) {
          this.settings.customer.id = this.status.ID;
          this.storege.set(this.Cust.USERNAME_R,this.status.data.display_name);
          this.storege.set(this.Cust.USEREMAIL_R,this.status.data.user_email);
           if (this.platform.is('cordova'))
              this.oneSignal.getIds().then((data: any) => {
                  this.pushForm.onesignal_user_id = data.userId;
                  this.pushForm.onesignal_push_token = data.pushToken;
                  this.api.postItem('update_user_notification', this.pushForm).then(res =>{});
              });
          
          this.disableSubmit = false;
          this.router.navigateByUrl("/login1");
          setTimeout(() => {
            window.location.reload();
          }, 500);
          console.log('close');
      }
      else this.disableSubmit = false;
  }, err => {
      this.disableSubmit = false;
  });
}
async presentLoading() {
  this.loading = await this.loadingController.create({
    message: 'Please wait...',
    // duration: 5000
  });
  this.loading.present();
}
dismissLoading() {
  if(this.loading) {
      this.loading.dismiss();
  }
}
segmentChanged(event) {
this.segment = event.detail.value;
}
}
