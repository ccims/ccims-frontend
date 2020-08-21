import { Component, OnInit } from '@angular/core';
import { Project } from '../model/project';
import { ProjectStoreService } from '../services/project-store.service';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  projects: Project[];
  constructor(private ps: ProjectStoreService) { }

  ngOnInit(): void {
    this.projects = this.ps.getAll();
  }
  remove(project: Project) {
    console.log('Removing ' + project);
  }
}
