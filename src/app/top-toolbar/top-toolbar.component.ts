import { Component, Output, EventEmitter, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthenticationService } from '@app/auth/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from '@app/dialogs/settings-dialog/settings-dialog.component';

/**
 * This component is responsible for showing the top bar containing the home icon
 * on the left-hand side and the mock settings and user icon as well as the functional
 * log out button on the right-hand side. It does NOT determine whether to show the sandwich
 * menu icon itself, but gets this information passed from FrameComponent.
 */
@Component({
  selector: 'app-top-toolbar',
  templateUrl: './top-toolbar.component.html',
  styleUrls: ['./top-toolbar.component.scss']
})
export class TopToolbarComponent {
  @Input()
  showMenuButton = false;

  @Output()
  public menuClick = new EventEmitter();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public authService: AuthenticationService, private dialog: MatDialog,) { }

  public handleClick() {
    this.menuClick.emit();
  }

  public openSettingsDialog() {
    this.dialog.open(SettingsDialogComponent);
    console.log('setting dialog');
  }
}
