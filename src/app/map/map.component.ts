
import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSliderComponent } from '../time-slider/time-slider.component';
import { SearchComponent } from '../search/search.component';
import { combineLatest, map } from 'rxjs';


import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import Home from '@arcgis/core/widgets/Home.js';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery.js';
import Expand from '@arcgis/core/widgets/Expand';
import classBreaks from '@arcgis/core/smartMapping/statistics/classBreaks.js';
import ColorVariable from '@arcgis/core/renderers/visualVariables/ColorVariable';

import { Subscription } from 'rxjs';

import { MapService } from '../services/map.service';
import { LayoutService } from '../services/layout.service';

import { Project } from '../shared/models/project';
import { MapType } from '../shared/enums/map-type.enum';
import { Map as ModelMap } from '../shared/models/map';
import { MapVariable } from '../shared/models/map-variable';
import { MapMode } from '../shared/enums/map-mode.enum';

import MapButtonWidget from '../shared/tools/map-button';
import { MAP_VARIABLE } from '../shared/mocks/mock-map-variable';

// chart.js
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule, 
    TimeSliderComponent, 
    SearchComponent
  ],         
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  public view: MapView | null = null;
  public map?: Map;

  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;
  // legend target inside the right drawer (phones/tablets)
  @ViewChild('legendHost', { static: false }) legendHost?: ElementRef<HTMLDivElement>;

  private variableSubscription: Subscription;
  private mapModeSubscription?: Subscription;
  private layoutSub?: Subscription;

  // small-screen UI state
  showSearch = false;
  showLegend = false;

  project?: Project;
  projectMaps: ModelMap[] = [];
  currentVariable: MapVariable = MAP_VARIABLE[0];
  mapMode: MapMode = MapMode.default;

get isCompact$() {
  return combineLatest([
    this.layout.isHandset$,
    this.layout.isTablet$
  ]).pipe(
    map(([h, t]) => !!(h || t))
  );
}

  constructor(
    private mapService: MapService,
    public layout: LayoutService
  ) {
    this.variableSubscription = this.mapService.getCurrentVariable().subscribe(() => {});
  }

  /* ---------- Custom popup (kept from your version) ---------- */
  private getPercentileSeries(tractId: string, variableKey: string) {
    const years  = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
    const seed   = parseInt((tractId || '').slice(-3), 10) || 50;
    const tract  = years.map((_, i) => Math.max(1, Math.min(99, (seed + i * 2) % 100)));
    const county = years.map((_, i) => 55 + ((i % 3) - 1) * 4);
    const region = years.map((_, i) => 60 + ((i % 4) - 2) * 5);
    return { years, tract, county, region };
  }

  private buildTractPopupTemplate(): any {
    return {
      title: (feature: any) => {
        const a = feature.graphic.attributes as any;
        const tractName  = a.NAMELSAD || a.NAME || 'Census Tract';
        const countyName = a.COUNTY_NAME || a.COUNTY || 'County';
        return `${tractName} — ${countyName}`;
      },
      content: (feature: any) => {
        const g = feature.graphic as any;
        const a = g.attributes as any;
        const tractId = String(a.GEOID ?? a.TRACTCE ?? a.TRACT_ID ?? '');
        const variableKey = this.currentVariable?.fieldName || 'variable';

        const host = document.createElement('div');
        host.style.width = '360px';
        host.style.maxWidth = '100%';
        host.style.minHeight = '180px';

        const canvas = document.createElement('canvas');
        canvas.height = 160;
        host.appendChild(canvas);

        const { years, tract, county, region } =
          this.getPercentileSeries(tractId, variableKey);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          const chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: years.map(String),
              datasets: [
                { label: 'Tract',  data: tract,  borderWidth: 2, pointRadius: 2, tension: 0.2 },
                { label: 'County', data: county, borderWidth: 2, pointRadius: 2, tension: 0.2 },
                { label: 'Region', data: region, borderWidth: 2, pointRadius: 2, tension: 0.2 }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { min: 0, max: 100, title: { display: true, text: 'Percentile' } },
                x: { title: { display: true, text: 'Year' } }
              },
              plugins: { legend: { position: 'bottom' } },
              elements: { point: { radius: 2 } }
            }
          });
          (g as any).__popupChart = chart;
        }

        return host;
      }
    };
  }

  /* ---------- Legend placement helpers ---------- */
  private mountLegendDesktop() {
    // put the Legend back into the ArcGIS UI (bottom-right)
    this.mapService.legend.container = null as any;
    this.mapService.mapView.ui.remove(this.mapService.legend as any);
    this.mapService.mapView.ui.add(this.mapService.legend, 'bottom-right');
  }
  private mountLegendMobile() {
    // move Legend into the right drawer host
    this.mapService.mapView.ui.remove(this.mapService.legend as any);
    if (this.legendHost?.nativeElement) {
      this.mapService.legend.container = this.legendHost.nativeElement;
    }
  }

  toggleSearch() { this.showSearch = !this.showSearch; }
  toggleLegend() {
    this.showLegend = !this.showLegend;
    if (this.showLegend) this.mountLegendMobile();
  }
  closeOverlays() { this.showLegend = this.showSearch = false; }

  /* ---------- Map init ---------- */
  async initializeMap(): Promise<void> {
    const container = this.mapViewEl.nativeElement;

    this.project = this.mapService.project;

    this.mapService.esriMap = new Map({ basemap: this.project.basemap });

    this.mapService.getMaps().subscribe((projectMaps) => {
      projectMaps.forEach(m => {
        if (m.mapType === MapType.featureLayer) {
          const mapId = m.mapId;
          const projectMapConfig =
            this.project?.maps.filter((p) => p.mapId === mapId).reduce((_, it) => it, {} as any);

          const { opacity, visible, variableControlled, popupEnabled } = projectMapConfig;

          const fl: FeatureLayer = new FeatureLayer({
            portalItem: m.portalItem,
            opacity,
            visible,
            title: m.name,
            popupEnabled
          });

          if (variableControlled) {
            fl.outFields = ['*'];
            fl.popupTemplate = this.buildTractPopupTemplate();
            this.mapService.variableFL = fl;
          }

          m.mapObject = fl;
          this.mapService.esriMap.add(fl);
        }
      });

      this.projectMaps = projectMaps;
      this.mapService.updateMaps(this.projectMaps);
    });

    this.mapService.mapView = new MapView({
      container,
      map: this.mapService.esriMap,
      center: this.project.center,
      zoom: this.project.zoom,
      constraints: { minZoom: this.project.zoom - 1 }
    });
    this.view = this.mapService.mapView;

    const homeWidget = new Home({ view: this.mapService.mapView });
    this.mapService.mapView.ui.add(homeWidget, 'top-left');

    // Legend configured; we place it depending on screen size
    this.mapService.legend.view = this.mapService.mapView;
    this.mapService.legend.layerInfos = [{ layer: this.mapService.variableFL }];

    const basemapGallery = new BasemapGallery({ view: this.mapService.mapView });
    const expand = new Expand({
      view: this.mapService.mapView,
      content: basemapGallery,
      icon: 'esri-icon-basemap',
      expandTooltip: 'Show Basemap'
    });
    this.mapService.mapView.ui.add(expand, 'top-left');

    this.mapService.mapView.when(() => {
      this.mapService.esriMap.add(this.mapService.graphicsLayer);

      const clearWidget = new MapButtonWidget({
        iconClass: 'esri-icon-close-circled',
        label: 'Clear selected location',
        name: 'clear_features',
        onClick: () => this.mapService.clearSelectedFeatures()
      });
      this.mapService.mapView.ui.add(clearWidget, 'top-left');

      const zoomSelectedFeaturesWidget = new MapButtonWidget({
        iconClass: 'esri-icon-zoom-in-magnifying-glass',
        label: 'Zoom to selected location',
        name: 'zoom_feature',
        onClick: () => this.mapService.zoomSelectedFeature()
      });
      this.mapService.mapView.ui.add(zoomSelectedFeaturesWidget, 'top-left');

      const toggleMapVisibleWidget = new MapButtonWidget({
        iconClass: 'esri-icon-hollow-eye',
        label: 'Toggle map visiblity',
        name: 'toggle_map',
        onClick: () => this.mapService.toggleMapVisibility()
      });
      this.mapService.mapView.ui.add(toggleMapVisibleWidget, 'top-left');

      const userGuideWidget = new MapButtonWidget({
        iconClass: 'esri-icon-documentation',
        label: 'Goto User Guide',
        name: 'user-guide',
        onClick: () => window.open('https://regionalexplorerguide.netlify.app', '_blank')
      });
      this.mapService.mapView.ui.add(userGuideWidget, 'top-left');

      // popup chart cleanup
      this.mapService.mapView.popup.watch('visible', (v: boolean) => {
        if (!v) {
          const f: any = this.mapService.mapView.popup.selectedFeature;
          if (f?.__popupChart) { f.__popupChart.destroy(); delete f.__popupChart; }
        }
      });
      this.mapService.mapView.popup.watch('selectedFeature', (newF: any, oldF: any) => {
        if (oldF?.__popupChart) { oldF.__popupChart.destroy(); delete oldF.__popupChart; }
      });
    });

    // place legend according to screen size
    this.layoutSub = this.layout.isDesktop$.subscribe((isDesktop) => {
      if (isDesktop) {
        this.showLegend = false;
        this.mountLegendDesktop();
      } else {
        // keep legend out of map UI; mount into drawer when 📊 is tapped
        this.mapService.mapView.ui.remove(this.mapService.legend as any);
      }
    });
  }

  /* ---------- Lifecycle ---------- */
  ngOnInit(): void {
    this.initializeMap().then(() => {
      this.mapModeSubscription = this.mapService.getMapMode().subscribe((mode) => {
        this.mapMode = mode;
        const fieldName = (this.mapMode === MapMode.autocorrelation)
          ? this.currentVariable.moransField
          : this.currentVariable.fieldName;
        this.mapService.renderVariable(this.currentVariable, fieldName, this.mapMode);
      });

      this.mapService.getCurrentVariable().subscribe((value) => {
        this.currentVariable = value;
        const f = (this.mapMode === MapMode.autocorrelation)
          ? this.currentVariable.moransField
          : this.currentVariable.fieldName;
        this.mapService.renderVariable(this.currentVariable, f, this.mapMode);
      });
    });
  }

  ngOnDestroy(): void {
    this.mapModeSubscription?.unsubscribe();
    this.variableSubscription?.unsubscribe();
    this.layoutSub?.unsubscribe();
    this.mapService.mapView?.destroy();
  }
}
