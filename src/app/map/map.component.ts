import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Home from "@arcgis/core/widgets/Home.js";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";
import classBreaks from "@arcgis/core/smartMapping/statistics/classBreaks.js";
import ColorVariable from '@arcgis/core/renderers/visualVariables/ColorVariable';
import Expand from '@arcgis/core/widgets/Expand';

import { MapService } from '../services/map.service'

import { Subscription } from 'rxjs';

import { Project } from '../shared/models/project';
import { MapType } from '../shared/enums/map-type.enum';
import {Map as ModelMap} from '../shared/models/map'
import { MapVariable } from '../shared/models/map-variable';
import { MapMode } from '../shared/enums/map-mode.enum';

import MapButtonWidget from '../shared/tools/map-button';
import { MAP_VARIABLE } from '../shared/mocks/mock-map-variable';


@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, OnDestroy {
  public view: any = null;
  public map?: Map;

  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  private variableSubscription:Subscription;
  private mapModeSubscription?:Subscription;

  project?:Project;
  projectMaps: ModelMap[] = [];
  currentVariable: MapVariable = MAP_VARIABLE[0];
  mapMode:MapMode = MapMode.default;
  

  constructor(private mapService: MapService) {

    this.variableSubscription = this.mapService.getCurrentVariable().subscribe((value) => {});
  }

  async initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;

    
    this.project = this.mapService.project;
    // console.log('PROJECT',this.project)
    

    this.mapService.esriMap = new Map({
      basemap: this.project.basemap
    })

    
    this.mapService.getMaps().subscribe((projectMaps) => {
      
      projectMaps.forEach(m => {
        if (m.mapType == MapType.featureLayer) {
          const mapId = m.mapId

          const projectMapConfig = 
          this.project?.maps.filter((p) => p.mapId == mapId).reduce((acc: any, it) => it, { });

          const {opacity, visible, variableControlled, popupEnabled} = projectMapConfig

          const fl: FeatureLayer = new FeatureLayer({
            portalItem: m.portalItem,
            opacity,
            visible,
            title:m.name,
            popupEnabled
          });

          if (variableControlled) {
            this.mapService.variableFL = fl 
          }
          
          m.mapObject = fl
          this.mapService.esriMap.add(fl);
        }
      })

      this.projectMaps = projectMaps;
      this.mapService.updateMaps(this.projectMaps);
    })

    
    this.mapService.mapView = new MapView({
          container,
          map: this.mapService.esriMap,
          center: this.project.center,
          zoom: this.project.zoom,
          constraints:{minZoom:this.project.zoom-1}
        });

    let homeWidget =  new Home({
      view: this.mapService.mapView
    });  

    this.mapService.mapView.ui.add(homeWidget,'top-left')
    
    this.mapService.legend.view = this.mapService.mapView;
    this.mapService.legend.layerInfos = [{layer:this.mapService.variableFL}]
    this.mapService.mapView.ui.add(this.mapService.legend, "bottom-right");

    let basemapGallery = new BasemapGallery({
      view: this.mapService.mapView
    });

    const expand = new Expand({
      view: this.mapService.mapView,
      content: basemapGallery,
      icon: 'esri-icon-basemap',
      expandTooltip:'Show Basemap'
    });

    this.mapService.mapView.ui.add(expand, 'top-left');

    this.mapService.mapView.when(() => {

      this.mapService.esriMap.add(this.mapService.graphicsLayer);

      const clearWidget = new MapButtonWidget({
        iconClass:'esri-icon-close-circled',
        label:'Clear selected location',
        name:'clear_features',
        onClick: () => {
          this.mapService.clearSelectedFeatures();
        }});
      this.mapService.mapView.ui.add(clearWidget,'top-left');

      const zoomSelectedFeaturesWidget = new MapButtonWidget({
        iconClass:'esri-icon-zoom-in-magnifying-glass',
        label:'Zoom to selected location',
        name:'zoom_feature',
        onClick: () => {
          this.mapService.zoomSelectedFeature();
        }});
      this.mapService.mapView.ui.add(zoomSelectedFeaturesWidget,'top-left');


      const toggleMapVisibleWidget = new MapButtonWidget({
        iconClass:'esri-icon-hollow-eye',
        label:'Toggle map visiblity',
        name:'toggle_map',
        onClick: () => {
          this.mapService.toggleMapVisibility();
        }});
      this.mapService.mapView.ui.add(toggleMapVisibleWidget,'top-left');
    })
    

  }


  ngOnInit(): any {
    this.initializeMap().then(r => {
      let fieldName:string;

      this.mapModeSubscription = this.mapService.getMapMode().subscribe((mode)=> {
        this.mapMode = mode
        // console.log('MAP MODE:',this.mapMode);
        if (this.mapMode == MapMode.autocorrelation) {
          fieldName = this.currentVariable?.moransField
        } else {
          fieldName = this.currentVariable?.fieldName
          
        }
        this.mapService.renderVariable(this.currentVariable,fieldName,this.mapMode);


        
      });

      this.mapService.getCurrentVariable().subscribe((value) => {
        let fieldName:string;
        this.currentVariable = value;
        // console.log(this.currentVariable);
        let autoCorrelationVariable:MapVariable;
        if (this.mapMode == MapMode.autocorrelation) {
          fieldName = this.currentVariable?.moransField
        } else {
          fieldName = this.currentVariable?.fieldName
        }

        this.mapService.renderVariable(this.currentVariable,fieldName,this.mapMode);

        
        
      })
      return r;
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }

  // renderVariable() {
  //   console.log('FIELD_NAME:', this.currentVariable?.fieldName);
        
        
  //       classBreaks({
  //         layer: this.mapService.variableFL,
  //         field: this.currentVariable?.fieldName,
  //         classificationMethod: 'natural-breaks',
  //         numClasses:5
  //       }).then(res => {
  //         let breaks = res.classBreakInfos.map((info, i) => ({
  //           value: info.maxValue,
  //           label: info.label,
  //           color: this.mapService.defaultColors[i]
  //         }))

  //         breaks = breaks.map(x => this.mapService.roundBreakLabel(x));    
           
  //         if (this.currentVariable?.valueType === 'percentage') {
  //           breaks = breaks.map(x => this.mapService.addPercentSymbolToBreaks(x));    
  //         }

  //         const colorVariable = new ColorVariable({
  //           field: this.currentVariable?.fieldName,
  //           stops: breaks
  //         })

  //         this.mapService.getMapMode().subscribe((mode)=> {
  //               if (mode == MapMode.default) {
  //                 this.mapService.defaultRenderer.visualVariables = [colorVariable];
  //                 this.mapService.variableFL.renderer = this.mapService.defaultRenderer;
  //                 this.mapService.legend.layerInfos = [{layer:this.mapService.variableFL}]
  //               }
  //             });
  //       })
  // }
}