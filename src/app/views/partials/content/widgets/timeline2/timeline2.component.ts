// Angular
import {Component, Input, OnInit} from '@angular/core';

export interface Timeline2Data {
  time: string;
  text: string;
  icon?: string;
  attachment?: string;
}

@Component({
  selector: 'kt-timeline2',
  templateUrl: './timeline2.component.html',
  styleUrls: ['./timeline2.component.scss']
})
export class Timeline2Component implements OnInit {
  // Public properties
  @Input() data: Timeline2Data[];

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    if (!this.data) {
      this.data = [
        {
          time: '10:00',
          icon: 'fa fa-genderless kt-font-danger',
          text: 'HORNBY Coach R4410A BR Hawksworth Corridor 3rd',
        },
        {
          time: '12:45',
          icon: 'fa fa-genderless kt-font-success',
          text: 'Hornby 00 Gauge 0-4-0 Gildenlow Salt Co',
        },
        {
          time: '14:00',
          icon: 'fa fa-genderless kt-font-brand',
          text: '20pcs Model Garden Light Double Heads Lamppost Scale 1:100',
        },
        {
          time: '17:00',
          icon: 'fa fa-genderless kt-font-info',
          text: 'Hornby 00 Gauge 230mm BR Bogie Passenger Brake Coach Model (Red)',
        },
        {
          time: '16:00',
          icon: 'fa fa-genderless kt-font-brand',
          text: 'Hornby Santa\'s Express Train Set',
        },
        {
          time: '17:00',
          icon: 'fa fa-genderless kt-font-danger',
          text: 'Hornby Gauge Western Express Digital Train Set with eLink and TTS Loco Train Set',
        },
      ];
    }
  }
}
