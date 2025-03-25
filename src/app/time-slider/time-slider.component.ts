import { AfterViewInit, Component, OnInit } from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';
import { MapService } from '../services/map.service'
import { MapVariable } from '../shared/models/map-variable';
import { MapMode } from '../shared/enums/map-mode.enum';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { Options } from '@angular-slider/ngx-slider';

import { Subscription } from 'rxjs';

import classBreaks from "@arcgis/core/smartMapping/statistics/classBreaks.js";
import ColorVariable from '@arcgis/core/renderers/visualVariables/ColorVariable';



@Component({
  selector: 'app-time-slider',
  imports: [MatSliderModule,NgxSliderModule],
  templateUrl: './time-slider.component.html',
  styleUrl: './time-slider.component.css'
})
export class TimeSliderComponent implements OnInit {
  private variableSubscription:Subscription;

  currentVariable?: MapVariable;

  constructor(private mapService: MapService) { 
    this.variableSubscription = this.mapService.getCurrentVariable().subscribe((variable) => {
      this.currentVariable = variable;
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

    classBreaks({
              layer: this.mapService.variableFL,
              field: this.currentVariable?.fieldName,
              classificationMethod: 'natural-breaks',
              numClasses:5
            }).then(res => {
              let breaks = res.classBreakInfos.map((info, i) => ({
                value: info.maxValue,
                label: info.label,
                color: this.mapService.colors[i]
              }))

              breaks = breaks.map(x => this.mapService.roundBreakLabel(x));          
    
              const colorVariable = new ColorVariable({
                field: this.currentVariable?.fieldName,
                stops: breaks
              })
    
              this.mapService.getMapMode().subscribe((mode)=> {
                    if (mode == MapMode.default) {
                      this.mapService.defaultRenderer.visualVariables = [colorVariable];
                      this.mapService.variableFL.renderer = this.mapService.defaultRenderer;
                      this.mapService.legend.layerInfos = [{layer:this.mapService.variableFL}]
                    }
                  });
            })


  }
}


