import { Observable } from 'rxjs';

// FIXME: why is this an observable? during runtime, we only ever observe one update emitted from
//  the observable, yet the Apollo API uses this everywhere
// TODO: investigate
export function promisifyApolloFetch<T>(f: Observable<{ data?: T }>): Promise<T> {
  return new Promise((resolve, reject) => {
    f.subscribe(({ data }) => resolve(data), error => reject(error));
  });
}

export interface QueryListParams<F> {
  after?: string;
  before?: string;
  filterBy?: F;
  first?: number;
  last?: number;
}
