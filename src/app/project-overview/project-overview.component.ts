import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectStoreService} from '@app/data/project/project-store.service';
import {GetFullProjectQuery} from 'src/generated/graphql';
import {Observable} from 'rxjs';
import {RemoveDialogComponent} from '@app/dialogs/remove-dialog/remove-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UserNotifyService} from '@app/user-notify/user-notify.service';

/**
 * This component offers a view showing the project name,
 * owner, id and description.
 */
@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {
  @ViewChild('description') description: ElementRef;

  public projectId: string;
  public project$: Observable<GetFullProjectQuery>;
  public project: GetFullProjectQuery;
  loaded = false;

  constructor(private projectStore: ProjectStoreService,
              private route: ActivatedRoute,
              private router: Router,
              private changeDetector: ChangeDetectorRef,
              private dialog: MatDialog,
              private notify: UserNotifyService) {
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    // FIXME: Don't get the whole project here!
    this.project$ = this.projectStore.getFullProject(this.projectId);
    this.project$.subscribe(project => {
      this.project = project;
      this.loaded = true;
      this.changeDetector.detectChanges();
      this.description.nativeElement.value = this.project.node.description;
      this.description.nativeElement.style.height = this.description.nativeElement.scrollHeight + 'px';
    });
  }

  deleteProject(): void {
    const confirmDeleteDialogRef = this.dialog.open(RemoveDialogComponent,
      {
        data: {
          title: 'Really delete project \"' + this.project.node.name + '\"?',
          messages: ['Are you sure you want to delete the project \"' + this.project.node.name + '\"?', 'This action cannot be undone!']
        }
      });
    confirmDeleteDialogRef.afterClosed().subscribe(del => {
      if (del) {
        this.projectStore.delete(this.projectId).subscribe(() => {
            this.notify.notifyInfo('Successfully deleted project \"' + this.project.node.name + '\"');
            this.router.navigate(['/']);
          },
          error => this.notify.notifyError('Failed to delete project!', error));
      }
    });
  }
}
