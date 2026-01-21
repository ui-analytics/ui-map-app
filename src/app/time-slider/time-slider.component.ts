import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';
import { MapService } from '../services/map.service'
import { MapVariable } from '../shared/models/map-variable';
import { MapMode } from '../shared/enums/map-mode.enum';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { Options } from '@angular-slider/ngx-slider';

import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import classBreaks from "@arcgis/core/smartMapping/statistics/classBreaks.js";
import ColorVariable from '@arcgis/core/renderers/visualVariables/ColorVariable';
import * as relationshipRendererCreator from "@arcgis/core/smartMapping/renderers/relationship.js";

import { MapDefExpression } from '../shared/models/map-def-expr';



@Component({
  selector: 'app-time-slider',
  imports: [MatSliderModule,NgxSliderModule],
  templateUrl: './time-slider.component.html',
  styleUrl: './time-slider.component.css'
})
export class TimeSliderComponent implements OnInit, OnDestroy {
  private variableSubscription:Subscription;
  
  // Subject for debouncing year changes
  private yearChange$ = new Subject<number>();
  private yearChangeSubscription?: Subscription;

  currentVariable?: MapVariable;
  defExpressions: MapDefExpression = {year:''};
  defExpressionString: string = '';

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

      if (!variable.yearsAvailable.includes(this.value)) {
        this.value = variable.yearsAvailable.at(-1) ?? 0;
      } 
    });
  }

  yearsAvailable: any = {};
  value: number = 0;
  options: Options = {
    stepsArray: this.yearsAvailable
  };

  ngOnInit(): void {
    // Set up debounced year changes - waits 150ms after last change before applying
    this.yearChangeSubscription = this.yearChange$.pipe(
      debounceTime(150)
    ).subscribe(year => {
      this.applyYearChange(year);
    });
    
    this.mapService.getDefinitionExpressions().subscribe(exp => {
      console.log('DEFINITION EXPRESSIONS:',exp)
      this.defExpressions = exp;
      this.defExpressionString = Object.values(this.defExpressions).join(" and ");
      this.mapService.variableFL.definitionExpression = this.defExpressionString;
    })

    this.defExpressions.year = `year = ${this.value}`
    this.mapService.updateDefinitionExpressions(this.defExpressions);

    this.mapService.variableFL.definitionExpression = this.defExpressionString;
  }
  
  ngOnDestroy(): void {
    this.variableSubscription?.unsubscribe();
    this.yearChangeSubscription?.unsubscribe();
  }
  
  private applyYearChange(year: number): void {
    this.defExpressions.year = `year = ${year}`;
    this.mapService.updateDefinitionExpressions(this.defExpressions);
    this.mapService.variableFL.definitionExpression = this.defExpressionString;
    console.log('Year applied:', year);
  }

  onValueChange(event:any): void{
    this.value = event;
    // Emit to debounced subject instead of applying immediately
    this.yearChange$.next(this.value);
  }
}