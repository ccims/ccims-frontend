import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccessTokenDialogComponent} from './access-token-dialog.component';

describe('AccessTokenDialogComponent', () => {
  let component: AccessTokenDialogComponent;
  let fixture: ComponentFixture<AccessTokenDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccessTokenDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessTokenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
