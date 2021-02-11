import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateProjectDialogComponent } from 'src/app/dialogs/create-project-dialog/create-project-dialog.component';
import { Project } from 'src/generated/graphql';
import { ProjectStoreService } from '../data/project/project-store.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { demoProject } from '@app/evaluation/demo-project';
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

  constructor(private projectMockService: demoProject, private ps: ProjectStoreService, private dialog: MatDialog,
              private nzMessageService: NzMessageService) { }

  ngOnInit(): void {
    this.ps.getAll().subscribe(projects => this.projects = projects);

  }
  remove(event: Event, project: Project) {
    this.ps.delete(project.id).subscribe(data => this.reloadProjects());
    this.nzMessageService.info(project.name + ' deleted');
  }

  public reloadProjects(): void {
    this.ps.getAll().subscribe(projects => this.projects = projects);
  }

  public openCreateProjectDialog(): void {
    const createProjectDialogRef = this.dialog.open(CreateProjectDialogComponent);
    createProjectDialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.changeColour();
      // this.ps.getAll().subscribe(projects => this.projects = projects);
      if (result?.createdProjectId) {
        this.reloadProjects();
      }
    });

  }
  private changeColour(): void {
    const b = document.querySelector('#buttonCreateProject') as HTMLElement;
    b.blur();
  }

  public nothing(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }

  public cancelConfirm(): void {
    this.nzMessageService.info('Canceled');
  }

  public createDemoProject() {
    this.loading = true;
    this.projectMockService.createDemoProject();
  }
}

