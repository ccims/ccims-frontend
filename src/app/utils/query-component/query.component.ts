import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, Directive, Input, OnDestroy, TemplateRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserNotifyService } from '@app/user-notify/user-notify.service';
import { MatButton } from '@angular/material/button';

/**
 * The current state of the query
 */
export enum QueryComponentState {
  /** The query was executed successfully */
  Ready,
  /** The query has not yet finished */
  Loading,
  /** The query returned an error */
  Error
}

/**
 * This directive is used on an `ng-template`, to indicate that the contents of it should be shown once
 * the query finished successfully
 */
@Directive({
  selector: '[appQueryBody]'
})
export class QueryBodyDirective {
  constructor(public template: TemplateRef<unknown>) {}
}

/**
 * This directive is used on a `button`, to inidcate that the {@link QueryComponent} should manage the state of this
 * button
 */
@Directive({
  selector: '[appQueryButton]'
})
export class QueryButtonDirective {
  constructor(public element: MatButton) {}
}

/**
 * This component is intended to be used in combination with an `Observable`.
 * The component expects that either an `ng-template` or a `MatButton` is in the body and that the appropriate directive
 * is used on it ({@link QueryBodyDirective} with `ng-template`, {@link QueryButtonDirective} with `button`).
 * Once the appropriate function is called, the component subscribes to the observable, showing the user a loading
 * indication and, if applicable, disables the `button`.
 * Once the query finished, the content in the `ng-template` is shown or the button is enabled again.
 * If the subscription yielded an error, a message is shown instead of the `ng-template`, or the button is re-enabled.
 * Note that no verification has to be made if the query was successful, when using an `ng-template`.
 * The content of the `ng-template` is only executed once the {@link #queryState} is `Ready`.
 *
 * #### Example 1: Using `ng-template`
 * This example will show, instead of the content directly, a loading indicator as soon as the page is loaded.
 * ```html
 * <app-query-component errorMessage="This is the message shown if the query failed">
 *   <ng-template appQueryBody>
 *     This will only be shown if the query was successful!
 *     <!-- <div *ngIf="this.data"> Not required! -->
 *     Result is: {{this.data}}
 *     <!-- </div> -->
 *   </ng-template>
 * </app-query-component>
 * ```
 *
 * ```ts
 * // ...
 *
 * @ViewChild(QueryComponent) query: QueryComponent;
 *
 * // ...
 *
 * ngAfterViewInit() {
 *   // Have to use ngAfterViewInit, otherwise query will be undefined!
 *
 *   this.query.listenTo(this.someObservable,
 *     result => {
 *       this.data = result;
 *       console.log('Result callback');
 *     },
 *     error => {
 *       console.log('Error callback');
 *     }
 *   );
 * }
 * ```
 *
 * #### Example 2: Using `button`
 * This example will subscribe to the observable as soon as the button is clicked.
 * The button is disabled and a loading indicator is shown as long as the subscription has not yielded a result.
 * ```html
 * <app-query-component errorMessage="Failed to do something">
 *   <button mat-raised-button (click)="this.onClick()" appQueryButton>
 *     Do something that takes a while...
 *   </button>
 * </app-query-component>
 * ```
 *
 * ```ts
 * // ...
 *
 * @ViewChild(QueryComponent) query: QueryComponent;
 *
 * // ...
 *
 * onClick() {
 *   this.query.listenTo(this.somethingThatTakesAWhile,
 *     result => {
 *       console.log('Result callback');
 *     },
 *     error => {
 *       console.log('Error callback');
 *     }
 *   );
 * }
 * ```
 */
@Component({
  templateUrl: 'query.component.html',
  selector: 'app-query-component',
  styleUrls: ['query.component.scss']
})
export class QueryComponent implements OnDestroy, AfterViewInit {
  /** Error message to be shown if the subscription failed */
  @Input() errorMessage = 'Failed to run query!';
  @ContentChild(QueryBodyDirective) body: QueryBodyDirective;
  @ContentChild(QueryButtonDirective) button: QueryButtonDirective;

  /** @ignore */
  readonly State = QueryComponentState;
  /** The current state of the query */
  queryState: QueryComponentState = QueryComponentState.Loading;
  private subscription?: Subscription;
  /** If true, a button is in the query body, not a template*/
  buttonMode: boolean;

  constructor(private notify: UserNotifyService, private changeDetector: ChangeDetectorRef) {}

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

  /** Quick way of checking if `this.query.queryState === QueryComponentState.Ready` */
  public ready(): boolean {
    return this.queryState === QueryComponentState.Ready;
  }

  /**
   * Subscribe the query component to the observable
   * @param query The observable
   * @param success The function to be called if the query was successful
   * @param error The function to be called if the query had an error
   */
  public listenTo<T>(query: Observable<T>, success?: (value: T) => void, error?: (error: any) => void): void {
    this.queryState = QueryComponentState.Loading;
    this.changeDetector.detectChanges();
    this.subscription?.unsubscribe();
    this.updateButton();

    this.subscription = query.subscribe(
      (value: T) => {
        if (success) {
          success(value);

          // Check if the callback changed the query state, e.g. by calling setError()
          if (this.queryState === QueryComponentState.Error) {
            return;
          }
        }

        this.queryState = QueryComponentState.Ready;
        this.changeDetector.detectChanges();
        this.updateButton();
      },
      (err) => {
        if (error) {
          error(err);
        }

        this.setError();
        this.notify.notifyError(this.errorMessage, err);
      }
    );
  }

  /**
   * Manually sets this query component to the error state.
   * This may be useful if e.g. the query ran successfully, the contained data in it however is not valid.
   */
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
