import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import {MatSlideToggle} from '@angular/material/slide-toggle';

import WebMap from '@arcgis/core/WebMap';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import Color from "@arcgis/core/Color.js";
import VisualVariable from "@arcgis/core/renderers/visualVariables/VisualVariable.js";
import ColorVariable from "@arcgis/core/renderers/visualVariables/ColorVariable.js";

import { ToolbarComponent } from "../toolbar/toolbar.component";
import { MapService } from '../services/map.service'
import { MapVariable } from '../shared/models/map-variable';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  imports: [ToolbarComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, OnDestroy {
  public view: any = null;
  public map?: Map;
  public censusTractsFL?: FeatureLayer;
  public censusDataFl?: FeatureLayer;

  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  private variableSubscription:Subscription;

  constructor(private mapService: MapService) {
    this.variableSubscription = this.mapService.getCurrentVariable().subscribe((value) => {
      console.log('current variable is:',value)
      this.mapService.colorVariable.field = value.censusVariable;
    });
  }

  async initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;

    this.map = new Map({
      basemap: 'dark-gray-3d'
    })


    this.map.add(this.mapService.featureLayer);

    this.view = new MapView({
      container,
      map: this.map,
      center: [-80.7366, 35.3081],
      zoom: 8,
    });

    return this.view.when()

  }

  // updateFeatureLayer(field:string) {
  //   this.censusTractsFL.renderer = new SimpleRenderer({
  //     symbol: new SimpleFillSymbol({
  //       color: [ 51,51, 204, 0.9 ],
  //       style: "solid",
  //       outline: {
  //         color: [0,0,0, 0.2],
  //         width: "2px"
  //       }
  //     }),
  //     visualVariables: [new ColorVariable({
  //       field: field,
  //       normalizationField: 'mfagetote',
  //       stops: [
  //         {
  //           value: .01, 
  //           color: "#F4D5C1", 
  //           label: "1% or lower"
  //         },
  //         {
  //           value: .04, 
  //           color: "#BC5539", 
  //           label: "4% or higher" 
  //         },
  //         {
  //           value: .16, 
  //           color: "#7A1C13", 
  //           label: "16% or higher"
  //         }
  //       ]
  //     })]
  //   })
  // }

  ngOnInit(): any {
    this.initializeMap().then(r => {
      return r;
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }
}