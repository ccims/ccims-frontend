import { TestBed } from '@angular/core/testing';

import { IssueGraphStoreService } from '../data/issue-graph/issue-graph-store.service';

describe('IssueGraphService', () => {
  let service: IssueGraphStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueGraphStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
