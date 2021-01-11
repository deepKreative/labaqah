import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ModalController, IonRouterOutlet} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Data } from '../data';
import { Settings } from '../data/settings';
import { Product } from '../data/product';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { Config } from '../config';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { HttpParams } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { LocationPage } from './../location/location.page';
import { LS_USER_COORDS, LS_USER_ADDRESS } from './../shared/common';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Vendor } from '../data/vendor';
import { FormBuilder, Validators } from '@angular/forms';
import { CustService } from '../cust.service';
import { EnvService } from 'src/env.service';
import { throwError } from 'rxjs';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {

    sliderConfig = {
        spaceBetween: 4,
        slidesPerView: 1.3,
    };
    sliderConfigg = {
        slidesPerView: 1.8,
        spaceBetween: 4,
    
    };
    filter: any = {};
    hasMoreItems: boolean = true;
    screenWidth: any = 300;
    slideOpts = { effect: 'flip', 
    autoplay: true, parallax: true, loop: true, lazy: true };
    cart: any = {};
    options: any = {};
    lan: any = {};
    variationId: any;
    get_wishlist:any;
    loading: any = false;
    statusC: any = {};
    form: any;
    errors: any;
    disableSubmit:boolean = false;
    vendors: any;
    getcostomer: any;
    name: any;
    cat: any;
    floVen: any = [];
    chocoVen: any;
    isloggedIn = false;
    googleusername = '';
    rusername = '';
    username = '';
    userEmail = '';
    firstLetter:any;
    vendorCateory: any ;
    vendorCateory2: any;
    floVenrs: any;
    chocoVenrs: any;
    freeWrappin: any;
    chocoVenSuger: any;
    bestPrice: any;
    freeDelivery: any;
    status: any;
    myLng: any;
    myLat: any;
    dist= '2' ;
    venDisFlow: any = [];
    venDisFR: any = [];
    venDisFD: any = [];
    venDisChoco: any = [];
    venDisChocoSF: any = [];
    vendor1: any = [];
    isVendorT = '';
    lang:any;
    DelFeeflower:any;
    DelFeechocolate:any;
    DelFeeSugarFree:any;
    DelFeeFreeWrapping:any;
    currentTime:any;
    delOptions:any;
    delPriceFlowers:any;
  
    constructor(
        public Cust: CustService,
        public routerOutlet: IonRouterOutlet,
        public modalCtrl: ModalController,
        private nativeGeocoder: NativeGeocoder,
        private geolocation: Geolocation,
        private locationAccuracy: LocationAccuracy,
        private storage: Storage,
        public translate: TranslateService,
        public alertController: AlertController,
        private config: Config,
        public api: ApiService,
        // private splashScreen: SplashScreen,
        public platform: Platform,
        public translateService: TranslateService,
        public data: Data,
        public settings: Settings,
        public product: Product,
        public loadingController: LoadingController,
        public router: Router,
        public navCtrl: NavController,
        public route: ActivatedRoute,
        private oneSignal: OneSignal,
        private nativeStorage: NativeStorage,
        public vendor: Vendor,
        ) {
        this.filter.page = 1;
        this.filter.status = 'publish';
        this.screenWidth = this.platform.width();
        this.filter.page = 1;
        this.filter.per_page = 30;
        this.filter.wc_vendor = true;
        this.loginWithUsername();
    }
    ngOnInit() {
            this.Cust.getCurrentLang().then((result)=>{
                this.lang = result;
            })
            this.storage.get('USER_NAME_G').then((userNameG) => {
                this.googleusername = userNameG;
            });
            this.storage.get('USER_NAME_R').then((userNameR) => {
                if(this.rusername){
                this.rusername= userNameR[0].toUpperCase();
                }
            });
            this.Cust.getUserInfo().then(result => {
                if (result) {
                this.isloggedIn = true;
                this.username = result.get(this.Cust.USERNAME);    
                this.userEmail = result.get(this.Cust.USEREMAIL); 
                if(this.username){ 
                this.firstLetter = this.username.substring(0,1); 
                }
                }else{}
            });
            this.api.getVendorsCat().subscribe(res =>{
            this.vendorCateory = res ;
            var flowerVendors2 =  this.vendorCateory.filter(function(hero) {
                return hero.vendor_type == "flower";
            });
            this.floVenrs = flowerVendors2[0].vendor_type ;
            var choclateVendors2 =  this.vendorCateory.filter(function(hero) {
                return hero.vendor_type == "chocolate";
            });
            this.chocoVenrs = choclateVendors2[0].vendor_type ;
            });
            this.platform.ready().then(() => {
                this.locationAccuracy.canRequest().then((canRequest: boolean) => {
                if(canRequest) {
                    // the accuracy option will be ignored by iOS
                    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                    () => {
                        console.log('Request successful')
                    },
                    error => {
                        console.log('Error requesting location permissions', error);
                    });
                }
                });
                // Set language to user preference
                this.nativeStorage.getItem('settings').then((settings : any) => {
                    this.config.lang = settings.lang;
                    document.documentElement.setAttribute('dir', settings.dir);
                }, error => {
                });

                this.storage.get('userLocation').then((value : any) => {
                    if(value) {
                        this.api.userLocation = value;
                    }
                    this.getBlocks();
                }, error => {
                    this.getBlocks();
                });
                this.translate.get(['Oops!', 'Please Select', 'Please wait', 'Options', 'Option', 'Select', 'Item added to cart', 'Message', 'Requested quantity not available'  ]).subscribe(translations => {
                this.lan.oops = translations['Oops!'];
                this.lan.PleaseSelect = translations['Please Select'];
                this.lan.Pleasewait = translations['Please wait'];
                this.lan.options = translations['Options'];
                this.lan.option = translations['Option'];
                this.lan.select = translations['Select'];
                this.lan.addToCart = translations['Item added to cart'];
                this.lan.message = translations['Message'];
                this.lan.lowQuantity = translations['Requested quantity not available'];
                });

                this.nativeStorage.getItem('blocks').then(data => {
                    this.data.blocks = data.blocks;
                    this.data.categories = data.categories;
                    this.data.mainCategories = this.data.categories.filter(item => item.parent == 0);
                    this.settings.pages = this.data.blocks.pages;
                    this.settings.settings = this.data.blocks.settings;
                    this.settings.dimensions = this.data.blocks.dimensions;
                    this.settings.currency = this.data.blocks.settings.currency;
                    if(this.data.blocks.languages)
                    this.settings.languages = Object.keys(this.data.blocks.languages).map(i => this.data.blocks.languages[i]);
                    this.settings.currencies = this.data.blocks.currencies;
                    this.settings.calc(this.platform.width());
                    if (this.settings.colWidthLatest == 4) this.filter.per_page = 15;
                    // this.splashScreen.hide();
                }, error => console.error(error));
            });

        window.addEventListener('app:update', (e : any) => {
          this.getBlocks();
        });
        this.getVendors(); 
        this.currentLoadUserMap();
        // this.getLocationAdddress();
        this.storage.get('ISVENDOR').then((isVendor) => {
            this.isVendorT = isVendor;
          });

       
    }

    ionViewDidEnter(){
        this.currentLoadUserMap2();
          this.Cust.getUserInfo().then(result => {
            if (result) {
              this.isloggedIn = true;
              this.username = result.get(this.Cust.USERNAME);    
              this.userEmail = result.get(this.Cust.USEREMAIL); 
              if(this.username){ 
              this.firstLetter = this.username.substring(0,1);  
              }
            }else{ 
            }
        });
    }



    
    getShortName(fullName)
    { 
        return fullName.split(' ').map(n => n[0]).join('');
    }
    loginWithUsername()
    {
        this.Cust.getUserInfo().then(result => {
            if (result) {
              this.isloggedIn = true;
              this.username = result.get(this.Cust.USERNAME);    
              this.userEmail = result.get(this.Cust.USEREMAIL); 
              if(this.username){ 
              this.firstLetter = this.username.substring(0,1);
              } 
            }else{} 
        });
    }
    close(status) {
        this.modalCtrl.dismiss({
          'loggedIn': status,
        });
    }

    async getVendors() {
        this.filter.page = 1;
            await this.api.postItem('vendors', this.filter).then(async res => {
                this.vendors = res;
                for(let item of this.vendors){
                    if (item.vendor_type[0] == "flower" && parseInt(this.distance(item)) < this.data.dist ) {
                        console.log('this.distance(item)',this.distance(item),item.name );
                        var longfdf = this.distance(item);
                        if(longfdf < "15"){
                            this.delPriceFlowers = "1";
                        }else{
                            this.delPriceFlowers = "blaaa";
                        }
                        // else if(this.distance(item) > "15" && (this.distance(item) < "25")){
                        //     this.delPrice = "1.5";
                        // }else{
                        //     this.delPrice = "Just local pickup";
                        // };
                        this.venDisFlow.push(item);
                      }
                    if (item.vendor_type[0] == "chocolate" && parseInt(this.distance(item)) < this.data.dist ) {
                        this.venDisChoco.push(item);
                      }
                    if (item.spl_ftr_one == "Sugar Free" && parseInt(this.distance(item)) < this.data.dist ) {
                        this.venDisChocoSF.push(item);
                      }
                    if (item.spl_ftr_two == "Free Wrapping" && parseInt(this.distance(item)) < this.data.dist ) {
                        this.venDisFR.push(item);
                      }
                    if (item.spl_ftr_three == "Free Delivery" && parseInt(this.distance(item)) < this.data.dist ) {
                        this.venDisFD.push(item);
                      }
                    }
            }, err => {
                console.log(err);
            });
        };

async currentLoadUserMap2(){
        this.geolocation.getCurrentPosition().then((resp) => {
        this.api.userLocation.latitude = resp.coords.latitude;
        this.api.userLocation.longitude = resp.coords.longitude;
        this.storage.set(this.Cust.DELLOCATIONLAT, resp.coords.latitude);
        this.storage.set(this.Cust.DELLOCATIONLNG,resp.coords.longitude);
        this.myLat = this.api.userLocation.latitude;
        this.myLng = this.api.userLocation.longitude;
        }).catch((error) => {
            console.log('Error getting location', error);
        });
      }

async currentLoadUserMap(){
        this.geolocation.getCurrentPosition().then((resp) => {
        this.api.userLocation.latitude = resp.coords.latitude;
        this.api.userLocation.longitude = resp.coords.longitude;
        // this.getLocationAdddress();
        }).catch((error) => {
            console.log('Error getting location', error);
        
    });
    }

    
    async getLocation() {
        this.router.navigateByUrl('location');
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
                this.getBlocks();
                this.storage.set('userLocation', this.api.userLocation);
            }
    }
    getBlocks() {
        this.api.postItem('keys').then(res => {
            this.loading = false;
            this.data.blocks = res;
            if(this.data.blocks && this.data.blocks.user)
            this.settings.user = this.data.blocks.user.data;
            if(this.data.blocks.languages)
            this.settings.languages = Object.keys(this.data.blocks.languages).map(i => this.data.blocks.languages[i]);
            this.settings.currencies = this.data.blocks.currencies;
            this.settings.settings = this.data.blocks.settings;
            this.settings.dimensions = this.data.blocks.dimensions;
            this.settings.currency = this.data.blocks.settings.currency;
            this.settings.calc(this.platform.width());
            if (this.settings.colWidthLatest == 4) this.filter.per_page = 15;
            // this.splashScreen.hide();
            this.nativeStorage.setItem('blocks', {
                    blocks: this.data.blocks,
                    categories: this.data.categories
                }).then(
            () => console.log('Stored item!'), error => console.error('Error storing item', error));
                
            /* Product Addons */
            // if(this.data.blocks.settings.switchAddons){
            //     this.api.getAddonsList('product-add-ons').then(res => {
            //         this.settings.addons = res;
            //     });
            // }
        }, err => {
            console.log(err);
        }); 
    }
    getSubCategories(id) {
        const results = this.data.categories.filter(item => item.parent === parseInt(id));
        return results;
    }
    getCategory(name) {
        this.navCtrl.navigateForward('/vendor-cat/' + name );
    }
    processOnsignal() {
        this.oneSignal.startInit(this.data.blocks.settings.onesignal_app_id, this.data.blocks.settings.google_project_id);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
        this.oneSignal.handleNotificationReceived().subscribe(() => {
        });
        this.oneSignal.handleNotificationOpened().subscribe(result => {
            if (result.notification.payload.additionalData.category) {
                this.navCtrl.navigateForward('/tabs/home/products/' + result.notification.payload.additionalData.category);
            } else if (result.notification.payload.additionalData.product) {
                this.navCtrl.navigateForward('/tabs/home/product/' + result.notification.payload.additionalData.product);
            } else if (result.notification.payload.additionalData.post) {
                this.navCtrl.navigateForward('/tabs/home/post/' + result.notification.payload.additionalData.post);
            } else if (result.notification.payload.additionalData.order) {
                this.navCtrl.navigateForward('/tabs/account/orders/order/' + result.notification.payload.additionalData.order);
            }
        });
        this.oneSignal.endInit();
    }
    doRefresh(event) {
        this.filter.page = 1;
        this.getBlocks();
        setTimeout(() => {
            event.target.complete();
        }, 2000);
    }
    getHeight(child) {
        return (child.height * this.screenWidth) / child.width;
    }

    async presentAlert(header, message) {
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: ['OK']
        });
        await alert.present();
    }
    goToSearch(){
        this.navCtrl.navigateForward('/tabs/search');
    };
    goToCart(){

        this.navCtrl.navigateForward('/tabs/cart');
    }

    detail(item) {
        this.vendor.vendor = item;
        this.navCtrl.navigateForward('/tabs/home/products/'+item.vendor_type[0].replace(/['"]+/g, '/')+item.id);
        
    }
    isClosed(item) {
        if(item.is_close) {
            return true;
        } else {
            return false;
        }   
    }

   distance(item) {
        return this.calcCrow(item.address.street_1, item.address.street_2, this.api.userLocation.latitude, this.api.userLocation.longitude).toFixed(1);

       }
   
    calcCrow(lat1, lon1, lat2, lon2) {
      var R = 6371;  // km///////////////////////////////////////////////////////////////////////////////////////
      var dLat = this.toRad(lat2-lat1);
      var dLon = this.toRad(lon2-lon1);
      var rlat1 = this.toRad(lat1);
      var rlat2 = this.toRad(lat2);
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rlat1) * Math.cos(rlat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      ;
      return d;
     
    }
    toRad(Value) {
        return Value * Math.PI / 180;
    }
}