import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { Settings } from '../data/settings';
import { ProductsPage } from '../products/products.page';
import { CustService } from '../cust.service';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.page.html',
    styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
    price: any = {lower: 0, upper: 1000};
    pricelist: any = {lower: 0, upper: 1000};
    attributes: any;
    id: any;
    filter: any;
    quantity: any;
    hasMoreItems: boolean = true;
    searchInput: any = "";
    products: any = [];
    loader: boolean = false;
    name:string;
    getdaT: any;
    constructor(
        public api: ApiService, 
        public loadingController: LoadingController, 
        public modalCtrl: ModalController, 
        public settings: Settings, 
        public navParams: NavParams,
        public cust : CustService,
        // public pPrice: ProductsPage,
        ) {}
    ngOnInit() {
        this.filter = this.navParams.data.filter;
        
        
        // console.log('this is from fillter', this.navParams.data.filter);
        console.log('this is from fillter', this.filter);
        
        this.attributes = this.navParams.data.attributes;
        console.log(this.attributes)
        if (this.filter.min_price) {
            this.price.lower = this.filter.min_price;
            this.price.upper = this.filter.max_price;
            console.log('max_price',this.filter.max_price);
        } else {this.price.upper = this.settings.settings.max_price;
        console.log('max_price else',this.price.upper);}
    }
    dismiss() {
        this.modalCtrl.dismiss();
    }
    somethingChanged(){
        console.log(this.name);
    }
    showVal(value) {

         console.log('value',value);
        this.cust.sharedData = value ;
        console.log('this.cust.sharedData',this.cust.sharedData);
         
         }
    applyFilter() {
        var i = 0;
        for (const [key, value] of Object.entries(this.attributes)) {
            if (this.attributes[key].terms.length) this.attributes[key].terms.forEach(term => {
                if (term.selected && term.selected == true) {
                    this.filter['attributes' + i] = this.attributes[key].id;
                    this.filter['attribute_term' + i] = term.term_id;
                } else {
                    this.filter['attributes' + i] = undefined;
                    this.filter['attribute_term' + i] = undefined;
                }
                i++;
            });
        }
        this.filter.min_price = this.price.lower;
        this.filter.max_price = this.price.upper;
        console.log('this.price.lower',this.price.upper);
        console.log('this.price.lower',this.price.lower);
        console.log('this.filter.min_price',this.filter.min_price);
        console.log('this.filter.max_price',this.filter.max_price);
        this.modalCtrl.dismiss(this.filter);
    }
 
    
}