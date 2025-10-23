import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  // declare the streams first
  readonly isHandset$;
  readonly isTablet$;
  readonly isDesktop$;

  constructor(private bo: BreakpointObserver) {
    this.isHandset$ = this.bo.observe([Breakpoints.XSmall, '(max-width: 599.98px)'])
      .pipe(map(r => r.matches), shareReplay(1));

    this.isTablet$ = this.bo.observe(['(min-width: 600px) and (max-width: 959.98px)'])
      .pipe(map(r => r.matches), shareReplay(1));

    this.isDesktop$ = this.bo.observe(['(min-width: 960px)'])
      .pipe(map(r => r.matches), shareReplay(1));
  }
}
