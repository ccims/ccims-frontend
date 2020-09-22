import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './project-list-component/project-list.component';
import { ProjectOverviewComponent  } from './project-overview/project-overview.component';
import { ComponentListComponent } from './component-list/component-list.component';
import { IssueDetailComponent } from './issue-detail/issue-detail.component';
import { IssueGraphControlsComponent } from './graphs/issue-graph-controls/issue-graph-controls.component';
import { LoginComponent } from './login/login.component';
import { FrameComponent } from './frame/frame.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path: '', component: FrameComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'projects', pathMatch: 'full'},
      {path: 'projects', component: ProjectListComponent},
      {path: 'projects/:id', component: ProjectOverviewComponent},
      {path: 'components', component: ComponentListComponent},
      {path: 'issue', component: IssueDetailComponent},
      // add github token in environment to make the component list work
      {path: 'components', component: ComponentListComponent},
      {path: 'graph', component: IssueGraphControlsComponent},
    ],
  },
  // {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  //{ path: 'register', component: RegisterComponent }
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
