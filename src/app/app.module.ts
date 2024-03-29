import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {ProjectListComponent} from './project-list-component/project-list.component';
import {ProjectOverviewComponent} from './project-overview/project-overview.component';
import {TopToolbarComponent} from './top-toolbar/top-toolbar.component';
import {SideNavComponent} from './side-nav/side-nav.component';
import {GraphQLModule} from './graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {IssueDetailComponent} from './issue-detail/issue-detail.component';
import {GraphsModule} from './graphs/graphs.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NZ_ICONS} from 'ng-zorro-antd/icon';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {IconDefinition} from '@ant-design/icons-angular';
import {CommonModule, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {LoginComponent} from './login/login.component';
import {FrameComponent} from './frame/frame.component';
import {RegisterComponent} from './register/register.component';
import {CreateProjectDialogComponent} from 'src/app/dialogs/create-project-dialog/create-project-dialog.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {GlobalConfig, ToastrModule} from 'ngx-toastr';
import {RemoveDialogComponent} from './dialogs/remove-dialog/remove-dialog.component';
import {CreateComponentDialogComponent} from './dialogs/create-component-dialog/create-component-dialog.component';
import {CreateInterfaceDialogComponent} from './dialogs/create-interface-dialog/create-interface-dialog.component';
import {CreateIssueDialogComponent} from './dialogs/create-issue-dialog/create-issue-dialog.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgOptionHighlightModule} from '@ng-select/ng-option-highlight';
import {ColorPickerModule} from 'ngx-color-picker';
import {CreateEditLabelDialogComponent} from '@app/dialogs/create-label-dialog/create-edit-label-dialog.component';
import {RemoveProjectMemberComponentComponent} from './dialogs/remove-project-member-component/remove-project-member-component.component';
import {PortalModule} from '@angular/cdk/portal';
import {ComponentContextMenuComponent} from '@app/graphs/component-context-menu/component-context-menu.component';
import {NodeDetailsComponent} from '@app/node-details/node-details.component';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {MarkdownEditorComponent} from './markdown/markdown-editor/markdown-editor.component';
import {MarkdownModule} from 'ngx-markdown';
import {MarkdownPreviewComponent} from './markdown/markdown-preview/markdown-preview.component';
import {TimelineComponent} from './issue-detail/timeline/timeline.component';
import {CommentComponent} from './issue-detail/comment/comment.component';
import {NodeDetailsPageComponent} from '@app/node-details-page/node-details-page.component';
import {TextDisplayComponent} from '@app/text-display/text-display.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {IssueContentsComponent} from '@app/issue-detail/issue-contents.component';
import {LinkedIssueItemComponent} from '@app/issue-detail/linked-issue-item.component';
import {SettingsDialogComponent} from '@app/dialogs/settings-dialog/settings-dialog.component';
import {ProfileSettingsDialogComponent} from './dialogs/profile-settings-dialog/profile-settings-dialog.component';
import {AccessTokenDialogComponent} from './dialogs/access-token-dialog/access-token-dialog.component';
import {
  TimelineCoalescedItemsDirective,
  TimelineItemComponent,
  TimelineItemDeletedDirective,
  TimelineSingleItemDirective
} from '@app/issue-detail/timeline/coalesced/timeline-item.component';
import {TimelineEventClosedComponent} from '@app/issue-detail/timeline/items/timeline-event-closed.component';
import {TimelineEventAssignedComponent} from '@app/issue-detail/timeline/items/timeline-event-assigned.component';
import {TimelineEventDueDateChangedComponent} from '@app/issue-detail/timeline/items/timeline-event-due-date-changed.component';
import {TimelineEventEstimatedTimeChangedComponent} from '@app/issue-detail/timeline/items/timeline-event-estimated-time-changed.component';
import {TimelineEventLabelledComponent} from '@app/issue-detail/timeline/items/timeline-event-labelled.component';
import {TimelineEventDeletedIssueCommentComponent} from '@app/issue-detail/timeline/items/timeline-event-deleted-issue-comment.component';
import {TimelineEventMarkedDuplicateComponent} from '@app/issue-detail/timeline/items/timeline-event-marked-duplicate.component';
import {TimelineEventLinkComponent} from '@app/issue-detail/timeline/items/timeline-event-link.component';
import {TimelineEventPinnedComponent} from '@app/issue-detail/timeline/items/timeline-event-pinned.component';
import {TimelineEventReferencedByIssueComponent} from '@app/issue-detail/timeline/items/timeline-event-referenced-by-issue.component';
import {TimelineEventPriorityChangedComponent} from '@app/issue-detail/timeline/items/timeline-event-priority-changed.component';
import {TimelineEventRemovedFromComponentComponent} from '@app/issue-detail/timeline/items/timeline-event-removed-from-component.component';
import {TimelineEventReferencedByOtherComponent} from '@app/issue-detail/timeline/items/timeline-event-referenced-by-other.component';
import {TimelineEventRemovedFromLocationComponent} from '@app/issue-detail/timeline/items/timeline-event-removed-from-location.component';
import {TimelineEventReopenedComponent} from '@app/issue-detail/timeline/items/timeline-event-reopened.component';
import {TimelineEventStartDateChangedComponent} from '@app/issue-detail/timeline/items/timeline-event-start-date-changed.component';
import {TimelineEventUnassignedComponent} from '@app/issue-detail/timeline/items/timeline-event-unassigned.component';
import {TimelineEventRenamedComponent} from '@app/issue-detail/timeline/items/timeline-event-renamed.component';
import {TimelineEventUnlabelledComponent} from '@app/issue-detail/timeline/items/timeline-event-unlabelled.component';
import {TimelineEventWasLinkedComponent} from '@app/issue-detail/timeline/items/timeline-event-was-linked.component';
import {TimelineEventUnmarkedDuplicateComponent} from '@app/issue-detail/timeline/items/timeline-event-unmarked-duplicate.component';
import {TimelineEventWasUnlinkedComponent} from '@app/issue-detail/timeline/items/timeline-event-was-unlinked.component';
import {TimelineEventUnpinnedComponent} from '@app/issue-detail/timeline/items/timeline-event-unpinned.component';
import {TimelineEventUnlinkComponent} from '@app/issue-detail/timeline/items/timeline-event-unlink.component';
import {TimelineEventAddedArtifactComponent} from '@app/issue-detail/timeline/items/timeline-event-added-artifact.component';
import {TimelineEventRemovedArtifactComponent} from '@app/issue-detail/timeline/items/timeline-event-removed-artifact.component';
import {TimelineEventAddedNfcComponent} from '@app/issue-detail/timeline/items/timeline-event-added-nfc.component';
import {TimelineEventRemovedNfcComponent} from '@app/issue-detail/timeline/items/timeline-event-removed-nfc.component';
import {TimelineEventAddedToComponentComponent} from '@app/issue-detail/timeline/items/timeline-event-added-to-component.component';
import {TimelineEventCategoryChangedComponent} from '@app/issue-detail/timeline/items/timeline-event-category-changed.component';
import {TimelineEventAddedToLocationComponent} from '@app/issue-detail/timeline/items/timeline-event-added-to-location.component';

registerLocaleData(en);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

// configuration for toasts, the toastrservice is configured in graphql.module.ts
const toasterConfig: Partial<GlobalConfig> = {
  maxOpened: 4,
  autoDismiss: true
};

@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    ProjectOverviewComponent,
    TopToolbarComponent,
    SideNavComponent,
    IssueDetailComponent,
    LoginComponent,
    FrameComponent,
    RegisterComponent,
    CreateProjectDialogComponent,
    RemoveDialogComponent,
    CreateComponentDialogComponent,
    CreateInterfaceDialogComponent,
    CreateIssueDialogComponent,
    CreateEditLabelDialogComponent,
    RemoveProjectMemberComponentComponent,
    ComponentContextMenuComponent,
    NodeDetailsComponent,
    NodeDetailsPageComponent,
    MarkdownEditorComponent,
    MarkdownPreviewComponent,
    TimelineComponent,
    CommentComponent,
    TextDisplayComponent,
    IssueContentsComponent,
    LinkedIssueItemComponent,
    SettingsDialogComponent,
    ProfileSettingsDialogComponent,
    AccessTokenDialogComponent,
    TimelineItemComponent,
    TimelineSingleItemDirective,
    TimelineCoalescedItemsDirective,
    TimelineItemDeletedDirective,
    TimelineEventClosedComponent,
    TimelineEventAssignedComponent,
    TimelineEventDueDateChangedComponent,
    TimelineEventEstimatedTimeChangedComponent,
    TimelineEventLabelledComponent,
    TimelineEventDeletedIssueCommentComponent,
    TimelineEventMarkedDuplicateComponent,
    TimelineEventLinkComponent,
    TimelineEventPinnedComponent,
    TimelineEventReferencedByIssueComponent,
    TimelineEventPriorityChangedComponent,
    TimelineEventRemovedFromComponentComponent,
    TimelineEventReferencedByOtherComponent,
    TimelineEventRemovedFromLocationComponent,
    TimelineEventReopenedComponent,
    TimelineEventStartDateChangedComponent,
    TimelineEventRenamedComponent,
    TimelineEventUnassignedComponent,
    TimelineEventUnlabelledComponent,
    TimelineEventWasLinkedComponent,
    TimelineEventUnmarkedDuplicateComponent,
    TimelineEventWasUnlinkedComponent,
    TimelineEventUnpinnedComponent,
    TimelineEventUnlinkComponent,
    TimelineEventAddedArtifactComponent,
    TimelineEventRemovedArtifactComponent,
    TimelineEventAddedNfcComponent,
    TimelineEventRemovedNfcComponent,
    TimelineEventAddedToComponentComponent,
    TimelineEventCategoryChangedComponent,
    TimelineEventAddedToLocationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(toasterConfig),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSlideToggleModule,
    GraphQLModule,
    HttpClientModule,
    GraphsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgSelectModule,
    CommonModule,
    NgOptionHighlightModule,
    ColorPickerModule,
    MatExpansionModule,
    PortalModule,
    MonacoEditorModule.forRoot(),
    MarkdownModule.forRoot(),
    MatButtonToggleModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {provide: NZ_I18N, useValue: en_US},
    {provide: NZ_ICONS, useValue: icons}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
