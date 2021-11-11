import {Component, Input} from '@angular/core';

/**
 * This component displays the name and the id of a project
 */
@Component({
  selector: 'app-project-header',
  templateUrl: './project-header.component.html',
  styleUrls: ['./project-header.component.scss']
})
export class ProjectHeaderComponent {
  @Input() projectName: string;
  @Input() projectId: string;
}

