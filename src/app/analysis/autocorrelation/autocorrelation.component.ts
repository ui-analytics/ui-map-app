import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule }  from '@angular/material/card'
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

import {Observable, Subscription} from 'rxjs';

import { MapMode } from '../../shared/enums/map-mode.enum';
import { MapService } from '../../services/map.service';
import { MapVariable } from '../../shared/models/map-variable';
import { MapDefExpression } from '../../shared/models/map-def-expr';

@Component({
  selector: 'app-autocorrelation',
  imports: [MatCardModule,MatSlideToggleModule,MatFormFieldModule,MatSelectModule,CommonModule],
  templateUrl: './autocorrelation.component.html',
  styleUrl: './autocorrelation.component.css'
})
export class AutocorrelationComponent {

  private variableSubscription?:Subscription;
  private mapModeSubscription?:Subscription;

  constructor(private mapService: MapService) {
    
  }

  checked: boolean = false;
  filterControl = new FormControl();
  currentVariable?: MapVariable;
  
  defExpressions: MapDefExpression = {year:''};
  defExpressionString: string = '';

  ngOnInit(): void {
    this.mapModeSubscription = this.mapService.getMapMode().subscribe((mode)=> {
          if (mode == MapMode.autocorrelation) {
            this.checked = true;
          } else {
            this.checked = false;
          }
        });

    this.variableSubscription = this.mapService.getCurrentVariable().subscribe((variable) => {
      this.currentVariable = variable;
      
      if (this.defExpressions.autocorrelation) {
        let expression = `${this.currentVariable?.moransField} in (${this.selectedCategories})`
        this.defExpressions.autocorrelation = expression;
        this.defExpressionString = Object.values(this.defExpressions).join(" and ");
        this.mapService.variableFL.definitionExpression = this.defExpressionString;
        this.mapService.updateDefinitionExpressions(this.defExpressions);
      }
    })

    this.mapService.getDefinitionExpressions().subscribe(exp => {
      this.defExpressions = exp;
      this.defExpressionString = Object.values(this.defExpressions).join(" and ");
      this.mapService.variableFL.definitionExpression = this.defExpressionString;
    })
    
  }

  onToggleChange(event:any) {
    
    if (event.checked) {
      this.mapService.setMapMode(MapMode.autocorrelation);
    } else {
      this.mapService.setMapMode(MapMode.default);
      this.mapService.variableFL.renderer = this.mapService.defaultRenderer;
      delete this.defExpressions.autocorrelation;
      this.mapService.updateDefinitionExpressions(this.defExpressions);
    }
    this.checked = event.checked;

  }

  isToggled() {
    return this.checked
  }

  onFilterChange(event:string[]) {
    let expression = '';
    if (event.length > 0) {
      let categories = event.map(s => `'${s}'`).join(',');
      expression = `${this.currentVariable?.moransField} in (${categories})`
      this.defExpressions.autocorrelation = expression;
    } else {
      delete this.defExpressions.autocorrelation;
    }

    this.mapService.updateDefinitionExpressions(this.defExpressions)
  }

}
