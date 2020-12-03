import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectMemberDialogComponent } from './add-project-member-dialog.component';

describe('AddProjectMemberDialogComponent', () => {
  let component: AddProjectMemberDialogComponent;
  let fixture: ComponentFixture<AddProjectMemberDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProjectMemberDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectMemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
