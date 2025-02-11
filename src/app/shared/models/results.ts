import {Observable, of} from "rxjs";

export interface Results {
  'identify': Result[],
  'search': Result[]
}

export interface Result {
  mapName: string,
  result: any
}

export function initResults(): Results {
  return  {
    'identify': [],
    'search': []
  }
}
