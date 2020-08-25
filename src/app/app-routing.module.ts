import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './project-list-component/project-list.component';
import { ProjectOverviewComponent  } from './project-overview/project-overview.component';
import { ComponentListComponent } from './component-list/component-list.component';
import { IssueDetailComponent } from './issue-detail/issue-detail.component';

const routes: Routes = [
  {path: '', redirectTo: 'issue', pathMatch: 'full'},
  // {path: 'home', component: HomeComponent},
  {path: 'projects', component: ProjectListComponent},
  {path: 'projects/:id', component: ProjectOverviewComponent},
  {path: 'components', component: ComponentListComponent},
  {path: 'issue', component: IssueDetailComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
