import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Home from "@arcgis/core/widgets/Home.js";

import { MapService } from '../services/map.service'

import { Subscription } from 'rxjs';
import { Project } from '../shared/models/project';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, OnDestroy {
  public view: any = null;
  public map?: Map;
  public censusTractsFL?: FeatureLayer;
  public censusDataFl?: FeatureLayer;
  
  homeWidget: Home = new Home({view:undefined}); 

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
    

    // this.map = new Map({
    //   basemap: this.project.basemap
    // });

    this.mapService.map = new Map({
      basemap: this.project.basemap
    })


    this.mapService.map.add(this.mapService.featureLayer);

    // this.view = new MapView({
    //   container,
    //   map: this.mapService.map,
    //   center: this.project.center,
    //   zoom: this.project.zoom,
    // });

    this.mapService.mapView = new MapView({
          container,
          map: this.mapService.map,
          center: this.project.center,
          zoom: this.project.zoom,
        });

    this.homeWidget.view = this.mapService.mapView;

    this.mapService.mapView.ui.add(this.homeWidget,'top-left')
      

    // return this.view.when()

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