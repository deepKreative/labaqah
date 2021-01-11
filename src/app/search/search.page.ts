import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Data } from '../data';
import { Settings } from '../data/settings';
import { Product } from '../data/product';
//import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';
import { Config } from '../config';
import { HttpParams } from "@angular/common/http";
import { Vendor } from '../data/vendor';
import { Keyboard } from '@ionic-native/keyboard/ngx';





// import { VendorCatPage } from './../vendor/vendor-cat/vendor-cat.page';

@Component({
    selector: 'app-search',
    templateUrl: 'search.page.html',
    styleUrls: ['search.page.scss']
})
export class SearchPage implements OnInit {
    products: any = [];
    vendors: any = [];
    tempProducts: any = [];
    tempVendors: any = [];
    filter: any = {};
    hasMoreItems: boolean = true;
    searchInput: any = "";
    loading: boolean = false;

    cart: any = {};
    options: any = {};
    lan: any = {};
    variationId: any;
    gridView: boolean = true;
    name='';

    constructor(
        public config: Config, 
        public alertController: AlertController, 
        public api: ApiService,
        public data: Data, 
        public router: Router, 
        public product: Product, 
        public vendor: Vendor ,
        public settings: Settings, 
        public loadingController: LoadingController, 
        public navCtrl: NavController, 
        private keyboard: Keyboard,
        public route: ActivatedRoute/*, private barcodeScanner: BarcodeScanner*/) {

        
        this.filter.page = 1;
        if (this.settings.colWidthProducts == 4) this.filter.per_page = 15;
        this.filter.status = 'publish';
    }
    ngOnInit() {}
    async loadData(event) {
        console.log('products1'+JSON.stringify(this.filter));
        this.filter.page = this.filter.page + 1;
        this.api.postItem('vendors', this.filter).then(res => {
            this.tempProducts = res;
            console.log('products1'+JSON.stringify(this.filter));
            this.products.push.apply(this.products, this.tempProducts);
            event.target.complete();
            this.keyboard.show();
            if (this.tempProducts.length == 0) this.hasMoreItems = false;

        }, err => {
            event.target.complete();
        });
        console.log('Done');
    }
    onInput() {
        this.loading = true;
        this.hasMoreItems = true;
        this.filter.page = 1;
        delete this.filter.sku;
        this.filter.q = this.searchInput;
        if (this.searchInput.length) {
            this.getProducts();
        } else {
            this.products = '';
            this.loading = false;
        }
    }
    async getProducts() {   
        this.api.postItem('vendors', this.filter).then(res => { // user5s
            this.products = res;
            console.log('vendors'+JSON.stringify(res));
            this.loading = false;
        }, err => {
            console.log(err);
        });
    }
    getProduct(product) {
        this.product.product = product;
        this.navCtrl.navigateForward('/tabs/search/product/' + product.id);
    }
    detail(item) {
        this.vendor.vendor = item;
        this.navCtrl.navigateForward('/tabs/home/products/'+ item.name);
    }
    scanBarcode() {
        /*this.barcodeScanner.scan().then(barcodeData => {
            if(barcodeData.text != '') {
                this.loading = true;
                this.hasMoreItems = true;
                this.filter.page = 1;
                delete this.filter.q;
                this.filter.sku = barcodeData.text;
                this.getProducts();
            }
        }).catch(err => {
            console.log('Error', err);
        });*/
    }
}