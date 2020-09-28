import { Injectable } from '@angular/core';
import { NavigationEnd, Router, PRIMARY_OUTLET } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Project } from 'src/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state: AppState = {
    project: null
  };

  constructor(private router: Router) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const tree = this.router.parseUrl(event.url);
      const paramMap = tree.queryParamMap;
      const primary = tree.root.children[PRIMARY_OUTLET];
      const primarySegments = primary.segments;
      if(primarySegments[0].path === 'projects' && primary.segments.length >= 2) {
        console.log("Heyoo");
      }
    });
  }
}

export interface AppState {
  project?: Project;
}
