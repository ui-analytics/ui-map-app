import { MapType } from '../enums/map-type.enum';
import { Map } from '../models/map';

// test data
export const MAPS: Map[] = [
  {
    mapId: 1,
    name: 'Urban Institute Census Tracts',
    portalItem: {
      id: 'b7a386ae3c8b404bb856631f936a1e04'
    },
    mapType: MapType.featureLayer
  },
  {
    mapId: 2,
    name: 'Urban Institute Couties',
    portalItem: {
      id: '50874e607e434667bfb36d759756be6a'
    },
    mapType: MapType.featureLayer
  },
  {
    mapId: 3,
    name: 'Urban Institute Places',
    portalItem: {
      id: 'd0402268176741f987d78dd13b599904'
    },
    mapType: MapType.featureLayer
  }
];
