import { MapType } from '../enums/map-type.enum';
import { Map } from '../models/map';

// test data
export const MAPS: Map[] = [
  {
    mapId: 1,
    name: 'Census Tracts',
    portalItem: {
      id: '0ad276b5a5af49cf8a73f08ce853eb60'
    },
    mapType: MapType.featureLayer,
    location_type: 'Census Tract'
  },
  {
    mapId: 2,
    name: 'Urban Institute Counties',
    portalItem: {
      id: '50874e607e434667bfb36d759756be6a'
    },
    mapType: MapType.featureLayer,
    location_type: 'County'
  },
  {
    mapId: 3,
    name: 'Urban Institute Cities',
    portalItem: {
      id: 'd0402268176741f987d78dd13b599904'
    },
    mapType: MapType.featureLayer,
    location_type: 'City'
  }
];
