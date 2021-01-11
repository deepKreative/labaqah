import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, AlertController, ToastController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Config } from '../config';
import { Data } from '../data';
import { Settings } from '../data/settings';
import { HttpParams } from "@angular/common/http";
import { Product } from '../data/product';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
// import { LoginPage } from './../account/login/login.page';
import { CustService } from '../cust.service';

@Component({
    selector: 'app-cart',
    templateUrl: 'cart.page.html',
    styleUrls: ['cart.page.scss']
})
export class CartPage {

    coupon: any;
    cart: any = {};
    couponMessage: any;
    status: any;
    loginForm: any = {};
    errors: any;
    lan: any = {};
    long: any;
    lat: any;
    divDist: any;
    optionslList:any;

    constructor(
        public storage: Storage,
        public custSevice:CustService,
        public modalController: ModalController, 
        public translate: TranslateService, 
        private alertCtrl: AlertController, 
        public toastController: ToastController, 
        public config: Config, 
        public api: ApiService, 
        public data: Data, 
        public router: Router, 
        public settings: Settings, 
        public loadingController: LoadingController, 
        public navCtrl: NavController, 
        public route: ActivatedRoute, 
        public productData: Product,
  
        ) {}

    ngOnInit() {

            // this.custSevice.haveLocationMapLat().then(result => {
            //     this.lat= result;
            // });
            // this.custSevice.haveLocationMAPLNG().then(result => {
            //     this.long= result;
            // });

        // this.getOptions();
        this.translate.get(['Requested quantity not available'  ]).subscribe(translations => {
          this.lan.lowQuantity = translations['Requested quantity not available'];
        });
    }

    ionViewDidEnter() {
        this.getCart();
    }

    // async getOptions(){
    //     await this.api.postItem('cart').then(res => {
    //         this.cart = res;
    //         console.log('longmanddist2.1'+JSON.stringify(this.cart.cart_contents_product_id.lat));
    //         console.log('longmanddist2.2'+JSON.stringify(this.cart.cart_contents_product_id.long));
    //         console.log('longmanddist2.2.1'+this.lat);
    //         console.log('longmanddist2.2.2'+this.long);
    //         this.divDist = this.calcCrow(this.lat,this.long,(this.cart.cart_contents_product_id.lat),(this.cart.cart_contents_product_id.long));
    //         console.log('longmanddist4',this.divDist);
    //         this.api.getDeliveryOptions().subscribe((res)=>{
    //             this.optionslList = res;
    //         });

    //     });


    //   }


    // calcCrow(lat1, lon1, lat2, lon2) {
    // console.log('longmanddist3.1',lat1, lon1, lat2, lon2);
    //   var R = 6371;  // km
    //   var dLat = this.toRad(lat2-lat1);
    //   var dLon = this.toRad(lon2-lon1);
    //   var rlat1 = this.toRad(lat1);
    //   var rlat2 = this.toRad(lat2);
    //   var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    //     Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rlat1) * Math.cos(rlat2); 
    //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    //   var d = R * c;
    //   ;
    //   console.log('longmanddist3.2',d);
    //   return d;
     
    // }
    // toRad(Value) {
    //     return Value * Math.PI / 180;
    // }


    async getCart() {
        await this.api.postItem('cart').then(res => {
            this.cart = res;
            this.data.updateCart(this.cart.cart_contents);
        }, err => {
            console.log(err);
        });
    }
    
    async checkout() {
        // if(this.settings.customer.id || this.settings.settings.disable_guest_checkout == 0) {
            this.navCtrl.navigateForward('/tabs/cart/address');
    //     }

    //     else{
    //             const alert = await this.alertCtrl.create({
    //             header: 'Warning',
    //             message: 'You need to login or register to perceed',
    //             buttons: ['OK']
    //           });
    //           await alert.present();
    //           this.navCtrl.navigateForward('/login1');
    //     }
    }
    getProduct(id){
        this.productData.product = {};
        this.navCtrl.navigateForward(this.router.url + '/product/' + id);
    }
    async deleteItem(itemKey, qty) {
        await this.api.postItem('remove_cart_item&item_key=' + itemKey).then(res => {
            this.cart = res;
            this.data.updateCart(this.cart.cart_contents);
           this.storage.set(this.custSevice.VENDORID,'');
        }, err => {
            console.log(err);
        });
    }
    async submitCoupon(coupon) {
        if(coupon)
        await this.api.postItem('apply_coupon', {
            coupon_code: coupon
        }).then(res => {
            this.couponMessage = res;
            if(this.couponMessage != null && this.couponMessage.notice) {
                this.presentToast(this.couponMessage.notice)
            }
            this.getCart();
        }, err => {
            console.log(err);
        });
    }
    async removeCoupon(coupon) {
        await this.api.postItem('remove_coupon', {
            coupon: coupon
        }).then(res => {
            this.couponMessage = res;
            if(this.couponMessage != null && this.couponMessage.notice) {
                this.presentToast(this.couponMessage.notice)
            }
            this.getCart();
        }, err => {
            console.log(err);
        });
    }
    async addToCart(id, item){
        if(item.value.manage_stock && (item.value.stock_quantity <= item.value.quantity)) {
            this.presentToast(this.lan.lowQuantity);
        } else {
            if (this.data.cartItem[item.key].quantity != undefined && this.data.cartItem[item.key].quantity == 0) {
                this.data.cartItem[item.key].quantity = 0
            }
            else {
                this.data.cartItem[item.key].quantity += 1
            };
            if (this.data.cart[id] != undefined && this.data.cart[id] == 0) {
                this.data.cart[id] = 0
            }
            else {
                this.data.cart[id] += 1
            };
            var params: any = {};
            params.key = item.key;
            params.quantity = this.data.cartItem[item.key].quantity;
            params.update_cart = 'Update Cart';
            params._wpnonce = this.cart.cart_nonce;
            await this.api.postItem('update-cart-item-qty', params).then(res => {
                this.cart = res;
                this.data.updateCart(this.cart.cart_contents);
            }, err => {
                console.log(err);
            });
        }
    }

    async deleteFromCart(id, key){
        if (this.data.cartItem[key].quantity != undefined && this.data.cartItem[key].quantity == 0) {
            this.data.cartItem[key].quantity = 0;
        }
        else {
            this.data.cartItem[key].quantity -= 1;
        };
        if (this.data.cart[id] != undefined && this.data.cart[id] == 0) {
            this.data.cart[id] = 0
        }
        else {
            this.data.cart[id] -= 1
        };
        var params: any = {};
        params.key = key;
        params.quantity = this.data.cartItem[key].quantity;
        params.update_cart = 'Update Cart';
        params._wpnonce = this.cart.cart_nonce;

        await this.api.postItem('update-cart-item-qty', params).then(res => {
            this.cart = res;
            this.data.updateCart(this.cart.cart_contents);
        }, err => {
            console.log(err);
        });
    }
    //----------Rewrad-----------------//
    redeem(){
       // wc_points_rewards_apply_discount_amount: 
       // wc_points_rewards_apply_discount: Apply Discount
        this.api.postItem('ajax_maybe_apply_discount').then(res =>{
            console.log(res);
            this.getCart();
            })
    }

    async onSubmit(userData) {
        this.loginForm.username = userData.username;
        this.loginForm.password = userData.password;
        await this.api.postItem('login', this.loginForm).then(res => {
            this.status = res;
            if (this.status.errors != undefined) {
                this.errors = this.status.errors;
                this.inValidUsername();
            } else if (this.status.data) {
                this.settings.customer.id = this.status.ID;
                if(this.status.allcaps.dc_vendor || this.status.allcaps.seller || this.status.allcaps.wcfm_vendor){
                    this.settings.vendor = true;
                }
                if(this.status.allcaps.administrator) {
                    this.settings.administrator = true;
                }
                this.navCtrl.navigateForward('/tabs/cart/address');
            }
        }, err => {
            console.log(err);
        });
    }
    async inValidUsername() {
        const alert = await this.alertCtrl.create({
          header: 'Warning',
          message: 'Invalid Username or Password',
          buttons: ['OK']
        });
        await alert.present();
    }
    async presentToast(message) {
        const toast = await this.toastController.create({
          message: message,
          duration: 2000,
          position: 'top'
        });
        toast.present();
    }
}