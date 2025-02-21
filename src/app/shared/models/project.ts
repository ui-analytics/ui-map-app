import {MapToolCategory} from '../enums/map-tool-category.enum';

export interface Project {
  projectId: number;
  basemap: any;
  center: number[];
  zoom: number;
  name: string;
  maps: number[];
  editMaps?: number[];
  mapTools: MapToolCategory[];
  mapCategories: number[];
  basemapGallery?: any;
}
