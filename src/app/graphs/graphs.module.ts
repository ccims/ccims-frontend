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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { IssueListComponent } from '@app/issue-list/issue-list.component';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatSortModule } from '@angular/material/sort';
import { LabelSearchComponent } from './label-search/label-search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { ProjectIssueListComponent } from '@app/project-issue-list/project-issue-list.component';
import { ProjectMembersComponent } from '@app/project-members/project-members.component';
import { AddProjectMemberDialogComponent } from '../dialogs/add-project-member-dialog/add-project-member-dialog.component';
import { CursorPaginatorComponent } from '@app/components/cursor-paginator/cursor-paginator.component';
import { SetEditorComponent } from '@app/components/set-editor/set-editor.component';
import { ItemDirective } from '@app/components/item.directive';
import { IssueLabelComponent } from '@app/components/issue-label/issue-label.component';
import { SetEditorDialogComponent } from '@app/components/set-editor/set-editor-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IssueItemComponent } from '@app/components/issue-item/issue-item.component';
import { UserItemComponent } from '@app/components/user-item/user-item.component';
import { IssueIconComponent } from '@app/components/issue-icon/issue-icon.component';
import { MatMenuModule } from '@angular/material/menu';
import { IssueSidebarComponent } from '@app/issue-detail/issue-sidebar.component';
import { CacheNodeComponent } from '@app/components/cache-node.component';
import { ProjectHeaderComponent } from '@app/project-header/project-header.component';

/**
 * The IssueGraphComponent and IssueGraphControlsComponent form their own module declared here
 * and imported into the main app.
 * @export
 * @class GraphsModule
 */
@NgModule({
  declarations: [
    IssueGraphComponent,
    IssueGraphControlsComponent,
    IssueListComponent,
    LabelSearchComponent,
    ProjectIssueListComponent,
    ProjectMembersComponent,
    AddProjectMemberDialogComponent,
    CursorPaginatorComponent,
    SetEditorComponent,
    ItemDirective,
    IssueLabelComponent,
    SetEditorDialogComponent,
    IssueItemComponent,
    UserItemComponent,
    IssueIconComponent,
    IssueSidebarComponent,
    CacheNodeComponent,
    ProjectHeaderComponent
  ],
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
    NgOptionHighlightModule,
    MatCheckboxModule,
    MatMenuModule
  ],
  exports: [
    CdkTableModule,
    CdkTreeModule,
    IssueGraphComponent,
    IssueGraphControlsComponent,
    IssueListComponent,
    SetEditorComponent,
    ItemDirective,
    IssueLabelComponent,
    IssueItemComponent,
    UserItemComponent,
    IssueIconComponent,
    IssueSidebarComponent,
    CursorPaginatorComponent,
    ProjectHeaderComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
  ]
})
export class GraphsModule {
}
