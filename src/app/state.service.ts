import { Injectable } from '@angular/core';
import { NavigationEnd, Router, PRIMARY_OUTLET } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Project } from 'src/generated/graphql';
import { ProjectStoreService } from './data/project/project-store.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state: AppState = {
    project: new BehaviorSubject(null)
  };

  constructor(private router: Router, private ps: ProjectStoreService) {
      router.events.pipe(
      filter(event => (event instanceof NavigationEnd && this.isProjectURL(event.url))),
      switchMap((event: NavigationEnd) => ps.get(this.router.parseUrl(event.url).root.children[PRIMARY_OUTLET].segments[1].path))
    ).subscribe(this.state.project);
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
  project?: Subject<Pick<Project, "id" | "name">>
}
export function isNonNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}

