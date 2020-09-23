import { Component, OnInit } from '@angular/core';
import { Project } from '../model/project';
import { ProjectStoreService } from '../services/project-store.service';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  pendingCreate = false;
  projectName?: string;

  projects: Project[];
  constructor(private ps: ProjectStoreService) { }

  createProject() {
    this.ps.add({id:5, name: this.projectName});
    this.projects = this.ps.getAll();
  }
  ngOnInit(): void {
    this.projects = this.ps.getAll();
  }
  remove(project: Project) {
    console.log('Removing ' + project);
  }
}
