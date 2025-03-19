import {Project} from '../models/project';
import {MapToolCategory} from '../enums/map-tool-category.enum';
import Basemap from "@arcgis/core/Basemap.js";

export const PROJECT: Project[] = [{
    projectId: 1,
    name: 'Regional Explorer',
    // basemap: 'dark-gray',
    basemap: new Basemap({
      portalItem: {
        id: "f35ef07c9ed24020aadd65c8a65d3754",
        url: "https://www.arcgis.com"
      },
      title: "Modern Antique Map",
      thumbnailUrl: "https://static-map-tiles-api.arcgis.com/arcgis/rest/services/static-basemap-tiles-service/v1/arcgis/navigation/tile/{Z}/{X}/{Y}.png"
    }),
    center: [-80.7366, 35.3081],
    zoom: 9,
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