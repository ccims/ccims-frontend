import {Component} from '@angular/core';
import {StateService} from '@app/state.service';
import {Router} from '@angular/router';
import {UserNotifyService} from '@app/user-notify/user-notify.service';

/**
 * This component displays and manages the sidemenu showing
 * the name of the current project at the top. Beneath it
 * navigation points e.g. 'Graph' are displayed.
 */
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {
  readonly defaultMenuTitle = 'Menu';
  public menuTitle = this.defaultMenuTitle;
  overviewLink = ['/'];
  graphLink = ['/'];
  issuesLink = ['/'];
  membersLink = ['/'];

  constructor(public ss: StateService, public router: Router, public notify: UserNotifyService) {
    ss.state$.subscribe((appState) => {
      if (!appState.project) {
        return;
      }

      if (appState.project.node) {
        this.menuTitle = appState.project.node.name;
        this.overviewLink = ['/projects', appState.project.node.id];
        this.graphLink = ['/projects', appState.project.node.id, 'graph'];
        this.issuesLink = ['/projects', appState.project.node.id, 'issues'];
        this.membersLink = ['/projects', appState.project.node.id, 'members'];
      } else {
        this.router.navigate(['/']);
        notify.notifyError('The specified project does not exist!');
      }
    });
  }
}
