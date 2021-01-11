import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, ToastController, LoadingController  } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Data } from '../data';
import { Settings } from '../data/settings';
import { Product } from '../data/product';
import { FilterPage } from '../filter/filter.page';
import { Vendor } from '../data/vendor';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { Config } from '../config';
import { HttpParams } from "@angular/common/http";
import { CustService } from '../cust.service';
import { Storage } from '@ionic/storage';
import { jsonpFactory } from '@angular/http/src/http_module';
import { FormArrayName } from '@angular/forms';
import { md5 } from '../review/md5';

@Component({
    selector: 'app-products',
    templateUrl: 'products.page.html',
    styleUrls: ['products.page.scss']
})
export class ProductsPage {
    // @Input() Message: string;
    products: any = [];
    ratingArr: any = [];
    tempProducts: any = [];
    check: any = [];
    subCategories: any = [];
    filter: any = {};
    filterr: any = {};
    attributes: any;
    hasMoreItems: boolean = true;
    loader: boolean = false;
    searchInput: any;
    showSearch: boolean = true;
    cart: any = {};
    newcart: any = {};
    options: any = {};
    lan: any = {};
    variationId: any;
    gridView: boolean = true;
    quantity: any;
    disableButton: boolean = false;
    results: any;
    addonsList: any = [];//ADDONS
    xyz: any = [];//ADDONS
    product: any;
    addedProduct:  boolean = false;
    groupedProducts: any = [];
    variations: any = [];
    name = '';
    mnPrice: any = '';
    mxPrice: any = '';
    max_of_array: any = '';
    min_of_array: any = '';
    vendors: unknown;
    floVen: any;
    getCat:any;
    getCatName: any;
    getCatPhone: any;
    getCatIcon: any;
    getCatI: any;
    getCatDisc: any;
    vendor_disc: any;
    id: any;
    reviews: any = [];
    tempReviews: any;
    showReviews: boolean = false;
    count: any;
    count5: number = 0;
    count4: number = 0;
    count3: number = 0;
    count2: number = 0;
    count1: number = 0;
    count5Percentage: number = 0;
    count4Percentage: number = 0;
    count3Percentage: number = 0;
    count2Percentage: number = 0;
    count1Percentage: number = 0;
    countTotalPercentage: number = 0;

    constructor( 
        public actvr:ActivatedRoute, 
        public storage: Storage, 
        public toastController: ToastController, 
        public custSevice:CustService,
        public config: Config, 
        public alertController: AlertController, 
        public translate: TranslateService, 
        public vendor: Vendor, 
        public modalController: ModalController, 
        public api: ApiService, 
        public data: Data, 
        public productx: Product, 
        public settings: Settings, 
        public router: Router, 
        public navCtrl: NavController, 
        public route: ActivatedRoute,
        public loadingController : LoadingController
        ) {
            this.filter.page = 1;
            this.filterr.page = 1;
            this.filter.status = 'publish';
            this.options.quantity = 1;
            this.actvr.params.subscribe(params => {
                this.name= params['name'];
            });

            this.dataFilterd();

            

          }

    async getFilter() {

        const modal = await this.modalController.create({
            component: FilterPage,
            componentProps: {
                filter: this.filter,
                attributes: this.attributes,
            }
            
        });

        modal.present();
        const {
            data
        } = await modal.onDidDismiss();
        if (data) {
            this.filter = data;
            Object.keys(this.filter).forEach(key => this.filter[key] === undefined ? delete this.filter[key] : '');
            this.filter.page = 1;
            this.dataFilterd();
            this.max_of_array = this.custSevice.sharedData;
            this.getProducts();
        }else{
        }
    }

    loadData(event) {
        this.filter.page = this.filter.page + 1;
        this.api.postItem('products', this.filter).then(res => {
            this.tempProducts = res;
            this.products.push.apply(this.products, this.tempProducts);

            event.target.complete();
            if (this.tempProducts.length == 0) this.hasMoreItems = false;
        }, err => {
            event.target.complete();
        });
        console.log('this.products',this.products);

    }
    getProducts() {
        this.loader = true;
        this.api.postItem('products', this.filter).then(res => {
            this.xyz = res
            const pro_arr = this.xyz;
            if(this.max_of_array){
                this.products = pro_arr.filter (item => {

                    return (item.price <= this.max_of_array && item.price >= this.min_of_array) ;
                })
            }else{
                this.max_of_array = Math.max.apply(Math,pro_arr.map(function(o){return o.price;}))
                this.min_of_array = Math.min.apply(Math,pro_arr.map(function(o){return o.price;}))
                this.products = pro_arr.filter (item => {
                    return (item.price <= this.max_of_array && item.price >= this.min_of_array) ;
                })
                console.log('this.productsdsdsd',this.products);
            }
           this.getCat=pro_arr[0].vendor.banner
           this.getCatName=pro_arr[0].vendor.name
           this.getCatPhone=pro_arr[0].vendor.phone
           this.getCatIcon=pro_arr[0].vendor.icon
           this.vendor_disc=pro_arr[0].vendor.vendor_desc;
            this.loader = false;
        }, err => {
            console.log(err);
        });
    }
    getAttributes() {
        this.api.postItem('product-attributes', {
            category: this.filter.id
        }).then(res => {
            this.attributes = res;
            console.log('this.attributes',this.attributes);
        }, err => {
            console.log(err);
        });
    }

    dataFilterd(){
        this.custSevice.getSherdData();
        }
        
    ngOnInit() {

        this.filterr.page = 1;
        this.id = this.route.snapshot.paramMap.get('id');

        if(this.route.snapshot.paramMap.get('id')){
            this.filter.id = this.route.snapshot.paramMap.get('id');
        }
        if(this.vendor.vendor.id){
            this.filter.vendor = this.vendor.vendor.id ? this.vendor.vendor.id : this.vendor.vendor.ID;
        }
        if(this.vendor.vendor.wcpv_product_vendors) {
            delete this.filter.vendor;
            this.filter.wcpv_product_vendors = this.vendor.vendor.wcpv_product_vendors;
        }
        if (this.data.categories && this.data.categories.length) {
            for (var i = 0; i < this.data.categories.length; i++) {
                if (this.data.categories[i].parent == this.filter.id) {
                    this.subCategories.push(this.data.categories[i]);
                }
            }
        }
        if (this.settings.colWidthProducts == 4) this.filter.per_page = 15;
        this.getProducts();
        this.getAttributes();
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
    
        
    }

    async getReviews(id) {
        this.loader = true;
        this.filterr.page = 1;
        this.id = this.route.snapshot.paramMap.get('id');
        this.filterr.product_id = id.toString();
        await this.api.postItem('product_reviews',this.filterr).then(res => {
            this.reviews = res;
            for (let item of this.reviews) {
                this.ratingArr.push( parseInt(item.rating) );
            }
            var sum = this.ratingArr.reduce(function(a, b){
                return a + b;
            }, 0);
            this.countTotalPercentage = sum/this.ratingArr.length ; 
            this.count = this.reviews.length;
        }, err => {});
    }
    getVariationProducts() {
        this.api.getItem('products/' + this.product.id + '/variations', {per_page: 100}).then(res => {
            this.variations = res;
        }, err => {});
    }
    goToCart(){
        this.navCtrl.navigateForward('tabs/cart');
    }
    getProduct(product) {
        this.productx.product = product;
        this.navCtrl.navigateForward(this.router.url + '/product/' + product.id);
    }
    getCategory(id) {
        var endIndex = this.router.url.lastIndexOf('/');
        var path = this.router.url.substring(0, endIndex);
        this.navCtrl.navigateForward(path + '/' + id);
    }
    loaded(product){
        product.loaded = true;
    }
    onInput(){
        if (this.searchInput.length) {
            this.products = '';
            this.filter.q = this.searchInput;
            this.filter.page = 1;
            this.getProducts();
        } else {
            this.products = '';
            this.filter.q = undefined;
            this.filter.page = 1;
            this.getProducts();
        }
    }
    ionViewWillLeave(){
        this.showSearch = false;
    }
    ionViewDidLeave() {
        this.vendor.vendor = {};
        this.showSearch = true;
    }
    toggleGridView() {
        this.gridView = !this.gridView;
    }

    async addToCart(product) {
        if(product.manage_stock && product.stock_quantity < this.data.cart[product.id]) {
            this.presentAlert(this.lan.message, this.lan.lowQuantity);
        }else if (product.variationAttributes==null) {
            this.options.product_id = product.id;
            this.options.quantity = this.quantity;
            this.disableButton = true;
            this.custSevice.getvendorId().then(async result => {
                if(result == product.vendor.name){
                    const loading = await this.loadingController.create({
                        message: 'Loading...',
                        translucent: true,
                        cssClass: 'custom-class custom-loading'
                    });
                        await loading.present();
                this.validatedtocart(product,product.vendor.name,loading);   
                }else{
                    if (result){
                        var isclear= this.warn(result);
                            if(await isclear == true){
                                const loading = await this.loadingController.create({
                                    message: 'Loading...',
                                    translucent: true,
                                    cssClass: 'custom-class custom-loading'
                                });
                                    await loading.present();
                                this.getandclearCart(product,loading);
                                }else{}     
                    }else{
                        const loading = await this.loadingController.create({
                            message: 'Loading...',
                            translucent: true,
                            cssClass: 'custom-class custom-loading'
                        });
                            await loading.present();
                        this.validatedtocart(product,product.vendor.name,loading); 
                    }
                }
            });
        }else{
          var endIndex = this.router.url.lastIndexOf('/');
          var path = this.router.url.substring(0, endIndex);
          this.navCtrl.navigateForward(path +'/'+this.name+ '/product/' + product.id);
        //   if (this.data.cart[product.id] != undefined) this.data.cart[product.id] += 1;
        //   else this.data.cart[product.id] = 1;
        //   this.options.product_id = product.id;
        //   await this.api.postItem('add_to_cart', this.options).then(res => {
        //       this.cart = res;
        //       this.data.updateCart(this.cart.cart);
        //     }, err => {
        //       console.log(err);
        //   });
        }
        
    }
    async clearcart(cartItems) {
        var myJSON = JSON.stringify(cartItems.cart_contents);
        this.api.postItem('vendors' , myJSON).then(res => {
            this.check = res;
        },);

        for(let i=0;i<cartItems.length;i++)
        {
          var res= await this.deleteItem(cartItems[i].key,1,null)
        }
    }
    cartcontents: any = {};

    async getandclearCart(product,loading) {
        this.addedProduct= true;
        await this.api.postItem('cart').then(res => {
            this.cart = res;
            var allkeys = Object.keys((this.cart.cart_contents))
            var str_array = allkeys.toString().split(',');
            this.deleteWholeCart(str_array,product,loading);
            }, err => {
            console.log(err);
            });
    }

        async warn(vendor) {
        return new Promise(async (resolve) => {
          const confirm = await this.alertController.create({
            header: 'confirm',
            message: 'Are you sure to clear cart of store '+vendor,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  return resolve(false);
                },
              },
              {
                text: 'OK',
                handler: () => {
                  return resolve(true);
                  
                },
              },
            ],
          });
    
          await confirm.present();
        });
      }
      async validatedtocart(product,vendorid,loading){
        this.quantity=1;
        this.options.quantity = this.quantity;
        await this.api.postItem('add_to_cart', this.options).then(res => {
            this.results = res;
            if(this.results.error) {
            } else { 
                this.cart = res;
                this.data.updateCart(this.cart.cart);
                this.storage.set(this.custSevice.VENDORID,vendorid);
            }
            this.disableButton = false;
            loading.dismiss();
        }, err => {
            console.log(err);
            this.disableButton = false;
            loading.dismiss();
        });
}

    async checkAndDel(){
        this.cart = 0;
    }
    async presentToast(message) {
        const toast = await this.toastController.create({
          message: message,
          duration: 500,
          position: 'top'
        });
        toast.present();
    }
    
    selectAdons() {
        this.options = {};
        let valid = this.validateform();
        if(valid) {
            this.addonsList.forEach((value, i) => {
                value.selectedName = value.name.toLowerCase();
                value.selectedName = value.selectedName.split(' ').join('-');
                value.selectedName = value.selectedName.split('.').join('');
                value.selectedName = value.selectedName.replace(':','');
                    value.options.forEach((option, j) => {
                        option.selectedLabel = option.label.toLowerCase();
                        option.selectedLabel = option.selectedLabel.split(' ').join('-');
                        option.selectedLabel = option.selectedLabel.split('.').join('');
                        option.selectedLabel = option.selectedLabel.replace(':','');
                        if (value.selected instanceof Array) {
                            if (value.selected.includes(option.label)) {
                                this.options['addon-' + this.product.id + '-' + value.selectedName + '-' + i + '[' + j + ']' ] = option.selectedLabel;
                            }
                        }
                        else if (option.label == value.selected && value.type == 'select') {
                            this.options['addon-' + this.product.id + '-' + value.selectedName + '-' + i ] = option.selectedLabel + '-' + (j + 1);
                        }
                        else if (option.label == value.selected && value.type == 'radiobutton') {
                            this.options['addon-' + this.product.id + '-' + value.selectedName + '-' + i + '[' + j + ']' ] = option.selectedLabel;
                        }
                        else if (value.type === 'custom_textarea' && option.input && option.input !== '') {
                            this.options['addon-' + this.product.id + '-' + value.selectedName + '-' + i + '[' + option.selectedLabel + ']' ] = option.input;
                        }
                    });
                if(value.type == 'custom_text'){
                    let label = value.name;
                    label = label.toLowerCase();
                    label = label.split(' ').join('-');
                    label = label.split('.').join('');
                    label = label.replace(':','');
                    this.options['addon-' + this.product.id + '-' + label + '-' + i ] = value.input;
                }    
            });
        }
        return valid;
    }
    validateform(){
        if(this.addonsList){
             for(let addon in this.addonsList){
                for(let item in this.addonsList[addon].fields){
                    if(this.addonsList[addon].fields[item].required == 1 && this.addonsList[addon].fields[item].selected == ''){
                        this.presentAlert(this.lan.oops, this.lan.PleaseSelect +' '+ this.addonsList[addon].fields[item].name);
                        return false;
                    }
                }
                if(this.addonsList[addon].type == 'custom_text'){
                    if(this.addonsList[addon].required == 1 && (!this.addonsList[addon].input || this.addonsList[addon].input == '')){
                        this.presentAlert(this.lan.oops, this.lan.PleaseSelect +' '+ this.addonsList[addon].name);
                        return false;
                    }
                }  
            }
            return true;
        }
        return true;
    }

    async deleteFromCart(product){
        var params: any = {};
        for (let key in this.data.cartItem) {
          if (this.data.cartItem[key].product_id == product.id) {
            if (this.data.cartItem[key].quantity != undefined && this.data.cartItem[key].quantity == 0) {
                this.data.cartItem[key].quantity = 0;
            }
            else {
                this.data.cartItem[key].quantity -= 1;
            };
            if (this.data.cart[product.id] != undefined && this.data.cart[product.id] == 0) {
                this.data.cart[product.id] = 0
            }
            else {
                this.data.cart[product.id] -= 1
            };
            params.key = key;
            params.quantity = this.data.cartItem[key].quantity;
          }      
        }    
        params.update_cart = 'Update Cart';
        params._wpnonce = this.data.cartNonce;
        await this.api.postItem('update-cart-item-qty', params).then(res => {
            this.cart = res;
            this.data.updateCart(this.cart.cart_contents);
            this.storage.set(this.custSevice.VENDORID,'');
        }, err => {
            console.log(err);
        });
    }


    setVariations2() {
        var doAdd = true;
        if (this.product.type == 'variable' && this.product.variationOptions != null) {
          for (var i = 0; i < this.product.variationOptions.length; i++) {
            if (this.product.variationOptions[i].selected != null) {
              this.options['variation[attribute_' + this.product.variationOptions[i].attribute +
                  ']'] = this.product.variationOptions[i].selected;
            } else if (this.product.variationOptions[i].selected == null && this.product.variationOptions[i].options.length != 0) {
              this.presentAlert(this.lan.options, this.lan.select +' '+ this.product.variationOptions[i].name);
              doAdd = false;
              break;
            } else if (this.product.variationOptions[i].selected == null && this.product.variationOptions[i].options.length == 0) {
              this.product.stock_status = 'outofstock';
              doAdd = false;
              break;
            }
          }
          if (this.product.variation_id) {
            this.options['variation_id'] = this.product.variation_id;
          }
        }
        return doAdd;
    }
    setGroupedProducts(){
        if(this.product.type == 'grouped') {
            this.options['add-to-cart'] = this.product.id;
            this.groupedProducts.forEach(item => {
                if(item.selected){
                    this.options['quantity['+ item.id +']'] = item.selected;
                }
            })
            return true;

        } else return true;
    }
    setVariations(product) {
        if(product.variationId){
            this.options.variation_id = product.variationId;
        }
        product.attributes.forEach(item => {
            if (item.selected) {
                this.options['variation[attribute_pa_' + item.name + ']'] = item.selected;
            }
        })
        for (var i = 0; i < product.attributes.length; i++) {
            if (product.type == 'variable' && product.attributes[i].variation && product.attributes[i].selected == undefined) {
                this.presentAlert(this.lan.options, this.lan.select +' '+ product.attributes[i].name +' '+ this.lan.option);
                return false;
            }
        }
        return true;
    }
    async presentAlert(header, message) {
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: ['OK']
        });
        await alert.present();
    }
    async updateToCart(product){
        var params: any = {};
        if(product.manage_stock && product.stock_quantity < this.data.cart[product.id]) {
            this.presentAlert(this.lan.message, this.lan.lowQuantity);
        } else {
          for (let key in this.data.cartItem) {
            if (this.data.cartItem[key].product_id == product.id) {
                  if (this.data.cartItem[key].quantity != undefined && this.data.cartItem[key].quantity == 0) {
                      this.data.cartItem[key].quantity = 0
                  }
                  else {
                      this.data.cartItem[key].quantity += 1
                  };
                  if (this.data.cart[product.id] != undefined && this.data.cart[product.id] == 0) {
                      this.data.cart[product.id] = 0
                  }
                  else {
                      this.data.cart[product.id] += 1
                  };
                  params.key = key;
                  params.quantity = this.data.cartItem[key].quantity;
            }      
          }
          params.update_cart = 'Update Cart';
          params._wpnonce = this.data.cartNonce;
          await this.api.postItem('update-cart-item-qty', params).then(res => {
              this.cart = res;
              this.data.updateCart(this.cart.cart_contents);
          }, err => {
              console.log(err);
          });
        }
    }
    async deleteItem(itemKey, qty,product) {
         await this.api.postItem('remove_cart_item&item_key=' + itemKey).then(res => {
             this.cart = res;
             this.data.updateCart(this.cart.cart_contents);
         }, err => {
             console.log(err);
         });
     }

     async deleteWholeCart(array,product,loading) {
        var counter=0;
        for (const item of array) {
            counter++;
            await this.api.postItem('remove_cart_item&item_key=' + item).then(res => {
                this.cart = res;
                this.data.updateCart(this.cart.cart_contents);
            }, err => {   
                console.log(err);
            });
        }
        this.storage.set(this.custSevice.VENDORID,product.vendor.name);

       this.validatedtocart(product,product.vendor.name,loading);   
      }
}