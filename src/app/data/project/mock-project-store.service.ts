import { Injectable } from '@angular/core';
import { Project } from './project';

@Injectable({
  providedIn: 'root'
})
export class MockProjectStoreService {

  projects: Project[];

  constructor() {
    this.projects = [
      {
        id: 1,
        name: 'Shop'
      },
      {
        id: 2,
        name: 'LLVM'
      },
      {
        id: 3,
        name: 'Linux'
      }
    ];
  }

  getAll(): Project[] {
    return this.projects;
  }

  getSingle(id: number): Project {
    return this.projects.find(project => project.id === id);
  }
  create(project: Project) {
    this.projects.push(project);
  }
}
