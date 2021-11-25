import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LabelSearchComponent} from './label-search.component';

describe('LabelSearchComponent', () => {
  let component: LabelSearchComponent;
  let fixture: ComponentFixture<LabelSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabelSearchComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
