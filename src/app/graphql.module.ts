import {NgModule} from '@angular/core';
import {APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS, NamedOptions} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {setContext} from '@apollo/link-context';
import {onError} from '@apollo/client/link/error';
import {HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from './auth/authentication.service';
import {environment} from '@environments/environment';
import {IndividualConfig, ToastrModule, ToastrService} from 'ngx-toastr';
import {DefaultOptions} from '@apollo/client/core/ApolloClient';

/**
 * This modules purpose is to provide define functions returning configurations
 * for the automatic creation of ApolloClients for graphql communication with the backend.
 * The key functions are providePublicApollo and provideDefaultApollo. The apollo instance
 * constructed from providePublicApollo is only used for registering.
 */

const defaultOptions: DefaultOptions = {
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
};

/**
 * Congiuration for network error toast on register page.
 */
const networkErrorToast: Partial<IndividualConfig> = {
  timeOut: 5000,
  closeButton: true,
  positionClass: 'toast-top-center',
  enableHtml: true
};

const basic = setContext((operation, context) => ({
  headers: {
    Accept: 'charset=utf-8'
  }
}));

export function createErrorLink(authService: AuthenticationService, toastr: ToastrService): ApolloLink {
  const errorLink = onError(({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
      const message = graphQLErrors.map((err) => err.message).join('<br>');
      console.error(`[Graphql errors]: ${message}`);
      toastr.error(message, 'GraphQL error', networkErrorToast);
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError.name}\n${networkError.message}\n${networkError.stack}`);
      // @ts-ignore
      if (networkError.status === 401) {
        authService.logout();
      } else {
        toastr.error(networkError.message, 'Server/Connection error', networkErrorToast);
      }
    }
  });
  return errorLink;
}

/**
 * Create Apollo instance where credentials from local storage are attached to requests
 * @param httpLink
 * @param authService
 * @param toastr
 */
export function provideDefaultApollo(
  httpLink: HttpLink,
  authService: AuthenticationService,
  toastr: ToastrService
): ApolloClientOptions<any> {
  const token = localStorage.getItem('token');
  const auth = setContext((_, {headers}) => {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
      }
    };
  });
  const errorLink = createErrorLink(authService, toastr);
  const link = ApolloLink.from([basic, errorLink, auth, httpLink.create({uri: environment.apiUrl})]);
  const cache = new InMemoryCache();
  return {link, cache, defaultOptions};
}

/**
 * Creates Apollo Client used for user registration with public endpoint. In contrast to
 * provideDefaultApollo no token is attached to reqeusts.
 * @param httpLink
 * @param authService
 * @param toastr
 */
export function providePublicApollo(httpLink: HttpLink, authService: AuthenticationService, toastr: ToastrService): NamedOptions {
  const errorLink = createErrorLink(authService, toastr);
  const link = ApolloLink.from([basic, errorLink, httpLink.create({uri: environment.signUpUrl})]);
  const cache = new InMemoryCache();
  return {
    publicClient: {
      link,
      cache,
      defaultOptions
    }
  };
}

@NgModule({
  imports: [ToastrModule],
  exports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: provideDefaultApollo,
      deps: [HttpLink, AuthenticationService, ToastrService]
    },
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory: providePublicApollo,
      deps: [HttpLink, AuthenticationService, ToastrService]
    }
  ]
})
export class GraphQLModule {}
