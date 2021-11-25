import { Observable } from 'rxjs';

/**
 * Apollo's GraphQL fetch method returns an Observable even though we only ever see one update
 * emitted from it.
 *
 * Hence, we just convert it to a promise here.
 *
 * @param f the observable
 * @return a promise that resolves as soon as the observable emits an update
 */
export function promisifyApolloFetch<T>(f: Observable<{ data?: T }>): Promise<T> {
  return new Promise((resolve, reject) => {
    f.subscribe(
      ({ data }) => resolve(data),
      (error) => reject(error)
    );
  });
}

/**
 * Generic interface for backend list parameters.
 * This represents the actual data sent in the request, as our representation in the frontend
 * differs slightly (see {@link ListParams}).
 */
export interface QueryListParams<F> {
  after?: string;
  before?: string;
  filterBy?: F;
  first?: number;
  last?: number;
}
