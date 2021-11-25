import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NodeDetailsType } from '@app/node-details/node-details.component';

@Component({
  templateUrl: './node-details-page.component.html',
  styleUrls: ['./node-details-page.component.scss'],
})
export class NodeDetailsPageComponent implements OnInit {
  nodeType: NodeDetailsType = null;
  nodeId: string = null;
  projectId: string = null;

  constructor(
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    const componentId = this.route.snapshot.paramMap.get('componentId');
    const interfaceId = this.route.snapshot.paramMap.get('interfaceId');

    if (componentId !== null) {
      this.nodeId = componentId;
      this.nodeType = NodeDetailsType.Component;
    } else if (interfaceId !== null) {
      this.nodeId = interfaceId;
      this.nodeType = NodeDetailsType.Interface;
    }
    this.changeDetector.detectChanges();
  }

  onNodeUpdate(deleted: boolean): void {
    if (deleted) {
      this.router.navigate(['/projects/' + this.projectId + '/graph']);
    }
  }
}
