import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IssueGraphControlsComponent} from './issue-graph-controls.component';

describe('IssueGraphControlsComponent', () => {
  let component: IssueGraphControlsComponent;
  let fixture: ComponentFixture<IssueGraphControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IssueGraphControlsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueGraphControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
