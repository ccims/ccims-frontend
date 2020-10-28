import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Label } from 'src/generated/graphql';

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

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
      this.loadPeople();
  }

  trackByFn(label: SearchLabel) {
      return label.id;
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

type SearchLabel = Pick<Label, "id" | "name" | "color" | "description">;
