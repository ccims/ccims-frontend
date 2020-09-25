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
    //this.projects=[{name:"erstes",id:"1"},{name:"ezweites Projekt",id:"2"},{name:"drittes Projekt",id:"3"},{name:"viertes Projekt",id:"4"}]
  }
  remove(project: Project) {
    console.log('Removing ' + project);
  }
}
