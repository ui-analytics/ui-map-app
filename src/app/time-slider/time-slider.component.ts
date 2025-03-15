import { AfterViewInit, Component, OnInit } from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';
import { MapService } from '../services/map.service'

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { Options } from '@angular-slider/ngx-slider';

import { Subscription } from 'rxjs';


@Component({
  selector: 'app-time-slider',
  imports: [MatSliderModule,NgxSliderModule],
  templateUrl: './time-slider.component.html',
  styleUrl: './time-slider.component.css'
})
export class TimeSliderComponent implements OnInit {
  private variableSubscription:Subscription;

  constructor(private mapService: MapService) { 
    this.variableSubscription = this.mapService.getCurrentVariable().subscribe((variable) => {
      // create in format needed for time slider
      this.yearsAvailable = variable.yearsAvailable.map(year => ({ value: year }));
      // console.log(variable.name, this.yearsAvailable)
      // set the slider steps array
      this.options = {
        stepsArray: this.yearsAvailable
      };
      // set value to the last element
      this.value = variable.yearsAvailable.at(-1) ?? 0;
    });
  }

  yearsAvailable: any = {};
  value: number = 0;
  options: Options = {
    stepsArray: this.yearsAvailable
  };

  ngOnInit(): void {
    this.mapService.variableFL.definitionExpression = `year = ${this.value}`;
  }

  onValueChange(event:any): void{
    this.value = event;
    this.mapService.variableFL.definitionExpression = `year = ${this.value}`;
  }
}


