import {TestBed} from '@angular/core/testing';

import {IssueGraphStateService} from '../data/issue-graph/issue-graph-state.service';

describe('IssueGraphService', () => {
  let service: IssueGraphStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueGraphStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
