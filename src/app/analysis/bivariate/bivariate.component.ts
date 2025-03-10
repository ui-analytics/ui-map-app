import { Component, OnInit } from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule,Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule }  from '@angular/material/card'
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import { MapService } from '../../services/map.service';
import { MapVariable } from '../../shared/models/map-variable';


import * as relationshipRendererCreator from "@arcgis/core/smartMapping/renderers/relationship.js";


@Component({
  selector: 'app-bivariate',
  imports: [MatButtonModule,MatCardModule,MatFormFieldModule,
    MatAutocompleteModule,AsyncPipe,MatInputModule,
    FormsModule,ReactiveFormsModule],
  templateUrl: './bivariate.component.html',
  styleUrl: './bivariate.component.css'
})
export class BivariateComponent implements OnInit {

  private variableSubscription?:Subscription;
  private mapModeSubscription?:Subscription;

  constructor(private mapService: MapService) {}

  field1Control = new FormControl('',Validators.required);
  field1Filter?: Observable<MapVariable[]>;

  field2Control = new FormControl('',Validators.required);
  field2Filter?: Observable<MapVariable[]>;

  variables: MapVariable[] = [];

  field1Variable: string = '';
  field2Variable: string = '';

  ngOnInit(): void {
    // console.log(this.mapService.featureLayer)

    this.variableSubscription = this.mapService.getMapCategories().subscribe((categories) => {
      
      console.log('CATEGORIES',categories);

      let variableArray = categories.flatMap((x) => x.mapVariables);
      
      this.mapService.getMapVariables(variableArray).subscribe((variables)=> {
        this.variables = variables;
      })
      console.log('VARIABLES',this.variables)
    });

    this.field1Filter = this.field1Control.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );

    this.field2Filter = this.field2Control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.mapModeSubscription = this.mapService.getMapMode().subscribe((mode)=> {
      if (mode == MapMode.bivariate) {
        this.checked = true;
      }
    });


  }

  private _filter(value: string): MapVariable[] {
      const filterValue = value.toLowerCase();
      // console.log(filterValue);
      return this.variables.filter(option => option.name.toString().toLowerCase().includes(filterValue));
    }

  onForm1Click(event:any) {
    this.field1Control.reset();
  }

  onForm2Click(event:any) {
    this.field2Control.reset();
  }

  onFieldChange(field: string, option:MapVariable) {
    const selectedVariable = option.censusVariable
    if (field == 'field1') {
      this.field1Variable = selectedVariable;
    } else if (field == 'field2') {
      this.field2Variable = selectedVariable;
    } 
  }

  onRunClick(event:any) {
    
    this.mapService.setMapMode(MapMode.bivariate);

    console.log(this.field1Variable);
    const params = {
      layer: this.mapService.featureLayer,
      view: this.mapService.mapView,
      field1: {
        field: this.field1Variable
      },
      field2: {
        field: this.field2Variable
      },
      focus: "HH", // changes orientation of the legend
      numClasses: 2 // 2x2 grid (value can also be 3 or 4)
    };
    
    // // That's it! Now apply the renderer to your layer
    
    relationshipRendererCreator.createRenderer(params).then((response) => {
      this.mapService.featureLayer.renderer = response.renderer;
    });
    
    
  } 
  
  onToggleChange(event:any) {
    
    if (event.checked) {
      this.mapService.setMapMode(MapMode.bivariate);
    } else {
      this.mapService.setMapMode(MapMode.default);
      this.mapService.featureLayer.renderer = this.mapService.defaultRenderer;
    }
    this.checked = event.checked;
  }
    
  isFormInvalid() {
    return (this.field1Control.invalid || this.field2Control.invalid);
  }
  }  

}
