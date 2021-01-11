import { Component, OnInit } from '@angular/core';
import { NavController, Platform, ModalController, IonRouterOutlet } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Settings } from './../../data/settings';
import { Vendor } from './../../data/vendor';
import { Data } from 'src/app/data';
import { JsonPipe } from '@angular/common';
import { LocationPage } from 'src/app/location/location.page';
import { HomePage } from 'src/app/home/home.page';
//import { Data } from '/data';

@Component({
  selector: 'app-vendor-cat',
  templateUrl: './vendor-cat.page.html',
  styleUrls: ['./vendor-cat.page.scss'],
})
export class VendorCatPage implements OnInit {
  vendors: any;
  filtterdvendors: any= [];
  filtterdvendorss: any= [];
  filter: any = {};
  hasMoreItems: boolean = true;
  item: any;
  coor: any;
  floVen : any;
  chocoVen : any;
  name='';
  loading: any = false;
  user: any ;
  vendorName: any ;
  cat: any ;
  vendor1: any = [];
  venDisFlow: any = [];

  slash:'/'
  vendorCat: string;
  slideOpts = { effect: 'flip', 
  autoplay: true, parallax: true, loop: true, lazy: true };
  screenWidth: any = 300;
  distt: string;
  vendDist: string;
  constructor(
    public actvR : ActivatedRoute,
    public data: Data,
    public platform: Platform, 
    public api: ApiService, 
    public settings: Settings, 
    public router: Router, 
    public navCtrl: NavController, 
    public route: ActivatedRoute, 
    public vendor: Vendor ,
    public modalCtrl: ModalController, 
    public routerOutlet: IonRouterOutlet, 
    public homePage: HomePage,
    )
     {
    this.filter.page = 1;
    this.filter.per_page = 30;
    this.filter.wc_vendor = true;
  }
  goToSearch(){
    this.navCtrl.navigateForward('/tabs/search');
};
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.item) {
        this.item = JSON.parse(params.item);
        if(this.item.url) {
          this.filter.mstoreapp_vendor_type = this.item.url;
        }
      }
    });
    
      this.actvR.params.subscribe(params => {
        this.name= params['name'];
        this.vendorCat = this.name;
        this.cat = this.name;
});
      this.getVendors(); 
  }
  getHeight(child) {
    return (child.height * this.screenWidth) / child.width;
}
goto(item) {
  if (item.description == 'category') this.navCtrl.navigateForward('/tabs/home/products/' + item.url);
  else if (item.description == 'stores') {
      let navigationExtras = {
        queryParams: {
          item: JSON.stringify(item),
        }
      };
      this.navCtrl.navigateForward('/tabs/home/stores', navigationExtras);
  }
  else if (item.description == 'product') this.navCtrl.navigateForward('/tabs/home/product/' + item.url);
  else if (item.description == 'post') this.navCtrl.navigateForward('/tabs/home/post/' + item.url);
}

  async getVendors() {
  this.filter.page = 1;
      await this.api.postItem('vendors', this.filter).then(res => {
          this.vendors = res;
          for(let item of this.vendors){
                if (item.vendor_type[0] == this.name && parseInt(this.distance(item)) < this.data.dist) {
                  this.filtterdvendors.push(item);
                  }
                }
                
              }), err => {
          console.log(err);}}
  
 

  async getMoreVendors(event) {
      this.filter.page = this.filter.page + 1;
      await this.api.postItem('vendors', this.filter).then((res: any) => {
          this.vendors.push.apply(this.vendors, res);
          event.target.complete();
          if (res.length == 0) this.hasMoreItems = false;
          else event.target.complete();
      }, err => {
          event.target.complete();
      });
  }
  detail(item) {
      this.vendor.vendor = item;
      this.navCtrl.navigateForward('/tabs/home/products/'+ this.name );
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

  getUser(item){
return this
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
    return d;
   
  }
  toRad(Value) {
      return Value * Math.PI / 180;
  }
  drivingTime(item) {
    return (this.calcCrow(item.address.street_1, item.address.street_2, this.api.userLocation.latitude, this.api.userLocation.longitude) * 3 + 30).toFixed(0);
  }

  showSubCategory(i){
    let intial = this.data.mainCategories[i].show;
    this.data.mainCategories.forEach(item => item.show = false);
    this.data.mainCategories[i].show = !intial;
      if(this.data.categories.filter(item => item.parent == this.data.mainCategories[i].id).length == 0) {
          this.getProducts(this.data.mainCategories[i].id);
      }
  }
  getProducts(id) {
    this.navCtrl.navigateForward('/tabs/categories/products/' + id);
}



}

