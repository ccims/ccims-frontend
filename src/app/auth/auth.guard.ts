import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

/** AuthGuard is responsible for navigating the user to /login when he is not
 * currently logged in according to the AuthenticationsService. It's canActivate
 * method is automatically invoked by angular on routing events.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    /**
     * Redirects user to login if he is not authenticated.
     * @param route unused but required for CanActivate signature
     * @param state router state when guard was invoked, used to redirect the user after login
     * @returns true iff the user is logged in according to the AuthenticationService
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
