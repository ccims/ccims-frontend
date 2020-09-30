import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateProjectDialogComponent } from 'src/app/dialogs/create-project-dialog/create-project-dialog.component';
import { Project } from 'src/generated/graphql';
import { ProjectStoreService } from '../data/project/project-store.service';
import { RemoveDialogComponent } from 'src/app/dialogs/remove-dialog/remove-dialog.component';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  pendingCreate = false;
  projectName?: string;
  projects: Pick<Project, 'id' | 'name'>[];
  constructor(private ps: ProjectStoreService, private dialog: MatDialog,private nzMessageService: NzMessageService) { }

  ngOnInit(): void {
    this.ps.getAll().subscribe(projects => this.projects = projects);
    // For Testing pupose only has to be deleted for production use
    // this.projects=[{name:'erstes',id:'1'},{name:'ezweites Projekt',id:'2'},
    // {name:'drittes Projekt',id:'3'},{name:'viertes Projekt',id:'4'}];
  }
  remove(event: Event, project: Project) {
    //event.preventDefault();
    //event.stopImmediatePropagation();
    // open remove dialog
    /* const RemoveDialogRef = this.dialog.open(RemoveDialogComponent, {data: {type: "project", name: project.name, id:project.id}});
     RemoveDialogRef.afterClosed().subscribe(projectToDelete => {
       if (projectToDelete) {
        this.reloadProjects();
      }
    }); // end Dialog handling
  */
  this.ps.delete(project.id);
  this.nzMessageService.info(project.name + ' deleted');
  this.reloadProjects();
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
      this.reloadProjects();
    });

}
private changeColour(): void {
  const b = document.querySelector('#buttonCreateProject') as HTMLElement;
  b.blur();
}
public nothing(e: Event): void {
//console.log(e);
e.preventDefault();
e.stopPropagation();
}
public cancelConfirm(): void {
  this.nzMessageService.info('Canceled');
}
}

