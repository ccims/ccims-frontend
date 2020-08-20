import { Component, OnInit } from '@angular/core';
export interface Project {
  name: string;
}

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent implements OnInit {
  projects: Project[] = [
    {name: "Shop System"},
    {name: "LLVM"},
    {name: "Linux"}
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
