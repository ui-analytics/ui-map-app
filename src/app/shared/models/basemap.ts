export interface BasemapObject {
  'Imagery': string;
  'Imagery Hybrid': string;
  'Streets': string;
  'Topographic': string;
  'Navigation': string;
  'Streets (Night)': string;
  'Terrain with Labels': string;
  'Light Gray Canvas': string;
  'Dark Gray Canvas': string;
  'Oceans': string;
  'National Geographic Style Map': string;
  'OpenStreetMap': string;
  'Charted Territory Map': string;
  'Community Map': string;
  'Navigation (Dark Mode)': string;
  'Newspaper Map': string;
  'Modern Antique Map': string;
  'Mid-Century Map': string;
  'Nova Map,': string;
  'Colored Pencil Map': string;

}

export function initBasemaps(): BasemapObject {
  return {
    'Imagery': 'arcgis-imagery-standard' ,
    'Imagery Hybrid':'arcgis-imagery',
    'Streets': 'arcgis-streets',
    'Topographic': 'arcgis-topographic',
    'Navigation': 'arcgis-navigation',
    'Streets (Night)': 'arcgis-streets-night',
    'Terrain with Labels': 'arcgis-terrain',
    'Light Gray Canvas': 'arcgis-light-gray',
    'Dark Gray Canvas': 'arcgis-dark-gray',
    'Oceans': 'arcgis-oceans',
    'National Geographic Style Map': 'national-geographic',
    'OpenStreetMap': 'osm',
    'Charted Territory Map': 'arcgis-charted-territory',
    'Community Map': 'arcgis-community',
    'Navigation (Dark Mode)': 'arcgis-navigation-night',
    'Newspaper Map': 'arcgis-newspaper',
    'Modern Antique Map': 'arcgis-modern-antique',
    'Mid-Century Map': 'arcgis-midcentury',
    'Nova Map,': 'arcgis-nova',
    'Colored Pencil Map': 'arcgis-colored-pencil',
  }
}
