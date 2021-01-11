import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
aboutApp:any;
aboutAppText:any;
privacyPolicy:any;
terms:any;
title:any;
termsText:any;
PrivacyText:any;
titleprivacyPolicy:any;
titleTerms:any;
public items: any = [];

  constructor(
    private api : ApiService,
     ) { }
  ngOnInit() {
    this.api.getAboutUs().subscribe(res =>{
      this.aboutApp = res
      console.log(this.aboutApp)
      this.aboutAppText = this.aboutApp.content.rendered;
      this.title = this.aboutApp.title.rendered;
      this.getcond();
          });
    this.api.getPricacy().subscribe(res =>{
      this.privacyPolicy = res
      console.log(this.privacyPolicy)
      this.PrivacyText = this.privacyPolicy.content.rendered;
      this.titleprivacyPolicy = this.privacyPolicy.title.rendered;
      this.getcond();
          });
    this.api.getTerms().subscribe(res =>{
      this.terms = res
      console.log(this.terms)
      this.termsText = this.terms.content.rendered;
      this.titleTerms = this.terms.title.rendered;
      this.getcond();
          });

  }
async getcond(){
  this.items = [
    { expanded: true , title: this.title , content: this.aboutAppText},
    { expanded: false , title: this.titleprivacyPolicy , content: this.PrivacyText },
    { expanded: false , title: this.titleTerms , content: this.termsText },

  ];
}
  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }
}
