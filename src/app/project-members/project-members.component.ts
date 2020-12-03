import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import { GetFullProjectQuery } from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AddProjectMemberDialogComponent } from '@app/dialogs/add-project-member-dialog/add-project-member-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-project-members',
  templateUrl: './project-members.component.html',
  styleUrls: ['./project-members.component.scss']
})
export class ProjectMembersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public projectId: string;
  public project$: Observable<GetFullProjectQuery>;
  public project: GetFullProjectQuery;
  validationFilter = new FormControl('');

  columnsToDisplay = ['Name', 'Role', 'email', 'Actions'];
  dataSource: MatTableDataSource<any>;
  mockUsers: Array<userMock> = [{id: '1', displayName: 'User1', email: 'User1.de'}, {id: '2', displayName: 'User2', email: 'User2.de'},
                                {id: '3', displayName: 'User3', email: 'User3.de'}];
  addableUsers: Array<userMock> = [{id: '4', displayName: 'AddedUser1', email: 'AddedUser1.de'},
                                  {id: '5', displayName: 'AddedUser2', email: 'AddedUser2.de'},
                                  {id: '6', displayName: 'AddedUser3', email: 'AddedUser3.de'},
                                  {id: '7', displayName: 'AddedUser4', email: 'AddedUser4.de'},
                                  {id: '8', displayName: 'AddedUser5', email: 'AddedUser5.de'},
                                  {id: '9', displayName: 'AddedUser6', email: 'AddedUser6.de'},
                                   ];
  constructor(private dialog: MatDialog, private projectStore: ProjectStoreService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.project$ = this.projectStore.getFullProject(this.projectId);
    this.project$.subscribe(project => {
      this.project = project;
      // MOCK
      project.node.users.nodes.forEach(u => this.mockUsers.push(u));
      this.dataSource = new MatTableDataSource<any>(this.mockUsers);
      // MOCK
      // this.dataSource = new MatTableDataSource<any>(project.node.users.nodes);
      this.sort.sort(({ id: 'Name', start: 'asc'}) as MatSortable);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  onAddClick(){
    const addMemberDialogRef = this.dialog.open(AddProjectMemberDialogComponent,
      { data: { addableMembers: this.addableUsers, projectId: this.projectId} });
    addMemberDialogRef.afterClosed().subscribe(data => {
        if (data){
          // this.updateTable();
          for (const user of data.usersToAdd){
            this.addableUsers.forEach(addableUser => {
              if (addableUser.id == user){
                this.mockUsers.push(addableUser);
              }
            });

          }
          this.dataSource = new MatTableDataSource<any>(this.mockUsers);
          console.log(this.mockUsers);

        }
        });

  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  clickedOnRow(rowData){

  }

}
export interface userMock{
  id: string;
  displayName?: string;
  username?: string;
  email?: string;

}

