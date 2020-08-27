import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemArchitectureGraphComponent } from './system-architecture-graph.component';

describe('SystemArchitectureGraphComponent', () => {
    let component: SystemArchitectureGraphComponent;
    let fixture: ComponentFixture<SystemArchitectureGraphComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SystemArchitectureGraphComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SystemArchitectureGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
