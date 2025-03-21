import { MapType } from '../enums/map-type.enum';
import { Map } from '../models/map';

// test data
export const MAPS: Map[] = [
  {
    mapId: 1,
    name: 'Urban Institute Census Tracts',
    portalItem: {
      id: 'e5d0590d2280423a9e146a4fc0c16b01'
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
