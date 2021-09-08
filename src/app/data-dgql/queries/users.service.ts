import { Injectable } from '@angular/core';
import {
  SearchUsersGQL
} from 'src/generated/graphql-dgql';
import { promisifyApolloFetch, QueryListParams } from '@app/data-dgql/queries/util';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private qSearchUsers: SearchUsersGQL,
  ) {}

  searchUsers(filter: string | { username: string }) {
    let query = '';
    // filter accepts an object for compatibility with UserFilter
    // FIXME: this is not very elegant of a solution
    if (typeof filter === 'string') {
      query = filter;
    } else if (filter) {
      query = filter.username;
    }

    if (!query) {
      // searchUser does not work without a search string
      return Promise.resolve([]);
    }

    return promisifyApolloFetch(this.qSearchUsers.fetch({ query })).then(data => data.searchUser);
  }
}
