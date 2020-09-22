import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Apollo } from 'apollo-angular';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  port = 3000;
  host = 'http://localhost:' + this.port;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private apollo: Apollo) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    /*
    return this.http.post<any>(`${this.host}/login`, { username, password })
      .pipe(map(response => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', response.token);
        //tokenContent = jwt.decode(response.token);
        //this.currentUserSubject.next({username: tokenContent.name});
        this.currentUserSubject.next({username: "test"});
        return {username: "test"};
      }));
      */
     const currentUser = {username: 'test'};
     this.currentUserSubject.next(currentUser);
     return of(currentUser);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // reset the store after that
    this.apollo.client.resetStore();
    this.currentUserSubject.next(null);
  }
}

interface User {
  username: string;
}
