import {MapLayer} from './map-layer';

export interface MapViewInfo {
  mapName: string;
  mapUrl: string;
  mapType?: string;
  legend?: {};
  visible: boolean;
  layers: MapLayer[];
}
