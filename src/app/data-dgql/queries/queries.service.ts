import { Injectable } from '@angular/core';
import { IssuesService } from './issues.service';
import { ProjectsService } from './projects.service';
import { ComponentsService } from './components.service';

@Injectable({
  providedIn: 'root'
})
export class QueriesService {
  constructor(
    public components: ComponentsService,
    public issues: IssuesService,
    public projects: ProjectsService,
  ) {}
}
