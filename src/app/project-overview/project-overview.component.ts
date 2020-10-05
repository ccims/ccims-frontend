import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockProjectStoreService } from '@app/data/project/mock-project-store.service';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import { Interface } from 'readline';


@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {
  //@Input() public project: any;
  public project: any;

  public projectId: string;

  constructor(private projectStoreService: ProjectStoreService, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.project = this.projectStoreService.getFullProject(this.projectId).subscribe(project => {this.project = project;
    });

  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

  }
}
 interface CurrentProject {
  name?: string;
  id?: string;
  description?: string;

};
