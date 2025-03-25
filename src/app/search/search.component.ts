import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Extent } from '../shared/models/extent';
import { MapService } from '../services/map.service';
import { MatOptionSelectionChange } from '@angular/material/core';

import { Extent as EsriExtent } from "@arcgis/core/geometry";
import Query from "@arcgis/core/rest/support/Query.js";
import Graphic from "@arcgis/core/Graphic.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import ColorVariable from "@arcgis/core/renderers/visualVariables/ColorVariable.js";

@Component({
  selector: 'app-search',
  imports: [FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, AfterViewInit  {
  constructor(private mapService: MapService) { }

  searchControl = new FormControl('');
  filteredOptions?: Observable<Extent[]>;
  extents: Extent[] = [];
  @ViewChild('searchbox') inputElement!: ElementRef;

  ngOnInit() {
    this.mapService.getExtents().subscribe((extents) => {
      this.extents = extents
      // console.log('EXTENTS',this.extents);
    })

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  ngAfterViewInit() {
    // this.inputElement.nativeElement.focus();
  }

  private _filter(value: string): Extent[] {
    const filterValue = value.toLowerCase();
    const filtered = this.extents.filter(option => option.name.toString().toLowerCase().includes(filterValue));

    return filtered;
  }

  onSelectionChange(event: MatOptionSelectionChange, option:Extent) {
    
    this.mapService.graphicsLayer.removeAll()
    
    this.mapService.projectMaps?.subscribe((m) =>{
      const locationType = m.filter(x => x.location_type == option.location_type).reduce((acc: any, it) => it, { });

      // console.log('LocationType:',locationType);

      if (locationType) {
        const query = new Query();
        query.where = `crdt_unique_id = '${option.crdt_unique_id}'`;
        // query.outSpatialReference = { wkid: option.wkid };
        query.returnGeometry = true;
    
        locationType.mapObject.queryFeatures(query).then((results:any) => {
          
          const graphics = results.features.map((feature:any) => {
            return new Graphic({
              geometry: feature.geometry,
              attributes: feature.attributes,
              symbol: new SimpleFillSymbol({
                color: [0, 0, 255, 0],
                outline: {
                  color: [252, 65, 3, 1],
                  width: 3
                }
              })
            })
          })
    
          this.mapService.graphicsLayer.addMany(graphics);
          
        }).catch((error:any)=> console.error('failed',error));

      }
    });

    let extent = new EsriExtent({
      xmin: option.xmin,
      ymin: option.ymin,
      xmax: option.xmax,
      ymax: option.ymax,
      spatialReference: {wkid: option.wkid}
    })

    this.mapService.mapView.goTo(extent);
  }

  onFormClick(event:any) {
    this.searchControl.reset();
  }

}
