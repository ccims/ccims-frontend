import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  AddConsumedInterfaceGQL, GetIssueGraphDataGQL, IssueCategory,
  RemoveConsumedInterfaceGQL, GetIssueGraphDataForSearchGQL
} from 'src/generated/graphql';
import { GraphData, GraphDataFactory } from './graph-data';
import { Observable } from 'rxjs';
import { SelectedCategories } from '@app/graphs/shared';
import { FilterLabel } from '../label/label-store.service';

@Injectable({
  providedIn: 'root'
})
export class IssueGraphApiService {

  constructor(private getFullIssueGraphDataQuery: GetIssueGraphDataGQL,
              private addConsumedInterfaceMutation: AddConsumedInterfaceGQL,
              private removeConsumedInterfaceMutation: RemoveConsumedInterfaceGQL,
              private getSearchIssueGraphDataQuery: GetIssueGraphDataForSearchGQL) { }

  loadIssueGraphData(projectId: string, categories: SelectedCategories, labels: FilterLabel[], texts: string[]): Observable<GraphData> {
    const activeCategories: IssueCategory[] = [];
    for (const key of Object.values(IssueCategory)) {
      if (categories[key]) {
        activeCategories.push(key as IssueCategory);
      }
    }
    if (labels.length === 0 && texts.length === 0) {
      return this.getFullIssueGraphDataQuery.fetch({ projectId, activeCategories }).pipe(
        map(result => GraphDataFactory.removeFilteredData(GraphDataFactory.graphDataFromGQL(result.data), activeCategories)
        ));
    } else {
      const selectedLabels: string[] = labels.map(label => label.id);
      const issueRegex = this.textsToRegex(texts);
      return this.getSearchIssueGraphDataQuery.fetch({ projectId, activeCategories, selectedLabels, issueRegex }).pipe(
        map(result => GraphDataFactory.removeFilteredData(GraphDataFactory.graphDataFromGQL(result.data), activeCategories)
        ));
    }
  }

  textsToRegex(texts: string[]): string {
    if (texts.length === 0) {
      return undefined;
    }
    return texts.map(text => '(' + text + ')').join('|');
  }

  addConsumedInterface(componentId: string, interfaceId: string) {
    return this.addConsumedInterfaceMutation.mutate({ input: { componentId, interfaceId } });
  }

  removeConsumedInterface(componentId: string, interfaceId: string) {
    return this.removeConsumedInterfaceMutation.mutate({ input: { componentId, interfaceId } });
  }
}

