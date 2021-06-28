import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveProjectMemberComponentComponent } from './remove-project-member-component.component';

describe('RemoveProjectMemberComponentComponent', () => {
  let component: RemoveProjectMemberComponentComponent;
  let fixture: ComponentFixture<RemoveProjectMemberComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveProjectMemberComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveProjectMemberComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
