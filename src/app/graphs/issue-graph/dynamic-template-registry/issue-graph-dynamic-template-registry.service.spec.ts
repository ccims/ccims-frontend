import { TestBed } from '@angular/core/testing';

import { IssueGraphDynamicTemplateRegistryService } from './issue-graph-dynamic-template-registry.service';

describe('IssueGraphDynamicTemplateRegistryService', () => {
  let service: IssueGraphDynamicTemplateRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueGraphDynamicTemplateRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
