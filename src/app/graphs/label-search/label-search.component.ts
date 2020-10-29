import { Component, OnInit } from '@angular/core';
import { Person } from '@app/data/label/mock-label-store.service';
import { concat, of, Subject, Observable } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Label } from 'src/generated/graphql';
import { MockLabelStoreService } from '../../data/label/mock-label-store.service';
import { FilterLabel, LabelStoreService } from '../../data/label/label-store.service';
import { StateService } from '../../state.service';


@Component({
  selector: 'app-label-search',
  templateUrl: './label-search.component.html',
  styleUrls: ['./label-search.component.scss']
})
export class LabelSearchComponent implements OnInit {
  labels$: Observable<FilterLabel[]>;
  labelsLoading = false;
  labelsInput$ = new Subject<string>();
  selectedLabels: FilterLabel[] = [];

  constructor(private labelStore: LabelStoreService, private ss: StateService) {
  }

  ngOnInit() {
      this.loadLabels();
  }

  trackByFn(item: FilterLabel) {
      return item.id;
  }

  private loadLabels() {
      this.labels$ = concat(
          of([]), // default items
          this.labelsInput$.pipe(
              distinctUntilChanged(),
              tap(() => this.labelsLoading = true),
              switchMap(term => this.labelStore.getMatchingLabels(this.ss.state.project.id, term).pipe(
                  catchError(() => of([])), // empty list on error
                  tap(() => this.labelsLoading = false)
              ))
          )
      );
  }

}
