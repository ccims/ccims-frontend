import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';

/**
 * Responsible for saving user name, id and jwt token in localstorage
 * and exposing the name and id through currentUserSubject
 */
@Injectable({providedIn: 'root'})
export class AuthenticationService {
  readonly userStorageKey = 'currentUser';
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(this.fetchUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  fetchUserFromStorage(): User {
    return JSON.parse(localStorage.getItem(this.userStorageKey));
  }

  saveUserToStorage(user: User): void {
    localStorage.setItem(this.userStorageKey, JSON.stringify(user));
  }

  /**
   * If login is sucessfull save the user name, id and jwt token to local storage and expose the name and id
   * through currentUserSubject. If the login fails the returned observable errors.
   * @param username provided by user to LoginComponent
   * @param password provided by user to LoginComponent
   * @returns the logged in user, errors if login is not successful
   */
  login(username: string, password: string): Observable<User> {
    return this.http.post<any>(environment.loginUrl, {username, password}).pipe(
      map((response) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', response.token);
        const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
        const user = {name: tokenPayload.name, id: tokenPayload.sub};
        this.saveUserToStorage(user);
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  /**
   * remove user from local storage and set subject holding the current user to null
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['login']);
    this.currentUserSubject.next(null);
  }
}

interface User {
  name: string;
  id: string;
}
