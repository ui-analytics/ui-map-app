export interface ScooterStation {
  station_id: string;
  is_installed?: boolean;
  is_renting?: boolean;
  last_reported: number;
  num_bikes_available: number;
  num_docks_available: number;
}

export function initScooterStations(): ScooterStation[] {
  return  [{
    station_id: '',
    last_reported: 0,
    num_bikes_available: 0,
    num_docks_available: 0
  }]
}
