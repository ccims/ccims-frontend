import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {
  AddLabelToIssueGQL,
  AddLabelToIssueInput,
  CreateLabelGQL,
  CreateLabelInput,
  GetLabelsGQL,
  Label,
  RemoveLabelFromIssueGQL,
  RemoveLabelFromIssueInput
} from '../../../generated/graphql';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelStoreService {

  constructor(private getLabelsGQL: GetLabelsGQL, private createLabelMutation: CreateLabelGQL,
              private addLabelToIssueMutation: AddLabelToIssueGQL, private removeLabelFromIssueMutation: RemoveLabelFromIssueGQL) {
  }


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
      map(items => items.filter(x => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1))
    );
  }

  /**
   * Retrieve all labels from backend
   * @param projectId id of current project
   */
  private getAllFilter(projectId: string): Observable<FilterLabel[]> {
    return this.getLabelsGQL.fetch({projectId}).pipe(
      map(({data}) => data.node.labels.nodes)
    );
  }

  public createLabel(input: CreateLabelInput) {
    return this.createLabelMutation.mutate({input});
  }

  /**
   * Determine whether the background color is light or dark
   * @param color giben background color of a label
   * @returns white for a dark background color and black if the background color is light
   */
  public lightOrDark(color) {
    // Variables for red, green, blue values
    let r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

      // If RGB --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
    } else {

      // If hex --> Convert it to RGB: http://gist.github.com/983661
      color = +('0x' + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }

    // HSP (Hue-Sat-Perceived-brightness) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    // Compare against gamma-adjusted tipping point
    if (hsp > Math.sqrt(0.5) * 255) {
      return 'black';
    } else {
      return 'white';
    }
  }

  public addLabel(input: AddLabelToIssueInput) {
    return this.addLabelToIssueMutation.mutate({input});
  }

  public removeLabel(input: RemoveLabelFromIssueInput) {
    return this.removeLabelFromIssueMutation.mutate({input});
  }
}

export type FilterLabel = Pick<Label, 'id' | 'name' | 'color'>;

export function isFilterLabel(label: any) {
  return 'id' in label && 'name' in label && 'color' in label;
}
