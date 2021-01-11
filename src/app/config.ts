import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Headers } from '@angular/http';

declare var oauthSignature: any;
var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


@Injectable({
  providedIn: 'root',
})
export class Config {

    url: any;
    consumerKey: any;
    consumerSecret: any;
    avatar: any = "assets/image/shop-icon.jpg";
    oauth: any;
    signedUrl: any;
    randomString: any;
    oauth_nonce: any;
    oauth_signature_method: any;
    encodedSignature: any;
    searchParams: any;
    customer_id: any;
    params: any;
    options: any = {};
    optionstwo: any = {};
    lang: any = 'en';
    constructor() {

        this.url ="https://labaqah.com";
        // this.url ="https://www.teamway.om/labaqa-store/";
        this.consumerKey ='ck_37d504519fbbd8af530ee13e695f96b5d6338658';
        // this.consumerKey ='ck_a2d48baacc3effa79d3b23ac9ce2dbe982e8545f';
        this.consumerSecret ='cs_993cc17908ceca94ef5c3be244f38bb9007feaff';
        // this.consumerSecret ='cs_81bab54181027a7a91b6b2371a17af177ae4426c';
        
        this.options.withCredentials = true;
        this.options.headers = {};
        this.optionstwo.withCredentials = false;
        this.optionstwo.headers = {};
        this.oauth = oauthSignature;
        this.oauth_signature_method = 'HMAC-SHA1';
        this.searchParams = new URLSearchParams();
        this.params = {};
        this.params.oauth_consumer_key = this.consumerKey;
        this.params.oauth_signature_method = 'HMAC-SHA1';
        this.params.oauth_version = '1.0';
    }
    setOauthNonce(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }
    setUrl(method, endpoint, filter) {
        var key;
        var unordered = {};
        var ordered = {};
        if (this.url.indexOf('https') >= 0) {
            unordered = {};
            if (filter) {
                console.log('fron set',filter);
                for (key in filter) {
                    console.log('fron set',filter);
                    console.log('fron set key',key);
                    unordered[key] = filter[key];
                }
            }
            unordered['consumer_key'] = this.consumerKey;
            unordered['consumer_secret'] = this.consumerSecret;
            unordered['lang'] = this.lang;
            Object.keys(unordered).sort().forEach(function(key) {
                ordered[key] = unordered[key];
            });
            this.searchParams = new URLSearchParams();
            for (key in ordered) {
                this.searchParams.set(key, ordered[key]);
            }
            return this.url + '/wp-json/wc/v3/' + endpoint + this.searchParams.toString();
        }
        else {
            var url = this.url + '/wp-json/wc/v3/' + endpoint;
            this.params['oauth_consumer_key'] = this.consumerKey;
            this.params['oauth_nonce'] = this.setOauthNonce(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            this.params['oauth_timestamp'] = new Date().getTime() / 1000;
            for (key in this.params) {
                unordered[key] = this.params[key];
            }
            if (filter) {
                for (key in filter) {
                    unordered[key] = filter[key];
                }
            }
            unordered['lang'] = this.lang;
            Object.keys(unordered).sort().forEach(function(key) {
                ordered[key] = unordered[key];
            });
            this.searchParams = new URLSearchParams();
            for (key in ordered) {
                this.searchParams.set(key, ordered[key]);
            }
            this.encodedSignature = this.oauth.generate(method, url, this.searchParams.toString(), this.consumerSecret);
            return this.url + '/wp-json/wc/v3/' + endpoint + this.searchParams.toString() + '&oauth_signature=' + this.encodedSignature;
        }
    }
}