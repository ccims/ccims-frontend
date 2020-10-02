import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockProjectStoreService } from '@app/data/project/mock-project-store.service';
import { ProjectStoreService } from '@app/data/project/project-store.service';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {
  project: any;
  public projectId: string;

  constructor(private ps: MockProjectStoreService, private pss: ProjectStoreService, private route: ActivatedRoute) {



  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.project = this.pss.get(this.projectId).subscribe(project => this.project = project);
  }

}
interface Project {
  name: string;
  id: number;
}
