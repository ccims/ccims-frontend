import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectStoreService} from '@app/data/project/project-store.service';
import {MatDialog} from '@angular/material/dialog';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {RemoveDialogComponent} from '@app/dialogs/remove-dialog/remove-dialog.component';
import {DataNode} from '@app/data-dgql/query';
import {Project} from '../../generated/graphql-dgql';
import DataService from '@app/data-dgql';
import {encodeNodeId, NodeType} from '@app/data-dgql/id';
import {Subscription} from 'rxjs';
import {QueryComponent} from '@app/utils/query-component/query.component';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { NgZone } from '@angular/core';
import { VariableDefinitionNode } from 'graphql';

/**
 * This component offers a view showing the project name,
 * owner, id and description.
 */
@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('description') description: ElementRef;
  @ViewChild(QueryComponent) queryComponent: QueryComponent;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  public projectId: string;
  public projectDescription: string;
  public project: DataNode<Project>;
  private projectSub: Subscription;
  public editDesctiption: Boolean;

  constructor(private dataService: DataService,
              private projectStore: ProjectStoreService,
              private route: ActivatedRoute,
              private router: Router,
              private changeDetector: ChangeDetectorRef,
              private dialog: MatDialog,
              private notify: UserNotifyService,
              private _ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.project = this.dataService.getNode(encodeNodeId({type: NodeType.Project, id: this.projectId}));
    this.editDesctiption = false;
  }

  ngAfterViewInit() {
    this.projectSub = this.queryComponent.listenTo(this.project).subscribe();
  }

  ngOnDestroy() {
    this.projectSub.unsubscribe();
  }

  deleteProject(): void {
    const confirmDeleteDialogRef = this.dialog.open(RemoveDialogComponent,
      {
        data: {
          title: 'Really delete project \"' + this.project.current.name + '\"?',
          messages: ['Are you sure you want to delete the project \"' + this.project.current.name + '\"?',
            'This action cannot be undone!'],
          verificationName: this.project.current.name
        }
      });
    confirmDeleteDialogRef.afterClosed().subscribe(del => {
      if (del) {
        this.projectStore.delete(this.projectId).subscribe(() => {
            this.notify.notifyInfo('Successfully deleted project \"' + this.project.current.name + '\"');
            this.router.navigate(['/']);
          },
          error => this.notify.notifyError('Failed to delete project!', error));
      }
    });
  }

  // this function allows the user to edit the desctiption of a project
  editProjectDescription(): void {
    //remove readonly property to let user edit the description
    document.getElementById('textarea').removeAttribute('readonly');
    console.log("description edited");
    console.log(this.project.current.description);
  }
}
