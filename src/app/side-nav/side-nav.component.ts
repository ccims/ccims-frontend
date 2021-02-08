import { Component } from '@angular/core';
import { StateService } from '@app/state.service';

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

  constructor(public ss: StateService) {
    ss.state$.subscribe(appState => {
      this.menuTitle = (appState.project != null) ? appState.project.name : this.defaultMenuTitle;
    });
  }

}
