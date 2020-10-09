import { TestBed } from '@angular/core/testing';

import { ComponentStoreService } from './component-store.service';

describe('ComponentStoreService', () => {
  let service: ComponentStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
