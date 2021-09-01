import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  Input,
  OnDestroy,
  TemplateRef
} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {MatButton} from '@angular/material/button';

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

@Directive({
  selector: '[appQueryButton]'
})
export class QueryButtonDirective {
  constructor(public element: MatButton) {
  }
}

@Component({
  templateUrl: 'query.component.html',
  selector: 'app-query-component',
  styleUrls: ['query.component.scss']
})
export class QueryComponent implements OnDestroy, AfterViewInit {
  @Input() errorMessage = 'Failed to run query!';
  @ContentChild(QueryBodyDirective) body: QueryBodyDirective;
  @ContentChild(QueryButtonDirective) button: QueryButtonDirective;

  readonly State = QueryComponentState;
  queryState: QueryComponentState = QueryComponentState.Loading;
  private subscription?: Subscription;
  buttonMode: boolean;

  constructor(private notify: UserNotifyService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.buttonMode = !this.body && !!this.button;
    if (this.buttonMode) {
      this.queryState = QueryComponentState.Ready;
    }
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  public ready(): boolean {
    return this.queryState === QueryComponentState.Ready;
  }

  public listenTo<T>(query: Observable<T>, before?: (value: T) => void, error?: (error: any) => void): Observable<T> {
    this.queryState = QueryComponentState.Loading;
    this.changeDetector.detectChanges();
    this.subscription?.unsubscribe();
    this.updateButton();

    this.subscription = query.subscribe((value: T) => {
      if (before) {
        before(value);

        if (this.queryState === QueryComponentState.Error) {
          return;
        }
      }

      this.queryState = QueryComponentState.Ready;
      this.changeDetector.detectChanges();
      this.updateButton();
    }, err => {
      if (error) {
        error(err);
      }

      this.setError();
      this.notify.notifyError(this.errorMessage, err);
    });

    return query;
  }

  public setError(): void {
    this.queryState = QueryComponentState.Error;
    this.changeDetector.detectChanges();
    this.updateButton();
  }

  private updateButton(): void {
    if (!this.buttonMode) {
      return;
    }

    this.button.element.disabled = this.queryState === QueryComponentState.Loading;
  }
}
