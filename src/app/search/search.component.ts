import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionSelectionChange } from '@angular/material/core';

import { Extent } from '../shared/models/extent';
import { MapService } from '../services/map.service';

import { Extent as EsriExtent } from '@arcgis/core/geometry';
import Query from '@arcgis/core/rest/support/Query.js';
import Graphic from '@arcgis/core/Graphic.js';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol.js';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterViewInit {
  constructor(private mapService: MapService) {}

  searchControl = new FormControl<string>('');
  filteredOptions?: Observable<Extent[]>;
  extents: Extent[] = [];
  @ViewChild('searchbox') inputElement!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.mapService.getExtents().subscribe((extents) => {
      this.extents = extents;
    });

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || '')),
    );
  }

  ngAfterViewInit() {
    // focus if you want:
    // this.inputElement?.nativeElement?.focus();
  }

  private filter(value: string): Extent[] {
    const q = value.toLowerCase();
    return this.extents.filter(opt => opt.name.toString().toLowerCase().includes(q));
  }

  onSelectionChange(event: MatOptionSelectionChange, option: Extent) {
    // outline the selected area
    this.mapService.graphicsLayer.removeAll();

    this.mapService.projectMaps?.subscribe((maps) => {
      const locationType = maps
        .filter(x => x.location_type === option.location_type)
        .reduce((acc: any, it) => it, {});

      if (locationType) {
        const query = new Query();
        query.where = `crdt_unique_id = '${option.crdt_unique_id}'`;
        query.returnGeometry = true;

        locationType.mapObject.queryFeatures(query)
          .then((results: any) => {
            const graphics = results.features.map((f: any) =>
              new Graphic({
                geometry: f.geometry,
                attributes: f.attributes,
                symbol: new SimpleFillSymbol({
                  color: [0, 0, 255, 0],
                  outline: { color: [252, 65, 3, 1], width: 3 }
                })
              })
            );
            this.mapService.graphicsLayer.addMany(graphics);
          })
          .catch((err: any) => console.error('query failed', err));
      }
    });

    const extent = new EsriExtent({
      xmin: option.xmin,
      ymin: option.ymin,
      xmax: option.xmax,
      ymax: option.ymax,
      spatialReference: { wkid: option.wkid }
    });

    this.mapService.mapView.goTo(extent);
  }

  onFormClick() {
    this.searchControl.reset();
  }
}
