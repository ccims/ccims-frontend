import { Component, OnInit } from '@angular/core';
import { Project } from '../data/project/project';
import { ProjectStoreService } from '../data/project/project-store.service';
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
    this.ps.create();
  }
  ngOnInit(): void {
    this.projects = []//this.ps.getAll();
  }
  remove(project: Project) {
    console.log('Removing ' + project);
  }
}
