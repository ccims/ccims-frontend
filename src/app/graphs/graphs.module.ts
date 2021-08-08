import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueGraphComponent } from './issue-graph/issue-graph.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import '@ustutt/grapheditor-webcomponent/lib/index';
import { IssueGraphControlsComponent } from './issue-graph-controls/issue-graph-controls.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentDetailsComponent } from '../component-details/component-details.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { IssueListComponent } from '@app/issue-list/issue-list.component';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import { MatSortModule } from '@angular/material/sort';
import { LabelSearchComponent } from './label-search/label-search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { InterfaceDetailsComponent } from '@app/interface-details/interface-details.component';
import { ProjectIssueListComponent } from '@app/project-issue-list/project-issue-list.component';
import { ProjectMembersComponent } from '@app/project-members/project-members.component';
import { AddProjectMemberDialogComponent } from '../dialogs/add-project-member-dialog/add-project-member-dialog.component';
import { CursorPaginatorComponent } from '@app/components/cursor-paginator/cursor-paginator.component';

/**
 * The IssueGraphComponent and IssueGraphControlsComponent form their own module declared here
 * and imported into the main app.
 * @export
 * @class GraphsModule
 */
@NgModule({
  declarations: [IssueGraphComponent, IssueGraphControlsComponent, ComponentDetailsComponent,
    IssueListComponent,
    LabelSearchComponent,
    InterfaceDetailsComponent,
    ProjectIssueListComponent,
    ProjectMembersComponent,
    AddProjectMemberDialogComponent, CursorPaginatorComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    MatDialogModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgSelectModule,
    NgOptionHighlightModule
  ],
  exports: [
    CdkTableModule,
    CdkTreeModule,
    IssueGraphComponent,
    IssueGraphControlsComponent,
    IssueListComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class GraphsModule { }
