import {Project} from '../models/project';
import {MapToolCategory} from '../enums/map-tool-category.enum';

export const PROJECT: Project[] = [{
    projectId: 1,
    name: 'Regional Explorer',
    basemap: 'dark-gray',
    center: [-80.7366, 35.3081],
    zoom: 8,
    maps: [
      {
        mapId:1,
        opacity: .85,
        visible: true,
        variableControlled: true,
        popupEnabled: true
      },
      {
        mapId:2,
        visible: true,
        popupEnabled: false
      },
      {
        mapId:3,
        visible: false,
        popupEnabled: false
      }
    ],
    mapTools: [MapToolCategory.base],
    mapCategories: [1,2,3,4,5,6,7,8,9]
  }];