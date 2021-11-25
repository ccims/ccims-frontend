import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectIssueListComponent } from './project-issue-list.component';

describe('ProjectIssueListComponent', () => {
  let component: ProjectIssueListComponent;
  let fixture: ComponentFixture<ProjectIssueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectIssueListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectIssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
