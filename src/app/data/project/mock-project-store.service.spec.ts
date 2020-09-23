import { TestBed } from '@angular/core/testing';

import { MockProjectStoreService } from './mock-project-store.service';

describe('MockProjectStoreService', () => {
  let service: MockProjectStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockProjectStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
