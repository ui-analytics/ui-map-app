import { Component, OnInit } from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
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

  constructor(private mapService: MapService) {}

  field1Control = new FormControl('');
  field1Filter?: Observable<MapVariable[]>;

  field2Control = new FormControl('');
  field2Filter?: Observable<MapVariable[]>;

  variables: MapVariable[] = [];

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

  onSelectionChange(event: MatOptionSelectionChange, option:MapVariable) {
    // console.log('selected:',option);
    
  }

  onRunClick(event:any) {
    // console.log(event);
  }  

}
