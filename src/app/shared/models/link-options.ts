import {Results} from "./results";

export interface LinkOptions {
  blnd: string;
  ctr: string;
  nav: string;
  navFlt: string;
  z: string;
  bsmp: any;
  visLyrs: string;
  pop?: string;
}


export function initLinkOptions(ctr:any[], zoom:any): LinkOptions {
  return  {
    'blnd': 't',
    'ctr': `${ctr[0]},${ctr[1]}`,
    'nav': 'PlDbs',
    'navFlt': '',
    'z':zoom,
    'bsmp':'',
    'visLyrs':''
  }
}
