import {Component} from '@angular/core';
import {map, shareReplay} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, BehaviorSubject} from 'rxjs';
import {StateService} from '@app/state.service';
import {RouterOutlet} from '@angular/router';
import {slider} from '../route-animations';

/**
 * This component holds the 'frame' of the application
 * containing the top bar, the side bar and the main container
 * into which individual views are rendered based on the url.
 * It also bridges between top bar and side menu:
 *  When the user clicks the menu icon in the topbar, this is communicated to
 * the navigation drawer via this.showDrawer
 * The component itself checks whether the user is currently in a project
 * and passes this information down to the sidebar and topbar. It also checks the
 * display size and makes the side menu an overlay when on handset size.
 */
@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss'],
  animations: [slider]
})
export class FrameComponent {
  public isProjectSet$ = new BehaviorSubject<boolean>(false);
  public showDrawer = true;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  constructor(private breakpointObserver: BreakpointObserver, public ss: StateService) {
    ss.state$.pipe(map((state) => state.project != null)).subscribe(this.isProjectSet$);
  }

  /**
   * When user clicks sandwich this.showDrawer boolean changes value.
   */
  toggleMenu(): void {
    this.showDrawer = !this.showDrawer;
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
