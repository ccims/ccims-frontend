import { Injectable } from '@angular/core';
import { IssuesService } from './issues.service';
import { ProjectsService } from './projects.service';

@Injectable({
  providedIn: 'root'
})
export class QueriesService {
  constructor(
    public issues: IssuesService,
    public projects: ProjectsService,
  ) {}
}
