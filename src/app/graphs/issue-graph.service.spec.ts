import { TestBed } from '@angular/core/testing';

import { IssueGraphService } from './issue-graph.service';

describe('IssueGraphService', () => {
  let service: IssueGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
