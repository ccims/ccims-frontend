import {TestBed} from '@angular/core/testing';

import {InterfaceStoreService} from './interface-store.service';

describe('InterfaceStoreService', () => {
  let service: InterfaceStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterfaceStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
