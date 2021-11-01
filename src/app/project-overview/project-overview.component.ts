import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectStoreService} from '@app/data/project/project-store.service';
import {MatDialog} from '@angular/material/dialog';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {RemoveDialogComponent} from '@app/dialogs/remove-dialog/remove-dialog.component';
import {DataNode} from '@app/data-dgql/query';
import {Project} from '../../generated/graphql-dgql';
import DataService from '@app/data-dgql';
import {NodeType} from '@app/data-dgql/id';
import {QueryComponent} from '@app/utils/query-component/query.component';

/**
 * This component offers a view showing the project name,
 * owner, id and description.
 */
@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit, AfterViewInit {
  @ViewChild(QueryComponent) queryComponent: QueryComponent;

  public projectId: string;
  public project: DataNode<Project>;
  description = '';

  constructor(private dataService: DataService,
              private projectStore: ProjectStoreService,
              private route: ActivatedRoute,
              private router: Router,
              private changeDetector: ChangeDetectorRef,
              private dialog: MatDialog,
              private notify: UserNotifyService) {
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.project = this.dataService.getNode({type: NodeType.Project, id: this.projectId});
  }

  ngAfterViewInit() {
    this.queryComponent.listenTo(this.project, project => this.description = project.description);
  }

  projectNameEdited(saved: boolean): void {
    if (!saved) {
      return;
    }

    alert('TODO: Save');
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
}
