import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Data } from '../data';
import { Settings } from '../data/settings';

@Component({
    selector: 'app-categories',
    templateUrl: 'categories.page.html',
    styleUrls: ['categories.page.scss']
})
export class CategoriesPage  {

    vendorCateory: any ;
    vendorCateory2: any;
    floVenrs: any;
    chocoVenrs: any;

    constructor(
        public api: ApiService, 
        public data: Data, 
        public loadingController: LoadingController, 
        public navCtrl: NavController, 
        public router: Router, 
        public settings: Settings, 
        public route: ActivatedRoute
        ) {}

    ngOnInit() { 

        this.api.getVendorsCat().subscribe(res =>{
            console.log(res);
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
    }
    getCategory(name) {
            console.log(name);
            this.navCtrl.navigateForward('/vendor-cat/' + name );
    
        }
    getProducts(id) {
        this.navCtrl.navigateForward('/tabs/categories/products/' + id);
    }
    subCategories(id){
	  return this.data.categories.filter(item => item.parent == id);
	}
  	showSubCategory(i){
	  	let intial = this.data.mainCategories[i].show;
	  	this.data.mainCategories.forEach(item => item.show = false);
	  	this.data.mainCategories[i].show = !intial;
        if(this.data.categories.filter(item => item.parent == this.data.mainCategories[i].id).length == 0) {
            this.getProducts(this.data.mainCategories[i].id);
        }
  	}
}