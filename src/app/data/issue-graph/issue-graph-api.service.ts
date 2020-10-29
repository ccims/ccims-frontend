import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AddConsumedInterfaceGQL, GetIssueGraphDataGQL, IssueCategory, RemoveConsumedInterfaceGQL } from 'src/generated/graphql';
import { GraphData, GraphDataFactory } from './graph-data';
import { Observable } from 'rxjs';
import { SelectedCategories } from '@app/graphs/shared';
import { FilterLabel } from '../label/label-store.service';
import { GetIssueGraphDataForLabelsGQL } from '../../../generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class IssueGraphApiService {

  constructor(private getIssueGraphDataQuery: GetIssueGraphDataGQL, private getIssueGraphDataForLabelsQuery: GetIssueGraphDataForLabelsGQL,
              private addConsumedInterfaceMutation: AddConsumedInterfaceGQL,
              private removeConsumedInterfaceMutation: RemoveConsumedInterfaceGQL) { }

  loadIssueGraphData(projectId: string, categories: SelectedCategories, labels: FilterLabel[]): Observable<GraphData> {
    const activeCategories: IssueCategory[] = [];
    for (const key of Object.values(IssueCategory)) {
      if (categories[key]) {
        activeCategories.push(key as IssueCategory);
      }
    }
    if (labels.length === 0) {
      return this.getIssueGraphDataQuery.fetch({ projectId, activeCategories }).pipe(
        map(result => GraphDataFactory.removeFilteredData(GraphDataFactory.graphDataFromGQL(result.data), activeCategories)
      ));
    } else {
      const selectedLabels: string[] = labels.map(label => label.id);
      return this.getIssueGraphDataForLabelsQuery.fetch({ projectId, activeCategories, selectedLabels}).pipe(
        map(result => GraphDataFactory.removeFilteredData(GraphDataFactory.graphDataFromGQL(result.data), activeCategories)
      ));
    }
  }

  addConsumedInterface(componentId: string, interfaceId: string) {
    return this.addConsumedInterfaceMutation.mutate({ input: { componentId, interfaceId } });
  }

  removeConsumedInterface(componentId: string, interfaceId: string) {
    return this.removeConsumedInterfaceMutation.mutate({ input: { componentId, interfaceId } });
  }



}
