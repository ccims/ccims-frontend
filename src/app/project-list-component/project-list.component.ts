import { Component, OnInit } from '@angular/core';
import { Project } from 'src/generated/graphql';
import { ProjectStoreService } from '../data/project/project-store.service';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  pendingCreate = false;
  projectName?: string;
  projects: Pick<Project, 'id' | 'name'>[];
  constructor(private ps: ProjectStoreService) { }

  createProject() {
    this.ps.create();
  }
  ngOnInit(): void {
    this.ps.getAll().subscribe(projects => this.projects = projects);
  }
  remove(project: Project) {
    console.log('Removing ' + project);
  }
}
