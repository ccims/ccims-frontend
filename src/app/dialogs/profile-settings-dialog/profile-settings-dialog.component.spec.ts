import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettingsDialogComponent } from './profile-settings-dialog.component';

describe('ProfileSettingsDialogComponent', () => {
  let component: ProfileSettingsDialogComponent;
  let fixture: ComponentFixture<ProfileSettingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSettingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
