import { Map } from '../models/map';

// test data
export const MAPS: Map[] = [
  {
    mapId: 4,
    name: 'Campus Map',
    url: 'https://openmaps.uncc.edu/opengis/rest/services/AllCampusNew/MapServer',
    mapType: 'dynamic',
    featureLayers: {
      408: 'https://openmaps.uncc.edu/opengis/rest/services/AllCampusScooter/FeatureServer/408',
    }
  }
];
