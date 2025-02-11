import {MapPanelVisible, MapToggle, MapTool} from '../models/map-tool';
import {MapToolCategory} from '../enums/map-tool-category.enum';
import {MapToolInputType} from '../enums/map-tool-input-type.enum';

export const MAP_TOOL: MapTool[] = [
  {
    id: 1,
    category: MapToolCategory.base,
    name: 'Identify',
    inputType: MapToolInputType.toggleButton,
    checked: true,
    hasPanel: true,
    togglePanel: false,
    matIcon: 'info'
  }, {
    id: 2,
    category: MapToolCategory.edit,
    name: 'Edit',
    inputType: MapToolInputType.toggleButton,
    checked: false,
    hasPanel: true,
    togglePanel: true,
    uncheck: [1],
    matIcon: 'edit'
  }/*, {
    id: 3,
    category: MapToolCategory.base,
    name: 'Legend',
    inputType: MapToolInputType.toggleButton,
    checked: false,
    matIcon: 'format_list_bulleted'
  }*/,
  {
    id: 6,
    category: MapToolCategory.base,
    name: 'Basemap',
    inputType: MapToolInputType.toggleButton,
    matIcon: 'dashboard',
    hasPanel: true,
    togglePanel: true
  },
  {
    id: 4,
    category: MapToolCategory.base,
    name: 'Search',
    inputType: MapToolInputType.textBox,
    matIcon: 'close'
  },
  {
    id: 7,
    category: MapToolCategory.base,
    name: 'Share',
    inputType: MapToolInputType.toggleButton,
    matIcon: 'share',
    hasPanel: true,
    togglePanel: true
  }
];

export const MAP_TOGGLE: MapToggle = {
  Identify: true,
  Edit: false,
  Legend: false,
  Basemap: false,
  Share: false,
};

export const MAP_PANEL_VISIBLE: MapPanelVisible = {
  Identify: false,
  Edit: false,
  Search: false,
  Basemap: false,
  Share: false,
};
