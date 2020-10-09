import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockProjectStoreService } from '@app/data/project/mock-project-store.service';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import { Interface } from 'readline';
import { Project, User } from 'src/generated/graphql';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent {

  public projectId: string;
  public project$: Observable<Pick<Project, "id" | "name" | "description"> & {
    owner: Pick<User, "id">
  }>;

  constructor(private projectStoreService: ProjectStoreService, private route: ActivatedRoute) {
    this.projectId = route.snapshot.paramMap.get('id');
    this.project$ = projectStoreService.getFullProject(this.projectId);
  }
}
