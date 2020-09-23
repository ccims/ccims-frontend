import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/link-context';
import { onError } from '@apollo/client/link/error';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './auth/authentication.service';
import { environment } from '@environments/environment';


export function provideApollo(httpLink: HttpLink, authService: AuthenticationService): ApolloClientOptions<any> {

  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

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

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
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
      // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
  }
  );
  const link = ApolloLink.from([basic, auth, httpLink.create({ uri: environment.apiUrl })]);
  const cache = new InMemoryCache();
  return {
    link,
    cache
  };
}

@NgModule({
  exports: [
    HttpClientModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: provideApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
