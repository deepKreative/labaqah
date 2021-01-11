import { Component, OnInit } from '@angular/core';
import { NavController, Platform, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Settings } from './../../data/settings';
import { NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {
    filter: any = {};
    orders: any = [];
    hasMoreItems: boolean = true;
    loader: boolean = false;
    vendorID:any;
    constructor(public storage :Storage, public actionSheetController: ActionSheetController, public platform: Platform, public api: ApiService, public settings: Settings, public router: Router, public navCtrl: NavController, public route: ActivatedRoute) {
        
        this.getIsVendorId();
        
       
    }
    ngOnInit() {
        if(this.settings.settings.vendorType === 'product_vendor') {
            this.getWooCommerceProductVendorOrders();
        } else {
             //THIS WORKS FOE WCFM ALSO, DO NOT CHANEG THIS. WCFM API NOT WORKING
        }

        //WCFM DO NOT USE THIS. WCFM API THIS IS NOT WORKING
        //this.getWCFMOrders();
    }
    
    getOrders() {
        this.loader = true;
        console.log('isVendorId',this.vendorID)
        this.api.getItem('orders', this.filter).then(res => {
            console.log('this.filter',this.filter);
            this.orders = res;
            console.log('this.ordersr',this.filter);
            this.loader = false;
        }, err => {
            console.log(err);
        });
    }
    loadData(event) {
        this.filter.page = this.filter.page + 1;
        this.api.getItem('orders', this.filter).then(res => {
            this.orders.push.apply(this.orders, res);
            event.target.complete();
            if (!res) this.hasMoreItems = false;
        }, err => {
            event.target.complete();
        });
    }

    async getIsVendorId()
    {

      


      const isVendorId = await this.storage.get('ISVENDORID');
      this.vendorID = isVendorId;

      this.filter.page = 1;
      this.filter.vendor = this.vendorID;
      if(this.settings.administrator) {
          delete this.filter.vendor;
      }
      console.log('isVendorId',this.vendorID)
    }



    getDetail(order) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                order: order
            }
        };
        this.navCtrl.navigateForward('/tabs/account/vendor-orders/view-order/' + order.id, navigationExtras);
    }
    editOrder(order) {
        this.navCtrl.navigateForward('/tabs/account/vendor-orders/edit-order/' + order.id);
    }

    getWooCommerceProductVendorOrders() {
        this.api.postItem('vendor-order-list', this.filter).then(res => {
            this.orders = res;
            this.loader = false;
        }, err => {
            console.log(err);
        });
    }
    
    async updateOrderStatus(order) {
      const actionSheet = await this.actionSheetController.create({
      header: 'Status',
      buttons: [{
        text: 'Fulfilled',
        icon: 'checkmark',
        handler: () => {
            this.api.postItem('set_fulfill_status', {status: 'fulfilled', order_item_id: order.order_item_id}).then(res => {
                order.fulfillment_status = res;
            }, err => {
                console.log(err);
            });
        }
      }, {
        text: 'Unfulfilled',
        icon: 'close',
        handler: () => {
            this.api.postItem('set_fulfill_status', {status: 'unfulfilled', order_item_id: order.order_item_id}).then(res => {
                order.fulfillment_status = res;
            }, err => {
                console.log(err);
            });
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
        }]
      });
      await actionSheet.present();        
    }

    //WCFM
    /*getWCFMOrders(){
        this.loader = true;
        if (this.platform.is('hybrid'))
        this.api.getWCFMIonic('orders', this.filter).then((res) => {
            this.orders = res;
            this.loader = false;
        }, err => {
            console.log(err);
        });
        else {
            this.api.getWCFM('orders', this.filter).then(res => {
                this.orders = res;
                this.loader = false;
            }, err => {
                console.log(err);
            });
        }
    }
    loadData(event) {
        this.filter.page = this.filter.page + 1;
        if (this.platform.is('hybrid'))
            this.api.getWCFMIonic('orders', this.filter).then((res) => {
                this.orders.push.apply(this.orders, res);
                event.target.complete();
                if (!res) this.hasMoreItems = false;
            }, err => {
                event.target.complete();
            });
        else {
            this.api.getWCFM('orders', this.filter).then(res => {
                this.orders.push.apply(this.orders, res);
                event.target.complete();
                if (!res) this.hasMoreItems = false;
            }, err => {
                event.target.complete();
            });
        }
    }*/
}