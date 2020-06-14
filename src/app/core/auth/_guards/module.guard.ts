// Angular
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
// RxJS
import {Observable, of} from 'rxjs';
import {tap, map} from 'rxjs/operators';
// NGRX
import {select, Store} from '@ngrx/store';
// Module reducers and selectors
import {AppState} from '../../../core/reducers/';

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const moduleName = route.data.moduleName as string;
    return of(true);
  }
}
