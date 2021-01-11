import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {
  terms: Object;
  termsText: any;
  titleTerms: any;
  xyz: any;

  constructor(
    private api :ApiService,
  ) { }

  ngOnInit() {

    this.api.getTerms().subscribe(res =>{
      this.terms = res
      this.xyz =this.terms
      this.termsText = this.xyz.content.rendered;
      this.titleTerms = this.xyz.title.rendered;
          });
  }

}
