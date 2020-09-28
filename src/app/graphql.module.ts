import { NgModule } from '@angular/core';
import { APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS, NamedOptions } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/link-context';
import { onError } from '@apollo/client/link/error';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './auth/authentication.service';
import { environment } from '@environments/environment';
import { IndividualConfig, ToastrModule, ToastrService } from 'ngx-toastr';
import { DefaultOptions } from '@apollo/client/core/ApolloClient';

const defaultOptions: DefaultOptions = {
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  }
};

const networkErrorToast: Partial<IndividualConfig> = {
  timeOut: 5000,
  closeButton: true,
  positionClass: 'toast-top-center'
};

const basic = setContext((operation, context) => ({
  headers: {
    Accept: 'charset=utf-8'
  }
}));

export function createErrorLink(authService: AuthenticationService, toastr: ToastrService) {
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        console.log(`[Graphql errors]: ${graphQLErrors}`);
        switch (err.extensions.code) {
          case 'UNAUTHENTICATED':
            // error code is set to UNAUTHENTICATED
            // when AuthenticationError thrown in resolver
            /*
            // modify the operation context with a new token
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: getNewToken(),
              },
            });
            // retry the request, returning the new observable
            return forward(operation);
            */
            authService.logout(); break;
          default:
            console.log(`[Graphql errors]: ${graphQLErrors}`);
        }

      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      toastr.error('Server/Connection error', '', networkErrorToast);
      // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
  }
  );
  return errorLink;
}





export function provideDefaultApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const token = localStorage.getItem('token');

  const auth = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : ''
      }
    };
  });


  const link = ApolloLink.from([basic, auth, httpLink.create({ uri: environment.apiUrl })]);
  const cache = new InMemoryCache();
  return {
    link,
    cache,
    defaultOptions
  };
}

export function providePublicApollo(httpLink: HttpLink, authService: AuthenticationService, toastr: ToastrService): NamedOptions {
  const errorLink = createErrorLink(authService, toastr);
  const link = ApolloLink.from([basic, errorLink, httpLink.create({ uri: environment.signUpUrl })]);
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
  imports: [
    ToastrModule,
  ],
  exports: [
    HttpClientModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: provideDefaultApollo,
      deps: [HttpLink],
    },
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory: providePublicApollo,
      deps: [HttpLink,  AuthenticationService, ToastrService],
    }
  ],
})
export class GraphQLModule {
}
