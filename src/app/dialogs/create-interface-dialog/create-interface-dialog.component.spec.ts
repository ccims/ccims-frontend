import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInterfaceDialogComponent } from './create-interface-dialog.component';

describe('CreateInterfaceDialogComponent', () => {
  let component: CreateInterfaceDialogComponent;
  let fixture: ComponentFixture<CreateInterfaceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateInterfaceDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInterfaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
