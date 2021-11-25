import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './project-list-component/project-list.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { IssueDetailComponent } from './issue-detail/issue-detail.component';
import { IssueGraphControlsComponent } from './graphs/issue-graph-controls/issue-graph-controls.component';
import { LoginComponent } from './login/login.component';
import { FrameComponent } from './frame/frame.component';
import { AuthGuard } from './auth/auth.guard';
import { RegisterComponent } from './register/register.component';
import { ProjectIssueListComponent } from './project-issue-list/project-issue-list.component';
import { ProjectMembersComponent } from './project-members/project-members.component';
import { NodeDetailsPageComponent } from '@app/node-details-page/node-details-page.component';

const routes: Routes = [
  {
    path: '',
    component: FrameComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'projects', component: ProjectListComponent },
      {
        path: 'projects/:id',
        children: [
          { path: '', pathMatch: 'full', component: ProjectOverviewComponent },
          { path: 'graph', component: IssueGraphControlsComponent },
          {
            path: 'issues',
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: ProjectIssueListComponent,
              },
              {
                path: ':issueId',
                pathMatch: 'full',
                component: IssueDetailComponent,
              },
            ],
          },
          { path: 'members', component: ProjectMembersComponent },
          {
            path: 'component/:componentId',
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: NodeDetailsPageComponent,
              },
              {
                path: 'interface/:interfaceId',
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    component: NodeDetailsPageComponent,
                  },
                  {
                    path: 'component/:componentId/issue/:issueId',
                    pathMatch: 'full',
                    component: IssueDetailComponent,
                  },
                ],
              },
            ],
          },
          {
            path: 'interface/:interfaceId',
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: NodeDetailsPageComponent,
              },
            ],
          },
        ],
      },
      { path: 'issue', component: IssueDetailComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
