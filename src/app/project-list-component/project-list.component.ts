import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CreateProjectDialogComponent} from 'src/app/dialogs/create-project-dialog/create-project-dialog.component';
import {Project} from 'src/generated/graphql';
import {ProjectStoreService} from '../data/project/project-store.service';
import {UserNotifyService} from '@app/user-notify/user-notify.service';

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
  projectName = '';
  lastQueriedProjectName: string;
  projects: Pick<Project, 'id' | 'name'>[] = [];
  loading: boolean;

  constructor(private projectStore: ProjectStoreService, private dialog: MatDialog, private notify: UserNotifyService) {}

  ngOnInit(): void {
    // get all projects from the database
    this.reloadProjects();
  }

  public reloadProjects(): void {
    if (this.lastQueriedProjectName === this.projectName && this.lastQueriedProjectName) {
      return;
    }

    this.loading = true;
    this.projectStore.getAll(this.projectName).subscribe(
      (projects) => {
        this.loading = false;
        this.projects = projects;
        this.lastQueriedProjectName = this.projectName;
      },
      (error) => {
        this.loading = false;
        this.notify.notifyError('Failed to load projects', error);
      }
    );
  }

  public openCreateProjectDialog(): void {
    const createProjectDialogRef = this.dialog.open(CreateProjectDialogComponent);
    createProjectDialogRef.afterClosed().subscribe((result) => {
      this.changeColour();
      if (result?.createdProjectId) {
        this.projectName = '';
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
