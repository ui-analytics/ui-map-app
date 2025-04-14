import { MapType } from '../enums/map-type.enum';
import { Map } from '../models/map';

// test data
export const MAPS: Map[] = [
  {
    mapId: 1,
    name: 'Census Tracts',
    portalItem: {
      id: '00f3e63f75e64f3a8e151f4c6dcd6cdd'
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
