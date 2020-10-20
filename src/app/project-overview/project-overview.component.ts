import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockProjectStoreService } from '@app/data/project/mock-project-store.service';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import { Interface } from 'readline';
import { GetFullProjectQuery, GetProjectQuery, Project, User } from 'src/generated/graphql';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent {

  public projectId: string;
  public project$: Observable<GetFullProjectQuery>;
  public project: GetFullProjectQuery;

  constructor(private projectStore: ProjectStoreService, private route: ActivatedRoute) {
    this.projectId = route.snapshot.paramMap.get('id');
    this.project$ = this.projectStore.getFullProject(this.projectId);
    this.project$.subscribe(project => {
      this.project = project;
      console.log(project);
    });



  }
}
