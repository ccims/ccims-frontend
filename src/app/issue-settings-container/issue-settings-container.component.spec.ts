import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueSettingsContainerComponent } from './issue-settings-container.component';

describe('IssueSettingsContainerComponent', () => {
  let component: IssueSettingsContainerComponent;
  let fixture: ComponentFixture<IssueSettingsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueSettingsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueSettingsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
