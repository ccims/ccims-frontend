import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueGraphComponent } from './issue-graph/issue-graph.component';

import '@ustutt/grapheditor-webcomponent/lib/index';
import { IssueGraphControlsComponent } from './issue-graph-controls/issue-graph-controls.component';


@NgModule({
    declarations: [IssueGraphComponent, IssueGraphControlsComponent],
    imports: [
        CommonModule
    ],
    exports: [
        IssueGraphComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class GraphsModule { }
