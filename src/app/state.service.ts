import {Injectable} from '@angular/core';
import {NavigationEnd, PRIMARY_OUTLET, Router} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';
import {GetBasicProjectQuery} from 'src/generated/graphql';
import {ProjectStoreService} from './data/project/project-store.service';

/**
 * This service exposes an observable of the name and id of the current project.
 * It determines the current project by listening for url changes and parsing the url.
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {
  state: AppState = {};
  state$ = new ReplaySubject<AppState>(1);

  constructor(private router: Router, private ps: ProjectStoreService) {
    this.syncStateWithUrl(router, ps);
  }

  /**
   * Sets up two mutually exclusive (look at filter) subscriptions to track whether we are at a
   * url referring to a project or not. If we are at a project we retrieve information about it
   * from the backend and make it available in the state observable
   *
   * @param router allows to listen for routing events
   * @param ps
   */
  syncStateWithUrl(router: Router, ps: ProjectStoreService) {
    router.events.pipe(
      filter(event => (event instanceof NavigationEnd && this.isProjectURL(event.url))),
      switchMap((event: NavigationEnd) =>
        ps.getBasicProject(this.router.parseUrl(event.url).root?.children[PRIMARY_OUTLET].segments[1].path)
      )
    ).subscribe(project => {
      this.state.project = project;
      this.state$.next(this.state);
    });
    // set project to null if new url is not specific to a project
    router.events.pipe(
      filter(event => (event instanceof NavigationEnd && !this.isProjectURL(event.url))),
    ).subscribe(_ => {
      this.state.project = null;
      this.state$.next(this.state);
    });
  }

  /**
   * Caution:
   * If you change the routing you might have to change this function too.
   * That is if it has the form 'projects/:id' + further stuff.
   * @param url
   * @returns true iff url is a route pertaining to a project
   */
  private isProjectURL(url: string): boolean {
    const tree = this.router.parseUrl(url);
    const primary = tree.root.children[PRIMARY_OUTLET];
    if (primary) {
      const primarySegments = primary.segments;
      return (primarySegments[0].path === 'projects' && primary.segments.length >= 2);
    }
    return false;
  }
}

export interface AppState {
  project?: GetBasicProjectQuery;
}

export function isNonNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}

