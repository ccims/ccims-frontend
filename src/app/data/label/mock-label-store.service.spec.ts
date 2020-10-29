import { TestBed } from '@angular/core/testing';

import { MockLabelStoreService } from './mock-label-store.service';

describe('MockLabelStoreService', () => {
  let service: MockLabelStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockLabelStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
