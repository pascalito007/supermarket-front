// Angular
import {Component, Input, OnInit} from '@angular/core';
// Lodash
import {shuffle} from 'lodash';

export interface Widget5Data {
  pic?: string;
  title: string;
  desc: string;
  url?: string;
  info?: string;
  largeInfo?: string;
}

@Component({
  selector: 'kt-widget5',
  templateUrl: './widget5.component.html',
  styleUrls: ['./widget5.component.scss']
})
export class Widget5Component implements OnInit {
  // Public properties
  @Input() data: Widget5Data[];

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    if (!this.data) {
      this.data = shuffle([
        {
          pic: './assets/media/products/product6.jpg',
          title: 'Hornby 2014 Catalogue',
          desc: 'Product Description Hornby 2014 Catalogue Box Contains 1 x one catalogue',
          info: '<span>Client:</span><span class="kt-font-info"> John Doe</span>' +
            '<span>Date:</span><span class="kt-font-info"> 23.08.17</span>',
          largeInfo: '<div class="kt-widget5__stats">\n' +
            ' <span class="kt-widget5__number">19,200</span>\n' +
            ' <span class="kt-widget5__sales">Ventes</span>\n' +
            ' </div>\n' +
            ' <div class="kt-widget5__stats">\n' +
            ' <span class="kt-widget5__number">1046</span>\n' +
            ' <span class="kt-widget5__votes">Notes</span>\n' +
            ' </div>'
        },
        {
          pic: './assets/media/products/product10.jpg',
          title: 'CLASSIC TOY TRAIN SET TRACK CARRIAGES',
          desc: 'BIG CLASSIC TOY TRAIN SET TRACK CARRIAGE LIGHT ENGINE SOUND BOXED KIDS BATTER',
          info: '<span>Client:</span><span class="kt-font-info"> Elton JOHN</span>' +
            '<span>Date:</span><span class="kt-font-info"> 23.08.17</span>',
          largeInfo: '<div class="kt-widget5__stats">\n' +
            ' <span class="kt-widget5__number">24,583</span>\n' +
            ' <span class="kt-widget5__sales">Ventes</span>\n' +
            ' </div>\n' +
            ' <div class="kt-widget5__stats">\n' +
            ' <span class="kt-widget5__number">3809</span>\n' +
            ' <span class="kt-widget5__votes">Notes</span>\n' +
            ' </div>'
        },
        {
          pic: './assets/media/products/product11.jpg',
          title: 'HORNBY Coach R4410A BR Hawksworth',
          desc: 'Hornby 00 Gauge BR Hawksworth 3rd Class W 2107 W # R4410A',
          info: '<span>Client:</span><span class="kt-font-info"> Jean-Pascal</span>' +
            '<span>Date:</span><span class="kt-font-info"> 23.08.17</span>',
          largeInfo: '<div class="kt-widget5__stats">\n' +
            ' <span class="kt-widget5__number">210,054</span>\n' +
            ' <span class="kt-widget5__sales">Ventes</span>\n' +
            ' </div>\n' +
            ' <div class="kt-widget5__stats">\n' +
            ' <span class="kt-widget5__number">1103</span>\n' +
            ' <span class="kt-widget5__votes">Notes</span>\n' +
            ' </div>'
        },
      ]);
    }
  }
}
