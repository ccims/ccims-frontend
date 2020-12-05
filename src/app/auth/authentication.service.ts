import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '@environments/environment';

import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
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

  login(username: string, password: string): Observable<User> {
    return this.http.post<any>(environment.loginUrl, { username, password })
      .pipe(map(response => {
        console.log(response);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', response.token);
        const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
        const user = { name: tokenPayload.name, id: tokenPayload.sub };
        this.saveUserToStorage(user);
        this.currentUserSubject.next(user);
        return user;
      }));
    /*
const currentUser = {username: 'test'};
localStorage.setItem('currentUser', JSON.stringify(currentUser));
this.currentUserSubject.next(currentUser);
return of(currentUser);
*/
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['login']);
    // reset the store after that
    // this.apollo.client.resetStore();
    this.currentUserSubject.next(null);
  }
}

interface User {
  name: string;
  id: string;
}
