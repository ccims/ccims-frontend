import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {IssueLocation} from '../../../generated/graphql-dgql';

@Component({
  selector: 'app-issue-location',
  styleUrls: ['./issue-location.component.scss'],
  templateUrl: './issue-location.component.html'
})
export class IssueLocationComponent {
  @Input() projectId: string;
  @Input() location: IssueLocation;

  constructor(private router: Router) {
  }

  isComponent(): boolean {
    return (this.location as any).__typename === 'Component';
  }

  goToLocationDetails(): void {
    if (this.isComponent()) {
      this.router.navigate(['projects', this.projectId, 'component', this.location.id]);
    } else {
      this.router.navigate(['projects', this.projectId, 'interface', this.location.id]);
    }
  }
}
