import {ChangeDetectorRef, Component, ContentChild, Directive, Input, OnDestroy, TemplateRef} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {UserNotifyService} from '@app/user-notify/user-notify.service';

export enum QueryComponentState {
  Ready,
  Loading,
  Error
}

@Directive({
  selector: '[appQueryBody]'
})
export class QueryBodyDirective {
  constructor(public template: TemplateRef<unknown>) {
  }
}

@Component({
  templateUrl: 'query.component.html',
  selector: 'app-query-component',
  styleUrls: ['query.component.scss']
})
export class QueryComponent implements OnDestroy {
  @Input() errorMessage = 'Failed to run query!';
  @ContentChild(QueryBodyDirective) body: QueryBodyDirective;

  readonly State = QueryComponentState;
  queryState: QueryComponentState = QueryComponentState.Loading;
  private subscription?: Subscription;

  constructor(private notify: UserNotifyService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  public ready(): boolean {
    return this.queryState === QueryComponentState.Ready;
  }

  public listenTo<T>(query: Observable<T>): Observable<T> {
    this.queryState = QueryComponentState.Loading;
    this.changeDetector.detectChanges();
    this.subscription?.unsubscribe();

    this.subscription = query.subscribe(() => {
      this.queryState = QueryComponentState.Ready;
      this.changeDetector.detectChanges();
    }, error => {
      this.queryState = QueryComponentState.Error;
      this.changeDetector.detectChanges();
      this.notify.notifyError(this.errorMessage, error);
    });

    return query;
  }
}
