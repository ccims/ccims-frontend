import { Injectable } from '@angular/core';
import { CurrentUserGQL, SearchUsersGQL } from 'src/generated/graphql-dgql';
import { promisifyApolloFetch } from '@app/data-dgql/queries/util';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private qSearchUsers: SearchUsersGQL,
    private qCurrentUser: CurrentUserGQL
  ) {}

  searchUsers(filter: { username: string }) {
    let query = '';
    // The searchUser query is special in that it does not use a filter object.
    // However, this is not compatible with the rest of our API, which uses UserFilter
    // (e.g. issue assignees).
    // Hence, this function uses the username search field, even though this is technically
    // incorrect (searchUsers will also search by display name).
    if (filter) {
      query = filter.username;
    }

    if (!query) {
      // searchUser does not work without a search string
      return Promise.resolve([]);
    }

    return promisifyApolloFetch(this.qSearchUsers.fetch({ query })).then(
      (data) => data.searchUser
    );
  }

  currentUser() {
    return promisifyApolloFetch(this.qCurrentUser.fetch());
  }
}
