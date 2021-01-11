import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  privacyPolicy: Object;
  PrivacyText: any;
  titleprivacyPolicy: any;
  xyz: any;

  constructor(
   private api :ApiService,
  ) { }

  ngOnInit() {

    this.api.getPricacy().subscribe(res =>{
      this.privacyPolicy = res
      this.xyz = this.PrivacyText
      this.PrivacyText = this.xyz.content.rendered;
      this.titleprivacyPolicy = this.xyz.title.rendered;
          });
  }

}
