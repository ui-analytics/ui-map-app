import {MapToolCategory} from '../enums/map-tool-category.enum';
import {MapToolInputType} from '../enums/map-tool-input-type.enum';

export interface MapTool {
  id: number;
  category: MapToolCategory;
  name: string;
  inputType: MapToolInputType;
  checked?: boolean;
  hasPanel?: boolean;
  togglePanel?: boolean;
  uncheck?: number[];
  matIcon?: string;
}

export interface MapToggle {
  Identify: boolean;
  Edit: boolean;
  Legend: boolean;
  Basemap: boolean;
  Share: boolean;
}

export interface MapPanelVisible {
  Identify: boolean;
  Search: boolean;
  Edit: boolean;
  Basemap: boolean;
  Share: boolean;
}
