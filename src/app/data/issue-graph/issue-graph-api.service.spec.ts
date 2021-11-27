import {TestBed} from '@angular/core/testing';

import {IssueGraphApiService} from './issue-graph-api.service';

describe('IssueGraphApiService', () => {
  let service: IssueGraphApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueGraphApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
