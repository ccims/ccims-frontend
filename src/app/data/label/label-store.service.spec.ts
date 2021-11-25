import {TestBed} from '@angular/core/testing';

import {LabelStoreService} from './label-store.service';

describe('LabelStoreService', () => {
  let service: LabelStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabelStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
