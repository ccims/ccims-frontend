import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueGraphComponent } from './issue-graph/issue-graph.component';

import '@ustutt/grapheditor-webcomponent/lib/index';


@NgModule({
    declarations: [IssueGraphComponent],
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
