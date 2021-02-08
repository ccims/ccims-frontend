import { Injectable } from '@angular/core';
import { NavigationEnd, Router, PRIMARY_OUTLET } from '@angular/router';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Project } from 'src/generated/graphql';
import { ProjectStoreService } from './data/project/project-store.service';

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
   */
  syncStateWithUrl(router: Router, ps: ProjectStoreService) {
    router.events.pipe(
      filter(event => (event instanceof NavigationEnd && this.isProjectURL(event.url))),
      switchMap((event: NavigationEnd) => ps.get(this.router.parseUrl(event.url).root?.children[PRIMARY_OUTLET].segments[1].path))
    ).subscribe(project => {
      this.state.project = project;
      this.state$.next(this.state);
    });

    router.events.pipe(
      filter(event => (event instanceof NavigationEnd && !this.isProjectURL(event.url))),
    ).subscribe(_ =>  {
      this.state.project = null;
      this.state$.next(this.state);
    });
  }

  /*
  If you change the routing you might have to change this function too.
  This function must return true iff url is a route pertaining to a project.
  That is if it has the form 'projects/:id' + further stuff.
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
  project?: Pick<Project, 'id' | 'name'>;
}

export function isNonNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}

