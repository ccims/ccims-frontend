import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComponentDialogComponent } from './create-component-dialog.component';

describe('CreateComponentDialogComponent', () => {
  let component: CreateComponentDialogComponent;
  let fixture: ComponentFixture<CreateComponentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateComponentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
