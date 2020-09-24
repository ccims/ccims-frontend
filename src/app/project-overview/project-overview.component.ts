import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockProjectStoreService } from '@app/data/project/mock-project-store.service';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {
  project: Project;
  constructor(private ps: MockProjectStoreService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.project = this.ps.getSingle(id);
  }

}
interface Project {
  name: string;
  id: number;
}
