import { TestBed } from '@angular/core/testing';

import { IssueStoreService } from './issue-store.service';

describe('IssueStoreService', () => {
  let service: IssueStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
