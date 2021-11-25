import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  AddConsumedInterfaceGQL,
  GetIssueGraphDataForSearchGQL,
  GetIssueGraphDataGQL,
  IssueCategory,
  RemoveConsumedInterfaceGQL,
} from 'src/generated/graphql';
import { GraphData, GraphDataFactory } from './graph-data';
import { Observable } from 'rxjs';
import { SelectedCategories } from '@app/graphs/shared';
import { FilterLabel } from '../label/label-store.service';

/**
 * Responsible for retrieval and conversion of data needed for graph rendering from backend.
 *
 * @export
 * @class IssueGraphApiService
 */
@Injectable({
  providedIn: 'root',
})
export class IssueGraphApiService {
  constructor(
    private getFullIssueGraphDataQuery: GetIssueGraphDataGQL,
    private addConsumedInterfaceMutation: AddConsumedInterfaceGQL,
    private removeConsumedInterfaceMutation: RemoveConsumedInterfaceGQL,
    private getSearchIssueGraphDataQuery: GetIssueGraphDataForSearchGQL
  ) {}

  /**
   * Queries backend for data needed to render graph when given parameters restricting what information is requested.
   * This method handels the construction of the parameters to the graphql query,
   * and makes the query. To carry out the conversion from backend to frontend format,
   * it invokes GraphDataFactory.graphDataFromGQL
   * @param projectId
   * @param categories describes which issue categories (e.g. BUG) are of interest
   * @param labels a list of issue labels the user has entered into the query bar
   * @param texts a list of text fragments the user has entered into the query bar
   */
  loadIssueGraphData(
    projectId: string,
    categories: SelectedCategories,
    labels: FilterLabel[],
    texts: string[]
  ): Observable<GraphData> {
    const activeCategories: IssueCategory[] = [];
    for (const key of Object.values(IssueCategory)) {
      if (categories[key]) {
        activeCategories.push(key as IssueCategory);
      }
    }
    if (labels.length === 0 && texts.length === 0) {
      return this.getFullIssueGraphDataQuery
        .fetch({ projectId, activeCategories })
        .pipe(
          map((result) =>
            GraphDataFactory.removeFilteredData(
              GraphDataFactory.graphDataFromGQL(result.data),
              activeCategories
            )
          )
        );
    } else {
      const selectedLabels: string[] = labels.map((label) => label.id);
      const issueRegex = this.textsToRegex(texts);
      return this.getSearchIssueGraphDataQuery
        .fetch({ projectId, activeCategories, selectedLabels, issueRegex })
        .pipe(
          map((result) =>
            GraphDataFactory.removeFilteredData(
              GraphDataFactory.graphDataFromGQL(result.data),
              activeCategories
            )
          )
        );
    }
  }

  /**
   * Creates a regular expression denoting a language of the union of the strings in texts
   * @param texts
   * @example
   * textsToRegex(["newest issues", "test"]) == "(newest issues | test)""
   */
  textsToRegex(texts: string[]): string {
    if (texts.length === 0) {
      return undefined;
    }
    return texts.map((text) => '(' + text + ')').join('|');
  }

  /**
   * Make the interface with interfaceId a consumed interface of the component with id componentId
   * @param component
   * @param componentInterface
   */
  addConsumedInterface(component: string, componentInterface: string) {
    return this.addConsumedInterfaceMutation.mutate({
      input: { component, componentInterface },
    });
  }

  /**
   * Remove the interface with interfaceId from consumed interfaces of the component with id componentId
   * @param component
   * @param componentInterface
   */
  removeConsumedInterface(component: string, componentInterface: string) {
    return this.removeConsumedInterfaceMutation.mutate({
      input: { component, componentInterface },
    });
  }
}
