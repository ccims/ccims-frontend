import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CreateProjectDialogComponent} from 'src/app/dialogs/create-project-dialog/create-project-dialog.component';
import {Project} from 'src/generated/graphql';
import {ProjectStoreService} from '../data/project/project-store.service';
import {demoProject} from '@app/evaluation/demo-project';

/**
 * This component is the landing page for the user after loggin in to the system
 * It shows a list of all projects the user can access
 */
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  pendingCreate = false;
  projectName?: string;
  projects: Pick<Project, 'id' | 'name'>[];
  loading: boolean;

  constructor(private projectMockService: demoProject, private ps: ProjectStoreService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    // get all projects from the database
    this.ps.getAll().subscribe(projects => this.projects = projects);
  }

  public reloadProjects(): void {
    this.ps.getAll().subscribe(projects => this.projects = projects);
  }

  public openCreateProjectDialog(): void {
    const createProjectDialogRef = this.dialog.open(CreateProjectDialogComponent);
    createProjectDialogRef.afterClosed().subscribe(result => {
      this.changeColour();
      if (result?.createdProjectId) {
        this.reloadProjects();
      }
    });

  }

  // remove the focus from the create project button after the project is created
  private changeColour(): void {
    const b = document.querySelector('#buttonCreateProject') as HTMLElement;
    b.blur();
  }

  // if the shortcut icon to the graph view of a project is clicked the list view fires a event that a row was clicked
  // and the user jumps to the project overview. This method prevents the default event and enable the shortcut button
  // to perform its action
  public nothing(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }

}

