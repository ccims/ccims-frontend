import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GetLabelsGQL, Label } from '../../../generated/graphql';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelStoreService {
  constructor(private getLabelsGQL: GetLabelsGQL) {}

  /**
   * Retrieve labels matching term.
   * @param projectId id of current project
   * @param term coming from search bar above graph
   * @returns observable emitting objects standing for labels that exist on backend
   * whoose name contains term
   */
  getMatchingLabels(projectId: string, term: string = null): Observable<FilterLabel[]> {
    if (!term) {
      return this.getAllFilter(projectId);
    }
    return this.getAllFilter(projectId).pipe(
      map((items) => items.filter((x) => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1))
    );
  }

  /**
   * Retrieve all labels from backend
   * @param projectId id of current project
   */
  private getAllFilter(projectId: string): Observable<FilterLabel[]> {
    return this.getLabelsGQL.fetch({ projectId }).pipe(map(({ data }) => data.node.labels.nodes));
  }
}

export type FilterLabel = Pick<Label, 'id' | 'name' | 'color'>;

export function isFilterLabel(label: any) {
  return 'id' in label && 'name' in label && 'color' in label;
}
