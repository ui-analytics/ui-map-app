import { Injectable } from '@angular/core';
import {from, Observable, Observer, of, BehaviorSubject} from 'rxjs';

import {Project} from '../shared/models/project';
import {PROJECT} from '../shared/mocks/mock-project';

import {MapCategory} from '../shared/models/map-category'
import {MAP_CATEGORY} from '../shared/mocks/mock-map-category';

import {MapVariable} from '../shared/models/map-variable'
import {MAP_VARIABLE} from '../shared/mocks/mock-map-variable';

import {Extent} from '../shared/models/extent'
import {EXTENT} from '../shared/mocks/mock-extent';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import ColorVariable from "@arcgis/core/renderers/visualVariables/ColorVariable.js";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  project!: Project;
  mapCategories: MapCategory[] = [];
  mapVariables: MapVariable[] = [];
  extents: Extent[] = EXTENT;
  map!: Map;
  mapView!: MapView;

  // selectedCategory!: MapCategory;
  // selectedVariable!: MapVariable;
  colorVariable: ColorVariable = new ColorVariable({
    normalizationField: 'mfagetote',
    stops: [
      {
        value: .01, 
        color: "#eefae3", 
        label: "1% or lower"
      },
      {
        value: .04, 
        color: "#bae4bc", 
        label: "4% or higher" 
      },
      {
        value: .08, 
        color: "#7bccc4", 
        label: "8% or higher" 
      },
      {
        value: .12, 
        color: "#43a2ca", 
        label: "12% or higher" 
      },
      {
        value: .16, 
        color: "#0868ac", 
        label: "16% or higher"
      }
    ]
  });

  defaultRenderer = new SimpleRenderer({
      symbol: new SimpleFillSymbol({
        color: [ 51,51, 204, 0.9 ],
        style: "solid",
        outline: {
          color: [0,0,0, 0.2],
          width: "2px"
        }
      }),
      visualVariables: [this.colorVariable]
    })

  featureLayer: FeatureLayer = new FeatureLayer({
    portalItem: {
      id: 'b7a386ae3c8b404bb856631f936a1e04'
    },
    // definitionExpression:'year = 2021',
    opacity: 1,
    renderer: this.defaultRenderer
  });

  private currentCategory = new BehaviorSubject<MapCategory>(MAP_CATEGORY[0]);
  private currentVariable = new BehaviorSubject<MapVariable>(MAP_VARIABLE[0]);
  private isSidenavOpen = new BehaviorSubject<boolean>(false);
  private mapMode = new BehaviorSubject<MapMode>(MapMode.default);

  constructor() { }

  getProjectById(id: number): Observable<Project> {
    return of(PROJECT.filter((project) => project.projectId === id).reduce((acc: any, it) => it, { }));
  }

  getMapCategories(): Observable<MapCategory[]> {
    return of(MAP_CATEGORY.filter( mc => this.project?.mapCategories.includes(mc.categoryId)));
  }

  getMapVariables(mapVariables:Number[]): Observable<MapVariable[]> {
    return of(MAP_VARIABLE.filter( mv => mapVariables.includes(mv.variableId)));
  }

  getCurrentCategory(): Observable<MapCategory> {
    return this.currentCategory.asObservable();
  }

  updateCurrentCategory(newCategory:MapCategory) {
    this.currentCategory.next(newCategory)
  }

  getCurrentVariable(): Observable<MapVariable> {
    return this.currentVariable.asObservable();
  }

  updateCurrentVariable(newVariable:MapVariable) {
    this.currentVariable.next(newVariable)
  }

  getSidenavOpen() {
    return this.isSidenavOpen.asObservable();
  }

  setSidenavOpen(state:boolean) {
    return this.isSidenavOpen.next(state);
  }

  getMapMode() {
    return this.mapMode.asObservable();
  }

  setMapMode(mode:MapMode) {
    return this.mapMode.next(mode);
  }

  getExtents() {
    return of(this.extents);
  }
  
}
