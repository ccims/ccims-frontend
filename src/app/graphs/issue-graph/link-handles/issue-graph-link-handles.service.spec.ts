import {TestBed} from '@angular/core/testing';

import {IssueGraphLinkHandlesService} from './issue-graph-link-handles.service';

describe('IssueGraphLinkHandlesService', () => {
  let service: IssueGraphLinkHandlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueGraphLinkHandlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
