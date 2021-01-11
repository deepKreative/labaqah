import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, Platform, ToastController, ModalController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../api.service';
import { Storage } from '@ionic/storage';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { CustService } from '../cust.service';

declare var google;

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {




  latitude = 23.6004009;
  longitude = 58.2915313;
  delLat:any;
  delLng:any;
  markers: marker[] = [
	  {
      
		  lat: this.service.userLocation.latitude,
		  lng: this.service.userLocation.longitude,
      label: '',
      icon:'assets/Group 33.svg',
		  draggable: true
	  }
  ]
  

  lat= this.service.userLocation.latitude;
  latD: number = 23.587130244378056;
  lng= this.service.userLocation.longitude;
  lngD: number = 58.374858953971476;
  
  
  mapType = 'roadmap';
  zoom = 14;
  selectedMarker;


  path: any = 'tabs/home';
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  options: GeolocationOptions;
  geoOptions: NativeGeocoderOptions;
  @ViewChild('map', { static: true }) mapElement: ElementRef;

  locations: any;
	locationsLat: any;
  locationsLong: any;
  vendorsLocation: any = [];

  map: any = {};

  // protected mapp: any;

  userAddress: any = '';

  errorMsg: string = '';

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    private router: Router,
    private navCtrl: NavController,
    private tc: ToastController,
    private storage: Storage,
    public service: ApiService,
    public modalCtrl: ModalController,
    public loadingController : LoadingController,
    public Cust : CustService
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this. getVendorsLocation(); 
  }


  ngOnInit() {}


  /////////////this to get the location of the add stores ////////////////////
  getVendorsLocation(){
    this.service.postItem('vendors').then(async resffff => {
      this.locations = resffff
      for(let item of this.locations){
        var venloc = {
          'lat':item.address.street_1,
          'lng':item.address.street_2,
          'label': '',
          'icon':'assets/vendorslocations.svg',
          'draggable': false,
        }
        this.markers.push(venloc);
    }
      });
  }

  /////////////this to get the location of the add stores ////////////////////
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }
  
  mapClicked($event: any) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      label: 'Delivary location',
      icon:'blue',
      draggable: true
    });
  }
  markerDragEnd(m: marker, $event: any) {
    this.delLat = $event.coords.lat;
    this.delLng = $event.coords.lng;
  }

  async locationfromMap(){

    const loading = await this.loadingController.create({
      message: 'Loading...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      duration: 2000
  });
      await loading.present();
    this.storage.set(this.Cust.DELLOCATIONMAPLAT, this.delLat);
    this.storage.set(this.Cust.DELLOCATIONMAPLNG, this.delLng);
    this.router.navigateByUrl('tabs/home');
    // loading.dismiss();
    
    // this.modalCtrl.dismiss({update: true});
  }

  async currentLoadUserMap(){

    const loading = await this.loadingController.create({
      message: 'Loading...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
  });
      await loading.present();
      this.geolocation.getCurrentPosition().then((resp) => {
      this.service.userLocation.latitude = resp.coords.latitude;
      this.service.userLocation.longitude = resp.coords.longitude;
      this.storage.set(this.Cust.DELLOCATIONLAT, resp.coords.latitude);
      this.storage.set(this.Cust.DELLOCATIONLNG,resp.coords.longitude);
      this.getLocationAdddress();
      loading.dismiss();
      this.router.navigateByUrl('tabs/home');
    }).catch((error) => {
      console.log('Error getting location', error);
      loading.dismiss();
    });
  }
  getLocationAdddress() {
    let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(this.service.userLocation.latitude, this.service.userLocation.longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.service.userLocation.address = result[0].thoroughfare+' '+ result[0].subLocality + ' ' + result[0].administrativeArea;
        this.service.userLocation.shortaddress = result[0].subLocality ;
        this.service.userLocation.countryname = result[0].countryName ;
        
        // this.modalCtrl.dismiss({update: true});
        }).catch((error: any) => {
            console.log(error);
            // this.modalCtrl.dismiss({update: true});
     });
  }
  getCoordsFromAddress(address) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.forwardGeocode(address)
      .then((result: NativeGeocoderResult[]) => {
        this.service.userLocation.latitude = result[0].latitude;
        this.service.userLocation.longitude = result[0].longitude;
        // this.modalCtrl.dismiss({update: true});
      }).catch((error: any) => {
        this.errorMsg = JSON.stringify(error);
        this.userAddress = "";
        this.service.userLocation.latitude = '';
        this.service.userLocation.longitude = '';
        // this.modalCtrl.dismiss({update: true});
      });
  }

  UpdateSearchResults() {
    if (this.userAddress == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.userAddress },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }
  SelectSearchResult(address) {
    this.userAddress = address;//May be delete
    this.service.userLocation.address = address;
    var address = address
    var street = this.service.userLocation.street.toString();
    var pincode = this.service.userLocation.pincode.toString();;
    var city = this.service.userLocation.city.toString();;
    var postal_code = this.service.userLocation.postal_code.toString();;
    this.getCoordsFromAddress(address);
    this.storage.set('userLocation', this.service.userLocation);
  }
  ClearAutocomplete() {
    this.autocompleteItems = []
  }
  close() {
    this.modalCtrl.dismiss({update: false});
  }
  

}
// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  icon:string ;
  draggable: boolean;
}
