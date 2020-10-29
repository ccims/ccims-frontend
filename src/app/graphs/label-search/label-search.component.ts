import { Component, OnInit } from '@angular/core';
import { Person } from '@app/data/label/mock-label-store.service';
import { concat, of, Subject, Observable } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Label } from 'src/generated/graphql';
import { MockLabelStoreService } from '../../data/label/mock-label-store.service';


@Component({
  selector: 'app-label-search',
  templateUrl: './label-search.component.html',
  styleUrls: ['./label-search.component.scss']
})
export class LabelSearchComponent implements OnInit {
  people$: Observable<Person[]>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  selectedPersons: Person[] = <any>[{ name: 'Karyn Wright' }, { name: 'Other' }];

  constructor(private dataService: MockLabelStoreService) {
  }

  ngOnInit() {
      this.loadPeople();
  }

  trackByFn(item: Person) {
      return item.id;
  }

  private loadPeople() {
      this.people$ = concat(
          of([]), // default items
          this.peopleInput$.pipe(
              distinctUntilChanged(),
              tap(() => this.peopleLoading = true),
              switchMap(term => this.dataService.getPeople(term).pipe(
                  catchError(() => of([])), // empty list on error
                  tap(() => this.peopleLoading = false)
              ))
          )
      );
  }

}

type SearchLabel = Pick<Label, 'id' | 'name' | 'color' | 'description'>;
