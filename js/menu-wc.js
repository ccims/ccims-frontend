'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ccims documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter additional">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#additional-pages"'
                            : 'data-target="#xs-additional-pages"' }>
                            <span class="icon ion-ios-book"></span>
                            <span>Additional documentation</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="additional-pages"' : 'id="xs-additional-pages"' }>
                                    <li class="link ">
                                        <a href="additional-documentation/using-gropius.html" data-type="entity-link" data-context-id="additional">Using Gropius</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/managing-gropius.html" data-type="entity-link" data-context-id="additional">Managing Gropius</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/contributors.html" data-type="entity-link" data-context-id="additional">Contributors</a>
                                    </li>
                        </ul>
                    </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-6dcc730bdf7a147c3fb35aec267e0bcb"' : 'data-target="#xs-components-links-module-AppModule-6dcc730bdf7a147c3fb35aec267e0bcb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-6dcc730bdf7a147c3fb35aec267e0bcb"' :
                                            'id="xs-components-links-module-AppModule-6dcc730bdf7a147c3fb35aec267e0bcb"' }>
                                            <li class="link">
                                                <a href="components/AccessTokenDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccessTokenDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CommentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ComponentContextMenuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ComponentContextMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateComponentDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateComponentDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateEditLabelDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateEditLabelDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateInterfaceDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateInterfaceDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateIssueDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateIssueDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateProjectDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateProjectDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FrameComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FrameComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IssueContentsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueContentsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IssueDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LinkedIssueItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LinkedIssueItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MarkdownEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MarkdownEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MarkdownPreviewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MarkdownPreviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NodeDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NodeDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NodeDetailsPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NodeDetailsPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileSettingsDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileSettingsDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectOverviewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectOverviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RemoveDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RemoveDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RemoveProjectMemberComponentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RemoveProjectMemberComponentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SideNavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SideNavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TextDisplayComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TextDisplayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimelineComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimelineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimelineItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimelineItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TopToolbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TopToolbarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-AppModule-6dcc730bdf7a147c3fb35aec267e0bcb"' : 'data-target="#xs-directives-links-module-AppModule-6dcc730bdf7a147c3fb35aec267e0bcb"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-6dcc730bdf7a147c3fb35aec267e0bcb"' :
                                        'id="xs-directives-links-module-AppModule-6dcc730bdf7a147c3fb35aec267e0bcb"' }>
                                        <li class="link">
                                            <a href="directives/TimelineCoalescedItemsDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimelineCoalescedItemsDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/TimelineItemDeletedDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimelineItemDeletedDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/TimelineSingleItemDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimelineSingleItemDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GraphQLModule.html" data-type="entity-link" >GraphQLModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GraphsModule.html" data-type="entity-link" >GraphsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GraphsModule-6b5cfafbb72be9879be28832f1207a7a"' : 'data-target="#xs-components-links-module-GraphsModule-6b5cfafbb72be9879be28832f1207a7a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GraphsModule-6b5cfafbb72be9879be28832f1207a7a"' :
                                            'id="xs-components-links-module-GraphsModule-6b5cfafbb72be9879be28832f1207a7a"' }>
                                            <li class="link">
                                                <a href="components/AddProjectMemberDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddProjectMemberDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CacheNodeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CacheNodeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CursorPaginatorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CursorPaginatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IssueCategoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueCategoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IssueFilterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueFilterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IssueGraphComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IssueGraphControlsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueGraphControlsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IssueIconComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueIconComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IssueItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IssueLabelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueLabelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IssueListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IssueLocationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueLocationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IssueSidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueSidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LabelSearchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LabelSearchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectHeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectHeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectIssueListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectIssueListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectMembersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectMembersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QueryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SetEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SetEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SetEditorDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SetEditorDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserItemComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-GraphsModule-6b5cfafbb72be9879be28832f1207a7a"' : 'data-target="#xs-directives-links-module-GraphsModule-6b5cfafbb72be9879be28832f1207a7a"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-GraphsModule-6b5cfafbb72be9879be28832f1207a7a"' :
                                        'id="xs-directives-links-module-GraphsModule-6b5cfafbb72be9879be28832f1207a7a"' }>
                                        <li class="link">
                                            <a href="directives/ItemDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ItemDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/QueryBodyDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueryBodyDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/QueryButtonDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueryButtonDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ComponentContextMenuComponent.html" data-type="entity-link" >ComponentContextMenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreateEditLabelDialogComponent.html" data-type="entity-link" >CreateEditLabelDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CursorPaginatorComponent.html" data-type="entity-link" >CursorPaginatorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IssueCategoryComponent.html" data-type="entity-link" >IssueCategoryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IssueContentsComponent.html" data-type="entity-link" >IssueContentsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IssueFilterComponent.html" data-type="entity-link" >IssueFilterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IssueIconComponent.html" data-type="entity-link" >IssueIconComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IssueItemComponent.html" data-type="entity-link" >IssueItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IssueLabelComponent.html" data-type="entity-link" >IssueLabelComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IssueListComponent.html" data-type="entity-link" >IssueListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IssueLocationComponent.html" data-type="entity-link" >IssueLocationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IssueSidebarComponent.html" data-type="entity-link" >IssueSidebarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LinkedIssueItemComponent.html" data-type="entity-link" >LinkedIssueItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NodeDetailsComponent.html" data-type="entity-link" >NodeDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NodeDetailsPageComponent.html" data-type="entity-link" >NodeDetailsPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProjectHeaderComponent.html" data-type="entity-link" >ProjectHeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProjectIssueListComponent.html" data-type="entity-link" >ProjectIssueListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProjectMembersComponent.html" data-type="entity-link" >ProjectMembersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/QueryComponent.html" data-type="entity-link" >QueryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SetEditorComponent.html" data-type="entity-link" >SetEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SetEditorDialogComponent.html" data-type="entity-link" >SetEditorDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SettingsDialogComponent.html" data-type="entity-link" >SettingsDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TextDisplayComponent.html" data-type="entity-link" >TextDisplayComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TimelineItemComponent.html" data-type="entity-link" >TimelineItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserItemComponent.html" data-type="entity-link" >UserItemComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#directives-links"' :
                                'data-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/QueryBodyDirective.html" data-type="entity-link" >QueryBodyDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/QueryButtonDirective.html" data-type="entity-link" >QueryButtonDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/TimelineCoalescedItemsDirective.html" data-type="entity-link" >TimelineCoalescedItemsDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/TimelineItemDeletedDirective.html" data-type="entity-link" >TimelineItemDeletedDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/TimelineSingleItemDirective.html" data-type="entity-link" >TimelineSingleItemDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CCIMSValidators.html" data-type="entity-link" >CCIMSValidators</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataList.html" data-type="entity-link" >DataList</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataNode.html" data-type="entity-link" >DataNode</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataQuery.html" data-type="entity-link" >DataQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphComponent.html" data-type="entity-link" >GraphComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphDataFactory.html" data-type="entity-link" >GraphDataFactory</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphInterface.html" data-type="entity-link" >GraphInterface</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphIssue.html" data-type="entity-link" >GraphIssue</a>
                            </li>
                            <li class="link">
                                <a href="classes/IssueGroupContainerBehaviour.html" data-type="entity-link" >IssueGroupContainerBehaviour</a>
                            </li>
                            <li class="link">
                                <a href="classes/IssueGroupContainerParentBehaviour.html" data-type="entity-link" >IssueGroupContainerParentBehaviour</a>
                            </li>
                            <li class="link">
                                <a href="classes/LayoutNode.html" data-type="entity-link" >LayoutNode</a>
                            </li>
                            <li class="link">
                                <a href="classes/MultiSourceList.html" data-type="entity-link" >MultiSourceList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Mutations.html" data-type="entity-link" >Mutations</a>
                            </li>
                            <li class="link">
                                <a href="classes/NodeCache.html" data-type="entity-link" >NodeCache</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeFormatter.html" data-type="entity-link" >TimeFormatter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Vector.html" data-type="entity-link" >Vector</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link" >AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ComponentContextMenuService.html" data-type="entity-link" >ComponentContextMenuService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ComponentsService.html" data-type="entity-link" >ComponentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ComponentStoreService.html" data-type="entity-link" >ComponentStoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataService.html" data-type="entity-link" >DataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InterfaceStoreService.html" data-type="entity-link" >InterfaceStoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IssueGraphApiService.html" data-type="entity-link" >IssueGraphApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IssueGraphClassSettersService.html" data-type="entity-link" >IssueGraphClassSettersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IssueGraphDynamicTemplateRegistryService.html" data-type="entity-link" >IssueGraphDynamicTemplateRegistryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IssueGraphLinkHandlesService.html" data-type="entity-link" >IssueGraphLinkHandlesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IssueGraphStateService.html" data-type="entity-link" >IssueGraphStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IssuesService.html" data-type="entity-link" >IssuesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IssueStoreService.html" data-type="entity-link" >IssueStoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LabelStoreService.html" data-type="entity-link" >LabelStoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectsService.html" data-type="entity-link" >ProjectsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectStoreService.html" data-type="entity-link" >ProjectStoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QueriesService.html" data-type="entity-link" >QueriesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StateService.html" data-type="entity-link" >StateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserNotifyService.html" data-type="entity-link" >UserNotifyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AppState.html" data-type="entity-link" >AppState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CoalescedTimelineItem.html" data-type="entity-link" >CoalescedTimelineItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ComponentContextMenuData.html" data-type="entity-link" >ComponentContextMenuData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ComponentNode.html" data-type="entity-link" >ComponentNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateComponentData.html" data-type="entity-link" >CreateComponentData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateEditLabelDialogData.html" data-type="entity-link" >CreateEditLabelDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateInterfaceData.html" data-type="entity-link" >CreateInterfaceData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData-1.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterSelection.html" data-type="entity-link" >FilterSelection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterState.html" data-type="entity-link" >FilterState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphData.html" data-type="entity-link" >GraphData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InterfaceNode.html" data-type="entity-link" >InterfaceNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IssueFolderNode.html" data-type="entity-link" >IssueFolderNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IssueGroupContainerNode.html" data-type="entity-link" >IssueGroupContainerNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IssueNode.html" data-type="entity-link" >IssueNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListId.html" data-type="entity-link" >ListId</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListParams.html" data-type="entity-link" >ListParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NodeId.html" data-type="entity-link" >NodeId</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Position.html" data-type="entity-link" >Position</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Positions.html" data-type="entity-link" >Positions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueryListParams.html" data-type="entity-link" >QueryListParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RelationEdge.html" data-type="entity-link" >RelationEdge</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SetEditorDialogData.html" data-type="entity-link" >SetEditorDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SetMultiSource.html" data-type="entity-link" >SetMultiSource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TextFragment.html" data-type="entity-link" >TextFragment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/userMock.html" data-type="entity-link" >userMock</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});