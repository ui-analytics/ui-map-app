import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import {MatSlideToggle} from '@angular/material/slide-toggle';

import WebMap from '@arcgis/core/WebMap';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

import { ToolbarComponent } from "../toolbar/toolbar.component";
import { MapService } from '../services/map.service'

import { Subscription } from 'rxjs';
import { Project } from '../shared/models/project';

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

  project?:Project;

  constructor(private mapService: MapService) {
    this.variableSubscription = this.mapService.getCurrentVariable().subscribe((value) => {
      this.mapService.colorVariable.field = value.censusVariable;
    });
  }

  async initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;

    
    this.project = this.mapService.project;
    

    this.map = new Map({
      basemap: this.project.basemap
    })


    this.map.add(this.mapService.featureLayer);

    this.view = new MapView({
      container,
      map: this.map,
      center: this.project.center,
      zoom: this.project.zoom,
    });

    return this.view.when()

  }

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