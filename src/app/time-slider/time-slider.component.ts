import { Component } from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { Options } from '@angular-slider/ngx-slider';


@Component({
  selector: 'app-time-slider',
  imports: [MatSliderModule,NgxSliderModule],
  templateUrl: './time-slider.component.html',
  styleUrl: './time-slider.component.css'
})
export class TimeSliderComponent {
  value: number = 2020;
  options: Options = {
    floor: 2020,
    ceil: 2025,
  };
}
