import { Component } from '@angular/core';
import { NavController, ModalController, Platform, IonRouterOutlet, AlertController, ToastController } from '@ionic/angular';
import { Settings } from './../data/settings';
import { ApiService } from './../api.service';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Storage } from '@ionic/storage';
import { EnvService } from 'src/env.service';
import { CustService } from '../cust.service';

@Component({
    selector: 'app-account',
    templateUrl: 'account.page.html',
    styleUrls: ['account.page.scss']
})
export class AccountPage {
    toggle: any;
    isloggedIn = false;
    username = '';
    userEmail = '';
    firstLetter:any;

    constructor(
        public tst: ToastController,
        public alrt: AlertController,
        private Storage : Storage,
        private plf : Platform,
        public envService : EnvService,
        public Cust : CustService,
        public modalController: ModalController, 
        public api: ApiService, 
        public navCtrl: NavController, 
        public settings: Settings, 
        public platform: Platform, 
        private appRate: AppRate, 
        private emailComposer: EmailComposer, 
        private socialSharing: SocialSharing, 
        public routerOutlet: IonRouterOutlet
         ){}
    goTo(path) {
        console.log(path);
        this.navCtrl.navigateForward(path);
    }
    async log_out() {
        this.settings.customer.id = undefined;
        this.settings.vendor = false;
        this.settings.administrator = false;
        this.settings.wishlist = [];
        this.Storage.clear;
        this.plf.ready().then();
        setTimeout(() => {
            window.location.reload();
          }, 1000);

        await this.api.postItem('logout').then(res => {}, err => {
            console.log(err);
        });
        if((<any>window).AccountKitPlugin)
        (<any>window).AccountKitPlugin.logout();
        
    }
    rateApp() {
        if (this.platform.is('cordova')) {
            this.appRate.preferences.storeAppURL = {
                ios: this.settings.settings.rate_app_ios_id,
                android: this.settings.settings.rate_app_android_id,
                windows: 'ms-windows-store://review/?ProductId=' + this.settings.settings.rate_app_windows_id
            };
            this.appRate.promptForRating(false);
        }
    }
    shareApp() {
        if (this.platform.is('cordova')) {
            var url = '';
            if (this.platform.is('android')) url = this.settings.settings.share_app_android_link;
            else url = this.settings.settings.share_app_ios_link;
            var options = {
                message: '',
                subject: '',
                files: ['', ''],
                url: url,
                chooserTitle: ''
            }
            this.socialSharing.shareWithOptions(options);
        }
    }
    email(contact) {
        let email = {
            to: contact,
            attachments: [],
            subject: '',
            body: '',
            isHtml: true
        };
        this.emailComposer.open(email);
    }
    ionViewDidEnter()
    {
        this.envService.getObservable().subscribe((data) => {
            this.loginWithUsername();
          })
          this.Cust.getUserInfo().then(result => {
            if (result) {
                this.loginWithUsername();
            }   
    });
    }
    async loginWithUsername() {
        this.Cust.getUserInfo().then(result => {
            if (result) {
              this.isloggedIn = true;
              this.username = result.get(this.Cust.USERNAME);    
              this.userEmail = result.get(this.Cust.USEREMAIL);  
              this.firstLetter = this.username.substring(0,1);  
            }
    });
}
    ngOnInit() {
        this.toggle = document.querySelector('#themeToggle');
        this.envService.getObservable().subscribe((data) => {
            this.loginWithUsername();
          });
        }
    }