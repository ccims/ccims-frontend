import {TestBed} from '@angular/core/testing';

import {IssueGraphClassSettersService} from './issue-graph-class-setters.service';

describe('IssueGraphClassSettersService', () => {
  let service: IssueGraphClassSettersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueGraphClassSettersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
