import { Component, OnInit, OnDestroy, AfterViewInit  } from '@angular/core';
import { Platform, NavController, ToastController, IonRouterOutlet, AlertController, ModalController } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { TranslateService } from '@ngx-translate/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { Config } from './config';
import { Subscription } from 'rxjs';
import { Settings } from './data/settings';
import { Data } from './data';
import { ApiService } from './api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CustService } from './cust.service';
import { LocationPage } from './location/location.page';
import { Storage } from '@ionic/storage';
import { EnvService } from 'src/env.service';
import { async } from '@angular/core/testing';
import { AppRate } from '@ionic-native/app-rate/ngx';
// import { LoginPage } from './account/login/login.page';

declare var wkWebView: any;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit{
  
    statusC: any = {};
    form: any;
    errors: any;
    firstLetter:any;
    firstLetterG:any;
    loading: any = false;
    filter: any = {};
    isloggedIn = false;
    username = '';
    userEmail = '';
    isVendorT = '';
    isVendorID = '';
    googleusername = '';
    rusername = '';
    ruserEmail = '';
    googleuserEmail = '';
    changeToLeft :string  ;
    private backButtonSubscription: Subscription;
    @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
    constructor(
    public modalCtrl: ModalController,
    public storage: Storage,
    private cs : CustService,
    private fb: FormBuilder,
    public Cust : CustService,
    private envService : EnvService,
    public data: Data, public settings: Settings,
    public plt:Platform,
    public api: ApiService,
    public alertCntl : AlertController,
    private appRate: AppRate,
    public modalController: ModalController,
    public config: Config, 
    public alertController: AlertController, 
    private router: Router, 
    public navCtrl: NavController, 
    public translateService: TranslateService, 
    public platform: Platform, 
    // private splashScreen: SplashScreen, 
    private statusBar: StatusBar, 
    private appMinimize: AppMinimize,
    ) 
    {
            this.initializeApp();
            this.envService.getObservable()
            this.plt.resume
            this.form = this.fb.group({
              username: ['', Validators.required],
              password: ['', Validators.required],
          });
          this.Cust.getUserInfo().then(result => {
            if (result) {
              this.username = result.get(this.Cust.USERNAME);    
              this.userEmail = result.get(this.Cust.USEREMAIL);
              if(this.username){
                this.firstLetter = this.username.substring(0,1);
              } 
                
            }
          });
          this.storage.get('USER_NAME_G').then((userNameG) => {
            this.googleusername = userNameG;
            if(this.googleusername){
              this.firstLetterG = this.googleusername.substring(0,1);  
            }
            
          });
          this.storage.get('USER_NAME_R').then((userNameR) => {

            this.rusername = userNameR;
            if(this.rusername){
            this.firstLetterG = this.rusername.substring(0,1); 
            } 
          });
          this.storage.get('USER_EMAIL_G').then((userEmail_G) => {
            this.googleuserEmail = userEmail_G;
          });
          this.storage.get('USER_EMAIL_R').then((userEmail_R) => {
            this.ruserEmail = userEmail_R;
          });
          this.storage.get('USER_NAME').then((userName) => {
            this.username = userName;
          });
          this.storage.get('USER_EMAIL').then((userEmail) => {
            this.userEmail = userEmail;
          });
          this.storage.get('ISVENDOR').then((isVendor) => {
            this.isVendorT = isVendor;
          });
          this.storage.get('ISVENDORID').then((isVendorId) => {
            this.isVendorID = isVendorId;
          });
    }

    ngOnInit(){
            this.storage.get('USER_NAME_G').then((userNameG) => {
              this.googleusername = userNameG;
            });

            this.loginWithUsername(); 
            this.googleLogin();
            this. initializeApp() ;

            
    }
    goToCart(){
      this.navCtrl.navigateForward('tabs/cart');
  }

    goTo(path) {
      this.navCtrl.navigateForward(path);
    }    

    ionViewDidLoad(){
      this.loginWithUsername();
      this. initializeApp() ;
 
    }
    ionViewDidEnter(){
      this.loginWithUsername();
      this.googleLogin();
      this.initializeApp() ;

    }
    async getLocation() {
      const modal = await this.modalCtrl.create({
          component: LocationPage,
          componentProps: {
          path: 'tabs/home'
          },
          swipeToClose: true,
          presentingElement: this.routerOutlet.nativeEl,
      });
      modal.present();
      const { data } = await modal.onWillDismiss();
      if(data && data.update) {
          this.loading = true;
          this.filter.page = 1;
          this.storage.set('userLocation', this.api.userLocation);
      }
    }
    ngAfterViewInit(): void {
      this.Cust.getCurrentLang().then(result => { 
        this.changeToLeft = result
        if (result!= null && result == 'en') {
          this.translateService.setDefaultLang(result);
          document.documentElement.setAttribute('dir', 'ltr');
          this.storage.set("LANG",'en');
        }else if (result!= null && result == 'ar') {
          this.translateService.setDefaultLang(result);
          document.documentElement.setAttribute('dir', 'rtl');
        }else{
          this.translateService.setDefaultLang('en');
          document.documentElement.setAttribute('dir', 'ltr');
          this.storage.set("LANG",'en');
        }
        
      });
    
        /* Add your translation file in src/assets/i18n/ and set your default language here */
        //this.translateService.setDefaultLang('ar');
        //document.documentElement.setAttribute('dir', 'rtl');
        this.backButtonSubscription = this.platform.backButton.subscribe(() => {
        if (this.router.url === '/tabs/home') {
          navigator['app'].exitApp();
        }else{
          this.navCtrl.navigateForward('/tabs/home');
        }
        });
    }
    async presentAlertRadio(heading: string){
       var  isengchecked=false;
       var isarabicchecked=false;
       var  languageval = this.Cust.getCurrentLang();
      if(languageval.toString()=="en")
      {
        isengchecked=true;
        isarabicchecked=false;
      }
      else{
        isengchecked=false;
        isarabicchecked=true;
      }
       const alert = await this.alertCntl.create({
         header: heading,
         inputs :[
           {
             name : 'English',
             type: 'radio',
             label: 'English',
             value: 'value1',
             checked: isengchecked
           },
           {
             name: 'Arabic',
             type: 'radio',
             label: 'Arabic',
             value: 'value2',
             
           },
         ],
         buttons: [
           {
             text: this.translateService.instant('cancel'),
             role: 'cancel',
             cssClass: 'secondary',
             handler: () => {
               console.log('Confirm Cancel');
             }
           }, {
             text: this.translateService.instant('ok'),
             handler: (data) => {
                if(data=="value1")
                {
                    this.storage.set('LANG','en')
                    this.translateService.setDefaultLang('en');
                    document.documentElement.setAttribute('dir', 'ltr');
                }
                else{
                  this.storage.set('LANG','ar')
                  this.translateService.setDefaultLang('ar');
                  document.documentElement.setAttribute('dir', 'rtl');
                }
                setTimeout(() => {
                  window.location.reload();
                },500);
             }
           }
         ]
       });
       await alert.present();
     }

    initializeApp() {
      // this.router.navigateByUrl('splash')
      this.router.navigateByUrl('tabs/home');
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.statusBar.backgroundColorByHexString('#ffffff');
            document.addEventListener('deviceready', () => {
                wkWebView.injectCookie(this.config.url + '/');
            });
            this.envService.getObservable().subscribe((data) => {
            this.loginWithUsername();
          })
            this.envService.getObservable().subscribe((data) => {
            this.googleLogin();
          })
        });
    }
    getShortName(fullName) { 
      return fullName.split(' ').map(n => n[0]).join('');
    }
    async log_out() {
      this.settings.customer.id = undefined;
      this.settings.vendor = false;
      this.settings.administrator = false;
      this.settings.wishlist = [];
      this.storage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      await this.api.postItem('logout').then(res => {}, err => {
          console.log(err);
      });
      if((<any>window).AccountKitPlugin)
      (<any>window).AccountKitPlugin.logout();
  }
    async presentAlertConfirm() {
      const alert = await this.alertController.create({
        header: 'Exit!',
        message: 'Do you want to exit the app?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              //
            }
          }, {
            text: 'Yes',
            handler: () => {
              this.backButtonSubscription.unsubscribe();
              navigator['app'].exitApp();
            }
          }
        ]
      });
      await alert.present();
    }

    async loginWithUsername() {
     this.Cust.getUserInfo().then(result => {
        if (result) {
          this.username = result.get(this.Cust.USERNAME);    
          this.userEmail = result.get(this.Cust.USEREMAIL); 
          if(this.username){
            this.firstLetter = this.username.substring(0,1);  
          } 
          
        }
        else{      
        }
      });
    }
    async googleLogin() {
     this.Cust.getUserInfo().then(result => {
        if (result) {
          this.username = result.get(this.Cust.USERNAME);    
          this.userEmail = result.get(this.Cust.USEREMAIL); 
          if(this.username){ 
          this.firstLetter = this.username.substring(0,1);  
          }
        }
        else{       
        }
      });
    }

  displayyUserinof(){
    this.Cust.getuserName().then(result => {
      if (result) {    
      }
      else{
      }
    });
  }
}