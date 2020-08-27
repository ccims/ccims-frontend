import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueGraphComponent } from './issue-graph.component';

describe('IssueGraphComponent', () => {
    let component: IssueGraphComponent;
    let fixture: ComponentFixture<IssueGraphComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IssueGraphComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IssueGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
