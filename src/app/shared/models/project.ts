import {MapToolCategory} from '../enums/map-tool-category.enum';

export interface Project {
  projectId: number;
  basemap: any;
  center: number[];
  zoom: number;
  name: string;
  maps: any[];
  editMaps?: number[];
  mapTools: MapToolCategory[];
  mapCategories: number[];
  basemapGallery?: any;
}
