// If featureLayer is true the layer must have SHAPE field enabled
export interface MapLayer {
  mapUrl?: string;
  mapName?: string;
  layerName: string;
  layerId: number;
  visible: boolean;
  image?: string;
  element?: any;
  parentId?: number;
  sublayers?: MapLayer[];
  extent?: any;
  featureLayer?: boolean;
  featureLayerInfo?: any;
}
